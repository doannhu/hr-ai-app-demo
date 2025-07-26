"""
Pydantic schemas used for request and response validation in the FastAPI
endpoints.  These data classes define the structure of incoming JSON
payloads and outgoing responses.
"""

from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class AnswerCreate(BaseModel):
    """Schema for creating an answer."""

    type: str = Field(..., description="Type of question: 'mc' or 'text'")
    id: int = Field(..., description="Question ID")
    question: str
    selected: Optional[str] = None
    answer: Optional[str] = None


class CandidateCreate(BaseModel):
    """Schema for creating a candidate with answers."""

    name: str
    phone: str
    answers: List[AnswerCreate]


class AnswerOut(BaseModel):
    """Schema for returning an answer with evaluation."""

    question: str
    type: str
    selected: Optional[str] = None
    answer_text: Optional[str] = None
    evaluation_score: Optional[float] = None
    evaluation_feedback: Optional[str] = None

    class Config:
        from_attributes = True


class CandidateOut(BaseModel):
    """Schema for returning a candidate with their answers."""

    id: int
    name: str
    phone: str
    created_at: datetime
    answers: List[AnswerOut]

    class Config:
        from_attributes = True