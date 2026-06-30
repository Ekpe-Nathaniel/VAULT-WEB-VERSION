import os
import shutil
import tempfile
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from database import get_db
from models import User, HistoryRecord
from auth import get_current_user
from stego_engine import embed, extract


def _normalize_image_name(filename: str) -> str:
    """Force .png extension for image outputs to match actual PNG content."""
    name, ext = os.path.splitext(filename)
    if ext.lower() in (".jpg", ".jpeg", ".webp"):
        return name + ".png"
    return filename

router = APIRouter(prefix="/api/stego", tags=["Steganography"])

STORAGE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "stored_files")
os.makedirs(STORAGE_DIR, exist_ok=True)


def _suffix(filename: str, fallback: str) -> str:
    _, ext = os.path.splitext(filename)
    return ext if ext else fallback


@router.post("/embed")
async def embed_endpoint(
    background_tasks: BackgroundTasks,
    cover_file: UploadFile = File(...),
    secret_message: str = Form(...),
    file_type: str = Form(...),
    password: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if file_type not in ("image", "audio"):
        raise HTTPException(status_code=400, detail="file_type must be 'image' or 'audio'")

    fallback = ".png" if file_type == "image" else ".wav"
    suffix = _suffix(cover_file.filename, fallback)

    tmp_in = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    tmp_in.write(await cover_file.read())
    tmp_in.close()

    # For images, always output as PNG (lossless) to preserve LSB data
    out_suffix = ".png" if file_type == "image" else suffix
    tmp_out = tmp_in.name.replace(suffix, f"_stego{out_suffix}")

    try:
        embed(tmp_in.name, secret_message, tmp_out, file_type, password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding failed: {e}")
    finally:
        if os.path.exists(tmp_in.name):
            os.unlink(tmp_in.name)

    # Persist to storage and record history
    ts = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S%f")
    stored_name = f"{current_user.id}_{ts}_{_normalize_image_name(cover_file.filename)}"
    stored_path = os.path.join(STORAGE_DIR, stored_name)
    shutil.copy2(tmp_out, stored_path)

    record = HistoryRecord(
        user_id=current_user.id,
        operation="embed",
        original_filename=cover_file.filename,
        stego_filename=stored_path,
        file_type=file_type,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    # Schedule deletion of temp output file after response is sent
    background_tasks.add_task(os.unlink, tmp_out)

    return FileResponse(
        tmp_out,
        media_type="application/octet-stream",
        filename=f"stego_{_normalize_image_name(cover_file.filename)}",
    )


@router.post("/extract")
async def extract_endpoint(
    stego_file: UploadFile = File(...),
    file_type: str = Form(...),
    password: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if file_type not in ("image", "audio"):
        raise HTTPException(status_code=400, detail="file_type must be 'image' or 'audio'")

    fallback = ".png" if file_type == "image" else ".wav"
    suffix = _suffix(stego_file.filename, fallback)

    tmp_in = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    tmp_in.write(await stego_file.read())
    tmp_in.close()

    try:
        secret_message = extract(tmp_in.name, file_type, password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {e}")
    finally:
        if os.path.exists(tmp_in.name):
            os.unlink(tmp_in.name)

    return {"secret_message": secret_message}
