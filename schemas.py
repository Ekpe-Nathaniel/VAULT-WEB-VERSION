from pydantic import BaseModel
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class ExtractResponse(BaseModel):
    secret_message: str


class HistoryRecordResponse(BaseModel):
    id: int
    operation: str
    original_filename: str
    stego_filename: str
    file_type: str
    created_at: datetime

    model_config = {"from_attributes": True}


class HistoryListResponse(BaseModel):
    records: list[HistoryRecordResponse]
