import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from database import get_db
from models import User, HistoryRecord
from schemas import HistoryRecordResponse, HistoryListResponse
from auth import get_current_user

router = APIRouter(prefix="/api/history", tags=["History"])


@router.get("/", response_model=HistoryListResponse)
def list_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    records = (
        db.query(HistoryRecord)
        .filter(HistoryRecord.user_id == current_user.id)
        .order_by(HistoryRecord.created_at.desc())
        .all()
    )
    return HistoryListResponse(records=records)


@router.delete("/")
def clear_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    records = (
        db.query(HistoryRecord)
        .filter(HistoryRecord.user_id == current_user.id)
        .all()
    )
    for record in records:
        if os.path.exists(record.stego_filename):
            os.unlink(record.stego_filename)
        db.delete(record)
    db.commit()
    return {"detail": "History cleared"}


@router.get("/{record_id}/download")
def download_stego(
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = db.query(HistoryRecord).filter(HistoryRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    if record.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your record")

    if not os.path.exists(record.stego_filename):
        raise HTTPException(status_code=404, detail="Stego file no longer exists on server")

    return FileResponse(
        record.stego_filename,
        media_type="application/octet-stream",
        filename=record.original_filename,
    )
