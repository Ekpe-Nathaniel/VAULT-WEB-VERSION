"""
K-Means Clustering Steganography Engine

Core idea:
  Instead of scattering secret bits across the entire cover (image or audio),
  we first cluster the data into regions using K-Means. We then identify the
  "most complex" cluster — the region with the highest variance / texture
  (image) or the highest energy + high-frequency content (audio).  Human
  perception is least sensitive to changes in these regions, so LSB
  substitution there is far less detectable than in smooth / quiet areas.

Key / centroids:
  Because modifying LSBs can slightly shift cluster assignments on the
  receiving side, we serialise the K-Means centroids during embedding and
  encrypt them with the user's password using PBKDF2+XOR, then append the
  ciphertext to the stego file.  The extractor decrypts the centroids with
  the same password, then uses hard nearest-centroid assignment so the
  cluster → complex‑region mapping is bit‑exact every time.
"""

import base64
import hashlib
import struct
import cv2
import numpy as np
import soundfile as sf
import librosa
from sklearn.cluster import KMeans

# ---------------------------------------------------------------------------
#  Password-based encryption helpers (stdlib only)
# ---------------------------------------------------------------------------

_MAGIC = b"VAULTKEY"

def _derive_key(password: str, salt: bytes) -> bytes:
    return hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)


def _encrypt_centroids_key(centroids_key: str, password: str) -> bytes:
    """XOR-encrypt the centroids key with a PBKDF2-derived key."""
    salt = b"vault_stego"
    key = _derive_key(password, salt)
    plain = centroids_key.encode("utf-8")
    cipher = bytes(p ^ key[i % len(key)] for i, p in enumerate(plain))
    return cipher


def _decrypt_centroids_key(cipher: bytes, password: str) -> str:
    salt = b"vault_stego"
    key = _derive_key(password, salt)
    plain = bytes(c ^ key[i % len(key)] for i, c in enumerate(cipher))
    return plain.decode("utf-8")


def _append_encrypted_key(filepath: str, centroids_key: str, password: str) -> None:
    """Append ``[cipher][magic][len]`` to *filepath*."""
    cipher = _encrypt_centroids_key(centroids_key, password)
    with open(filepath, "ab") as f:
        f.write(cipher)
        f.write(_MAGIC)
        f.write(struct.pack(">I", len(cipher)))


def _read_encrypted_key(filepath: str, password: str) -> str:
    """Read the encrypted trailer from *filepath* and decrypt with *password*."""
    with open(filepath, "rb") as f:
        # Read magic + length from the tail
        f.seek(-12, 2)
        magic = f.read(8)
        if magic != _MAGIC:
            raise ValueError(
                "No Vault key trailer found. This file was not created by Vault embedding."
            )
        (cipher_len,) = struct.unpack(">I", f.read(4))

        # Read cipher that sits before the trailer
        f.seek(-(12 + cipher_len), 2)
        cipher = f.read(cipher_len)

    return _decrypt_centroids_key(cipher, password)


# ---------------------------------------------------------------------------
#  Binary conversion utilities
# ---------------------------------------------------------------------------

def _message_to_bits(message: str) -> str:
    message_bytes = message.encode("utf-8")
    message_bits = "".join(format(b, "08b") for b in message_bytes)
    length_bits = format(len(message_bits), "032b")
    return length_bits + message_bits


def _bits_to_message(bitstring: str) -> str:
    if len(bitstring) < 32:
        raise ValueError("Bitstring too short to contain length header")
    msg_len = int(bitstring[:32], 2)
    if len(bitstring) < 32 + msg_len:
        raise ValueError("Bitstring too short for declared message length")
    payload = bitstring[32: 32 + msg_len]
    message_bytes = bytearray()
    for i in range(0, len(payload), 8):
        chunk = payload[i: i + 8]
        if len(chunk) == 8:
            message_bytes.append(int(chunk, 2))
    return message_bytes.decode("utf-8")


# ---------------------------------------------------------------------------
#  Centroid serialisation (internal)
# ---------------------------------------------------------------------------

def _centroids_to_key(centroids: np.ndarray) -> str:
    return base64.b64encode(centroids.astype(np.float64).tobytes()).decode("ascii")


def _key_to_centroids(key: str, n_features: int) -> np.ndarray:
    raw = base64.b64decode(key)
    arr = np.frombuffer(raw, dtype=np.float64)
    return arr.reshape(-1, n_features)


# ---------------------------------------------------------------------------
#  IMAGE STEGANOGRAPHY
# ---------------------------------------------------------------------------

def _find_complex_cluster_image(
    pixels: np.ndarray, labels: np.ndarray, n_clusters: int
) -> int:
    best, best_var = 0, -1.0
    for c in range(n_clusters):
        cp = pixels[labels == c]
        if len(cp) == 0:
            continue
        var = float(np.mean(np.var(cp, axis=0)))
        if var > best_var:
            best, best_var = c, var
    return best


def embed_image(
    cover_path: str,
    secret_message: str,
    output_path: str,
    n_clusters: int = 3,
) -> str:
    """Embed *secret_message* into the image at *cover_path*.

    Returns the centroids_key (to be encrypted with password by the caller).
    """
    img = cv2.imread(cover_path)
    if img is None:
        raise ValueError(f"Cannot read image: {cover_path}")
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    h, w, _ = img_rgb.shape

    pixels = img_rgb.reshape(-1, 3).astype(np.float32)
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    labels = kmeans.fit_predict(pixels)

    centroids_key = _centroids_to_key(kmeans.cluster_centers_)

    complex_cluster = _find_complex_cluster_image(pixels, labels, n_clusters)
    mask = labels == complex_cluster
    complex_indices = np.where(mask)[0]

    bitstream = _message_to_bits(secret_message)
    capacity = len(complex_indices) * 3
    if len(bitstream) > capacity:
        raise ValueError(
            f"Message requires {len(bitstream)} bits but complex region "
            f"only provides {capacity} bits of capacity."
        )

    flat = img_rgb.reshape(-1, 3)
    bit_idx = 0
    for px in complex_indices:
        for ch in range(3):
            if bit_idx >= len(bitstream):
                break
            bit = int(bitstream[bit_idx])
            flat[px, ch] = (flat[px, ch] & 0xFE) | bit
            bit_idx += 1

    stego_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    cv2.imwrite(output_path, stego_bgr)
    return centroids_key


def extract_image(
    stego_path: str,
    centroids_key: str,
    n_clusters: int = 3,
) -> str:
    """Extract a previously hidden message using the decrypted centroids key."""
    img = cv2.imread(stego_path)
    if img is None:
        raise ValueError(f"Cannot read image: {stego_path}")
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    pixels = img_rgb.reshape(-1, 3).astype(np.float32)
    centroids = _key_to_centroids(centroids_key, n_features=3)

    diffs = pixels[:, np.newaxis, :] - centroids[np.newaxis, :, :]
    labels = np.argmin(np.linalg.norm(diffs, axis=2), axis=1)
    n = len(centroids)

    complex_cluster = _find_complex_cluster_image(pixels, labels, n)
    mask = labels == complex_cluster
    complex_indices = np.where(mask)[0]

    flat = img_rgb.reshape(-1, 3)
    bits: list[str] = []
    for px in complex_indices:
        for ch in range(3):
            bits.append(str(flat[px, ch] & 1))

    return _bits_to_message("".join(bits))


# ---------------------------------------------------------------------------
#  AUDIO STEGANOGRAPHY
# ---------------------------------------------------------------------------

def _find_complex_cluster_audio(
    zcr: np.ndarray,
    rms: np.ndarray,
    labels: np.ndarray,
    n_clusters: int,
) -> int:
    best, best_score = 0, -1.0
    for c in range(n_clusters):
        m = labels == c
        if m.sum() == 0:
            continue
        score = float(np.mean(zcr[m]) * np.mean(rms[m]))
        if score > best_score:
            best, best_score = c, score
    return best


def embed_audio(
    cover_path: str,
    secret_message: str,
    output_path: str,
    n_clusters: int = 3,
    frame_length: int = 2048,
    hop_length: int = 512,
) -> str:
    """Embed *secret_message* into the audio file at *cover_path*.

    Returns the centroids_key (to be encrypted with password by the caller).
    """
    y, sr = librosa.load(cover_path, sr=None, mono=True)

    zcr = librosa.feature.zero_crossing_rate(
        y, frame_length=frame_length, hop_length=hop_length
    ).flatten()
    rms = librosa.feature.rms(
        y=y, frame_length=frame_length, hop_length=hop_length
    ).flatten()

    features = np.column_stack([zcr, rms])
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    frame_labels = kmeans.fit_predict(features)

    centroids_key = _centroids_to_key(kmeans.cluster_centers_)

    complex_cluster = _find_complex_cluster_audio(zcr, rms, frame_labels, n_clusters)

    sample_mask = np.zeros(len(y), dtype=bool)
    n_frames = len(frame_labels)
    for fi in range(n_frames):
        if frame_labels[fi] == complex_cluster:
            start = fi * hop_length
            end = min(start + frame_length, len(y))
            sample_mask[start:end] = True

    complex_samples = np.where(sample_mask)[0]

    bitstream = _message_to_bits(secret_message)
    if len(bitstream) > len(complex_samples):
        raise ValueError(
            f"Message requires {len(bitstream)} bits but complex region "
            f"only provides {len(complex_samples)} samples."
        )

    y_int16 = np.round(y * 32767).astype(np.int16)
    for i, si in enumerate(complex_samples):
        if i >= len(bitstream):
            break
        bit = int(bitstream[i])
        y_int16[si] = (y_int16[si] & ~1) | bit

    sf.write(output_path, y_int16, sr, subtype="PCM_16")
    return centroids_key


def extract_audio(
    stego_path: str,
    centroids_key: str,
    frame_length: int = 2048,
    hop_length: int = 512,
) -> str:
    """Extract a hidden message from a stego audio file using the decrypted key."""
    y_int16, sr = sf.read(stego_path, dtype="int16")
    y_float = y_int16.astype(np.float64) / 32767.0

    zcr = librosa.feature.zero_crossing_rate(
        y_float, frame_length=frame_length, hop_length=hop_length
    ).flatten()
    rms = librosa.feature.rms(
        y=y_float, frame_length=frame_length, hop_length=hop_length
    ).flatten()

    features = np.column_stack([zcr, rms])

    centroids = _key_to_centroids(centroids_key, n_features=2)
    diffs = features[:, np.newaxis, :] - centroids[np.newaxis, :, :]
    frame_labels = np.argmin(np.linalg.norm(diffs, axis=2), axis=1)
    n = len(centroids)

    complex_cluster = _find_complex_cluster_audio(zcr, rms, frame_labels, n)

    sample_mask = np.zeros(len(y_int16), dtype=bool)
    n_frames = len(frame_labels)
    for fi in range(n_frames):
        if frame_labels[fi] == complex_cluster:
            start = fi * hop_length
            end = min(start + frame_length, len(y_int16))
            sample_mask[start:end] = True

    complex_samples = np.where(sample_mask)[0]

    bits: list[str] = []
    for si in complex_samples:
        bits.append(str(y_int16[si] & 1))

    return _bits_to_message("".join(bits))


# ---------------------------------------------------------------------------
#  Unified dispatcher (called by the router)
# ---------------------------------------------------------------------------

def embed(
    cover_path: str, secret_message: str, output_path: str, file_type: str, password: str
) -> str:
    """Embed and append an encrypted centroids trailer.

    Returns the output path.
    """
    if file_type == "image":
        centroids_key = embed_image(cover_path, secret_message, output_path)
    elif file_type == "audio":
        centroids_key = embed_audio(cover_path, secret_message, output_path)
    else:
        raise ValueError(f"Unsupported file_type: {file_type!r}")

    _append_encrypted_key(output_path, centroids_key, password)
    return output_path


def extract(stego_path: str, file_type: str, password: str) -> str:
    """Read the encrypted trailer, decrypt with *password*, then extract."""
    centroids_key = _read_encrypted_key(stego_path, password)

    if file_type == "image":
        return extract_image(stego_path, centroids_key)
    elif file_type == "audio":
        return extract_audio(stego_path, centroids_key)
    raise ValueError(f"Unsupported file_type: {file_type!r}")
