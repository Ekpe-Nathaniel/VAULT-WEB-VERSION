# CHAPTER 3: SYSTEM DESIGN AND METHODOLOGY

---

## 3.1 Introduction

This chapter presents the architectural design and methodological framework underpinning the Vault steganography system. The system implements an adaptive steganographic technique that leverages K-Means clustering to identify perceptually complex regions within cover media (images and audio) before embedding secret payloads using Least Significant Bit (LSB) substitution. The design philosophy centres on three core principles: **perceptual transparency** — embedding data in regions where human感官 are least sensitive to alterations; **security** — encrypting critical embedding parameters with a user-supplied password; and **deterministic extraction** — ensuring the recipient can reliably recover the hidden message using only the correct password.

The chapter proceeds by describing the system architecture at both high and operational levels, followed by a detailed examination of the cover media preparation pipelines for images and audio. Thereafter, the feature extraction techniques used for perceptual segmentation are presented, with separate subsections dedicated to the image and audio feature sets.

---

## 3.2 System Architecture

The Vault system adopts a client-server architecture with a clear separation of concerns between the presentation layer (React-based frontend) and the application logic layer (Python FastAPI backend). The backend encapsulates all steganographic operations, user authentication, and persistent storage, while the frontend provides an interactive interface for file upload, parameter configuration, and result visualisation.

### 3.2.1 High Level System Design

The system comprises five primary modules, each with a distinct responsibility:

**1. Presentation Layer (Frontend)**
Built with React 19 and TypeScript, the frontend communicates with the backend exclusively through RESTful HTTP endpoints. State management is handled by Zustand, with separate stores for authentication (`authStore.ts`), embedding workflow (`embedStore.ts`), extraction workflow (`extractStore.ts`), and theme preferences (`themeStore.ts`). The frontend implements an optimistic authentication model: on startup, it attempts to authenticate against the backend using a fallback credential, and if that fails, it auto-registers a new user. This design ensures zero configuration for end-users while maintaining a valid API token for all subsequent requests. Firebase authentication is supported as an alternative provider but is optional and configurable via environment variables.

**2. API Layer (Routers)**
The FastAPI application (`main.py`) exposes three router groups:
- `/api/users` — handles user registration and login with bcrypt password hashing and JWT token generation (HS256 algorithm, 24-hour token expiry).
- `/api/stego` — exposes `/embed` and `/extract` endpoints that accept multipart file uploads alongside form parameters (secret message, file type, password).
- `/api/history` — provides CRUD operations for steganographic operation records, including file re-download.

Cross-Origin Resource Sharing (CORS) is configured to allow requests from both port 3000 (Create React App default) and port 5173 (Vite default), facilitating development flexibility.

**3. Steganographic Engine (`stego_engine.py`)**
The core algorithmic module contains the implementation of the K-Means clustering-based perceptual segmentation and LSB substitution. It comprises five functional areas:
- **Binary conversion utilities** — convert UTF-8 messages to and from bitstreams with a 32-bit length header.
- **Centroid serialisation** — encode/decode K-Means cluster centroids to/from base64 strings.
- **Image steganography** — `embed_image()` and `extract_image()` functions.
- **Audio steganography** — `embed_audio()` and `extract_audio()` functions.
- **Password-based encryption** — PBKDF2-derived key XOR encryption for centroids, with HMAC integrity verification and multiple trailer format versions for backward compatibility.

**4. Data Layer (Database)**
SQLite is used as the persistence engine, accessed through SQLAlchemy ORM. Two tables are defined:
- **users** — stores user credentials (username, email, hashed password) and creation timestamp.
- **history** — records each embedding operation with user ID, operation type (embed), original filename, stored file path, file type, and timestamp.

**5. Storage Layer (File System)**
Embedded stego files are persisted to a local directory (`stored_files/`) with filenames prefixed by user ID and a timestamp to prevent collisions and enable retrieval.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                             │
│  ┌───────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────────┐  │
│  │ Auth UI   │  │ Embed UI │  │ Extract UI│  │ History UI       │  │
│  └─────┬─────┘  └────┬─────┘  └─────┬─────┘  └────────┬─────────┘  │
│        │              │              │                  │            │
│  ┌─────┴──────────────┴──────────────┴──────────────────┴─────────┐  │
│  │                    Zustand Stores                               │  │
│  └─────────────────────────────┬───────────────────────────────────┘  │
│                                │ HTTP (REST)                         │
└────────────────────────────────┼─────────────────────────────────────┘
                                 │
┌────────────────────────────────┼─────────────────────────────────────┐
│                        SERVER (FastAPI)                              │
│  ┌──────────────┐  ┌──────────┴──────────┐  ┌───────────────────┐   │
│  │ Users Router │  │ Stego Router        │  │ History Router    │   │
│  │ /api/users   │  │ /api/stego          │  │ /api/history      │   │
│  └──────┬───────┘  └──────────┬──────────┘  └────────┬──────────┘   │
│         │                     │                       │              │
│  ┌──────┴─────────────────────┴───────────────────────┴──────────┐  │
│  │                    Steganographic Engine                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐  │  │
│  │  │ K-Means      │  │ LSB          │  │ Password-based      │  │  │
│  │  │ Clustering   │  │ Substitution │  │ Encryption (PBKDF2) │  │  │
│  │  └──────────────┘  └──────────────┘  └─────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────┘  │
│         │                     │                       │              │
│  ┌──────┴─────────────────────┴───────────────────────┴──────────┐  │
│  │                    Database (SQLite)                            │  │
│  │  ┌──────────┐  ┌─────────────────────────────────────────────┐ │  │
│  │  │ Users    │  │ History                                      │ │  │
│  │  └──────────┘  └─────────────────────────────────────────────┘ │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

**Figure 3.1: High-level system architecture showing the client-server separation and module interactions.**

### 3.2.2 Workflow Overview

The embedding and extraction workflows follow a structured sequence of operations:

**Embedding Workflow:**
1. **Authentication** — The user authenticates via the frontend, obtaining a JWT bearer token.
2. **Cover Media Upload** — The user selects an image (PNG, JPEG, WebP) or audio file (WAV, FLAC) through the UploadDropzone component. Client-side validation enforces a 100 MB size limit and permitted file extensions.
3. **Parameter Configuration** — The user enters the secret message and an access password. The password is subject to strength evaluation via the PasswordStrengthMeter component, which provides real-time feedback.
4. **Server-side Processing** — The frontend sends a multipart POST request to `/api/stego/embed`. The backend:
   - Writes the uploaded file to a temporary location.
   - Invokes the steganographic engine with the cover file path, secret message, file type, and password.
   - The engine performs K-Means clustering on the cover media's feature space, identifies the most perceptually complex cluster, embeds the message using LSB substitution in that region, encrypts the centroids with the password using PBKDF2+XOR, appends an HMAC-authenticated trailer to the stego file, and returns the output path.
   - The stego file is copied to long-term storage and a history record is created.
   - The temporary output file is streamed back to the client as a download, then cleaned up via a background task.
5. **Result Presentation** — The frontend receives the stego file blob and presents a download link to the user, alongside options to reset the workflow or download with a custom filename.

**Extraction Workflow:**
1. **Authentication** — As above.
2. **Stego File Upload** — The user uploads the previously generated stego file through the ExtractDropzone component.
3. **Password Entry** — The user enters the same password used during embedding.
4. **Server-side Processing** — A POST request is sent to `/api/stego/extract`. The backend:
   - Writes the uploaded file to a temporary location.
   - Invokes the extraction function, which reads the encrypted trailer from the end of the file, decrypts the centroids using the provided password (with HMAC verification to detect incorrect passwords), re-computes cluster assignments via nearest-centroid classification, identifies the complex region, reads LSBs sequentially, and reconstructs the original message.
   - The extracted message is returned as a JSON response.
5. **Result Presentation** — The recovered message is displayed in the ExtractResults component, along with metadata (file format, integrity status, timestamp).

**History Workflow:**
Users can view their embedding history in a paginated list on the History page. Each record displays the original filename, operation type, file type, and timestamp. Users may download the original stego file again or clear their entire history (which also removes stored files from the server filesystem).

---

## 3.3 Cover Media Preparation

Before steganographic embedding can commence, cover media must undergo a standardised preparation pipeline. The preparation process ensures that the media is in a suitable format for LSB manipulation and that the feature extraction algorithms operate on consistent, normalised data.

### 3.3.1 Image Processing

The image preparation pipeline for embedding is implemented in the `embed_image()` function within `stego_engine.py`. The process consists of three stages:

**Stage 1 — Loading and Colour Space Conversion:**
The cover image is loaded from disk using OpenCV's `cv2.imread()`, which reads the image in BGR (Blue-Green-Red) colour order by default. Since the subsequent feature extraction and LSB manipulation operate on RGB colour space, an explicit conversion is performed using `cv2.cvtColor()` with the `COLOR_BGR2RGB` flag. The image is represented as a three-dimensional NumPy array of shape `(height, width, 3)`, where each channel value is an 8-bit unsigned integer (0–255).

**Stage 2 — Reshaping for Clustering:**
The RGB pixel array is reshaped from its native `(H, W, 3)` structure into a two-dimensional matrix of shape `(H × W, 3)`. This flattening operation collapses the spatial dimensions while preserving the per-pixel colour channel values, enabling the K-Means algorithm to operate on individual pixels as data points in a three-dimensional colour space (R, G, B).

**Stage 3 — Output Format Normalisation:**
An important design consideration is the preservation of LSB data across file saves. Lossy compression formats such as JPEG employ quantisation and chroma subsampling that destroy LSB modifications. Therefore, upon completion of embedding, the stego image is always saved as a PNG file using `cv2.imwrite()`. The `embed_image()` function enforces this by stripping any JPEG/WebP extension from the output path and replacing it with `.png`. This is complemented by the `_normalize_image_name()` helper in `stego_router.py`, which performs the same transformation at the API layer to ensure consistency between the filename reported to the user and the actual file format stored on disk.

```python
# Excerpt from stego_engine.py — Image preparation
img = cv2.imread(cover_path)
img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
h, w, _ = img_rgb.shape
pixels = img_rgb.reshape(-1, 3).astype(np.float32)
```

### 3.3.2 Audio Processing

Audio processing for steganography presents unique challenges stemming from the continuous nature of audio signals, which can be represented in various sample formats and sample rates. The audio preparation pipeline is implemented in the `embed_audio()` function.

**Stage 1 — Loading and Normalisation:**
The audio file is loaded using the `librosa.load()` function, which reads audio data and normalises it to a floating-point array in the range `[-1.0, 1.0]`. The `sr=None` parameter preserves the original sample rate of the input file, while `mono=True` forces conversion to a single-channel (monophonic) signal. This mono conversion is essential because stereo channels would require either independent embedding (doubling capacity but complicating extraction) or interleaved embedding (reducing perceptual quality).

**Stage 2 — Feature Extraction for Segmentation:**
From the normalised audio signal, two time-domain features are extracted to enable perceptual segmentation:
- **Zero-Crossing Rate (ZCR):** Computed by `librosa.feature.zero_crossing_rate()` with a frame length of 2048 samples and a hop length of 512 samples. ZCR measures the rate at which the audio signal changes sign and serves as a proxy for frequency content — higher ZCR values indicate higher-frequency, noisier regions.
- **Root Mean Square (RMS) Energy:** Computed by `librosa.feature.rms()` with identical frame and hop parameters. RMS energy quantifies the loudness or amplitude of each frame.

These features are column-stacked into a feature matrix of shape `(N_frames, 2)`, where each row represents a frame characterised by its ZCR and RMS values. The frame-level representation, rather than sample-level, reduces the dimensionality of the clustering problem and aligns with perceptual models of audio masking (the human auditory system perceives sound in spectral-temporal windows, not individual samples).

**Stage 3 — Integer Conversion for LSB Manipulation:**
Before embedding, the floating-point audio signal is quantised to 16-bit signed integers using:
```python
y_int16 = np.round(y * 32767).astype(np.int16)
```
This conversion maps the `[-1.0, 1.0]` float range to the `[-32767, 32767]` int16 range. The LSB of each 16-bit sample is then available for manipulation. After embedding, the audio is saved as a WAV file with PCM_16 bit-depth using `soundfile.write()`, ensuring lossless preservation of the modified samples.

---

## 3.4 Feature Extraction for Perceptual Segmentation

The distinguishing innovation of the Vault system lies in its use of unsupervised clustering to identify perceptually complex regions within cover media. Rather than scattering secret bits uniformly or sequentially across the entire cover, the system embeds data selectively in regions where modifications are least likely to be detected by human perception. This approach is inspired by the principles of perceptual audio coding (e.g., MP3) and visual masking in image compression (e.g., JPEG), where perceptually irrelevant information is discarded or modified without compromising subjective quality.

### 3.4.1 Feature Set for Images

For image steganography, the visual system's reduced sensitivity to changes in high-texture, high-variance regions is exploited. The feature space is defined directly by the pixel colour channels in RGB space.

**Feature Vector:**
Each pixel is represented as a three-dimensional feature vector:
```
x_i = (R_i, G_i, B_i)   where R_i, G_i, B_i ∈ [0, 255] ⊂ ℝ
```

The choice of RGB colour space is deliberate: it preserves the full dynamic range of LSB-available bits (24 bits per pixel — 8 per channel) and avoids the chroma subsampling inherent in YCbCr representations.

**K-Means Clustering:**
K-Means clustering is applied to the pixel feature matrix with `n_clusters` defaulting to 3 (a configurable parameter). The algorithm partitions the pixel set into K clusters by minimising the within-cluster sum of squares:
```
argmin_S Σ_{c=1}^{K} Σ_{x∈S_c} ‖x - μ_c‖²
```
where `μ_c` is the centroid of cluster `S_c`, computed as the mean of all pixels assigned to that cluster. The implementation uses `sklearn.cluster.KMeans` with `random_state=42` for deterministic behaviour and `n_init=10` to mitigate local optima.

**Complex Cluster Identification:**
Once clusters are formed, the `_find_complex_cluster_image()` function identifies the cluster with the highest perceptual complexity by computing the mean variance across colour channels:
```python
def _find_complex_cluster_image(pixels, labels, n_clusters):
    best, best_var = 0, -1.0
    for c in range(n_clusters):
        cp = pixels[labels == c]
        if len(cp) == 0: continue
        var = float(np.mean(np.var(cp, axis=0)))
        if var > best_var:
            best, best_var = c, var
    return best
```

The intuition is as follows: high-variance regions correspond to textured areas (e.g., grass, foliage, fabric patterns, noise), where the human visual system's spatial masking effect makes pixel-level alterations less noticeable. Conversely, low-variance regions (smooth skies, skin tones, uniform surfaces) are perceptually sensitive to even minor changes.

**Capacity Estimation:**
The embedding capacity is determined by the number of pixels in the complex cluster multiplied by 3 (one LSB per colour channel). The system verifies that the message bitstream does not exceed this capacity before proceeding:
```python
capacity = len(complex_indices) * 3
if len(bitstream) > capacity:
    raise ValueError(...)
```

### 3.4.2 Feature Set for Audio

Audio steganography employs a two-dimensional feature space derived from the time-domain signal, leveraging psychoacoustic principles of simultaneous masking and temporal masking.

**Feature Vectors:**
Each audio frame is characterised by two scalar features:
```
x_i = (ZCR_i, RMS_i)   where ZCR_i, RMS_i ∈ ℝ⁺
```

- **Zero-Crossing Rate (ZCR):** Defined as:
  ```
  ZCR = (1 / (T - 1)) * Σ_{t=1}^{T-1} 𝟙{s[t] * s[t-1] < 0}
  ```
  where `s[t]` is the audio sample at index `t`, `T` is the number of samples in the frame, and `𝟙{·}` is the indicator function. ZCR correlates strongly with spectral centroid and perceptual brightness; high ZCR values indicate noise-like, unvoiced, or high-frequency content where auditory masking is strongest.

- **Root Mean Square (RMS) Energy:** Defined as:
  ```
  RMS = sqrt((1 / T) * Σ_{t=0}^{T-1} s[t]²)
  ```
  RMS represents the perceptual loudness of the frame. The combination of high ZCR and high RMS occurs in transient-rich, energetic passages — precisely the regions where the human auditory system exhibits the least sensitivity to additive noise (the "masking threshold" effect).

**Frame-Level Representation:**
The audio signal is divided into overlapping frames using a frame length of 2048 samples with a hop length of 512 samples. This yields approximately 43 frames per second of audio at a 44.1 kHz sample rate, providing a sufficiently granular temporal segmentation for effective masking.

**K-Means Clustering and Complex Cluster Identification:**
The K-Means algorithm partitions the frames into K clusters (default 3) based on their (ZCR, RMS) coordinates. The `_find_complex_cluster_audio()` function scores each cluster by the product of the mean ZCR and mean RMS:
```python
def _find_complex_cluster_audio(zcr, rms, labels, n_clusters):
    best, best_score = 0, -1.0
    for c in range(n_clusters):
        m = labels == c
        if m.sum() == 0: continue
        score = float(np.mean(zcr[m]) * np.mean(rms[m]))
        if score > best_score:
            best, best_score = c, score
    return best
```

The multiplicative combination ensures that only frames exhibiting **both** high frequency content (high ZCR) and high energy (high RMS) are selected. This mirrors the psychoacoustic principle that tonal, quiet passages are most vulnerable to detection, while noisy, loud passages provide effective masking.

**Sample Mask Generation:**
The frame-level cluster labels are mapped back to individual samples using the hop length and frame length parameters:
```python
sample_mask = np.zeros(len(y), dtype=bool)
for fi in range(n_frames):
    if frame_labels[fi] == complex_cluster:
        start = fi * hop_length
        end = min(start + frame_length, len(y))
        sample_mask[start:end] = True
```
This generates a boolean mask indicating which audio samples belong to the complex region. LSB substitution is then performed only on these masked samples, embedding one bit per sample.

**Comparison of Image and Audio Feature Sets:**

| Aspect | Image | Audio |
|--------|-------|-------|
| Feature space | RGB pixel values (3D) | ZCR + RMS (2D) |
| Granularity | Per-pixel | Per-frame (2048 samples) |
| Complexity metric | Mean channel variance | Mean ZCR × Mean RMS |
| Perceptual principle | Spatial masking | Auditory masking |
| Capacity unit | Bits per pixel × 3 channels | 1 bit per sample |
| Default clusters | 3 | 3 |

---

## Chapter Summary

This chapter has presented the architectural design and methodological framework of the Vault steganography system. The system employs a modular client-server architecture with a clear separation between the presentation layer, API layer, steganographic engine, data persistence, and file storage. The embedding and extraction workflows were described in detail, illustrating the journey from user interaction through server-side processing to result delivery.

The cover media preparation pipelines for both images and audio were examined, highlighting the necessary format transformations — RGB conversion and PNG enforcement for images, floating-point normalisation and 16-bit quantisation for audio. Finally, the feature extraction methodology underpinning the perceptual segmentation was presented, with K-Means clustering applied to distinct feature sets: RGB colour vectors for images and (ZCR, RMS) frame descriptors for audio. In both cases, the system identifies the most perceptually complex cluster for LSB embedding, thereby maximising concealment while maintaining extraction reliability.

The next chapter will present the implementation details of the password-based encryption subsystem, the trailer format used for key transport, and the experimental evaluation of the system's capacity, imperceptibility, and robustness.
