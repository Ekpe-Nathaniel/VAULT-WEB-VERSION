from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime, timezone
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
    )


class HistoryRecord(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    operation = Column(String, nullable=False)  # "embed" | "extract"
    original_filename = Column(String, nullable=False)
    stego_filename = Column(String, nullable=False)  # stored file path on disk
    file_type = Column(String, nullable=False)  # "image" | "audio"
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
    )
