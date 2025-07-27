"""
FastAPI application implementing the backend for the AI candidate evaluation app.

This app exposes endpoints for candidates to submit their information and
answers, for employers to authenticate, and for employers to retrieve
submissions along with AI‑generated evaluations.

Environment variables:
  - OPENAI_API_KEY: API key for calling the ChatGPT API via LangChain.
  - EMPLOYER_USERNAME: username for employer login (default 'admin').
  - EMPLOYER_PASSWORD: password for employer login (default 'password').
  - EMPLOYER_TOKEN: static token issued to authenticated employers.  If not
    provided, a random UUID is generated at startup.
"""

import os
import uuid
from typing import List
from dotenv import load_dotenv

from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Load environment variables from .env file
load_dotenv()

import models, schemas, database, evaluation
from ideal_answers import ideal_answers
import background_tasks


# Create database tables on application startup
models.Base.metadata.create_all(bind=database.engine)


app = FastAPI(title="AI Candidate Evaluation Backend")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


# Read employer credentials from environment or use defaults
EMPLOYER_USERNAME = os.getenv('EMPLOYER_USERNAME', 'admin')
EMPLOYER_PASSWORD = os.getenv('EMPLOYER_PASSWORD', 'password')
EMPLOYER_TOKEN = os.getenv('EMPLOYER_TOKEN', str(uuid.uuid4()))


def get_db():
    """Dependency injection for obtaining a database session."""
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/candidates", status_code=status.HTTP_202_ACCEPTED, response_model=schemas.SubmissionResponse)
def create_candidate(candidate: schemas.CandidateCreate, db: Session = Depends(get_db)):
    """
    Create a new candidate submission with immediate response.
    
    The submission is saved immediately and evaluation is processed in the background.
    Returns submission ID and status immediately.
    """
    # Create candidate record
    cand = models.Candidate(name=candidate.name, phone=candidate.phone, evaluation_status='pending')
    db.add(cand)
    db.commit()
    db.refresh(cand)

    # Save answers without evaluation initially
    answers_data = []
    for ans_data in candidate.answers:
        # Get ideal answer for text questions
        ideal_answer = None
        if ans_data.type == 'text' and ans_data.id in ideal_answers:
            ideal_answer = ideal_answers[ans_data.id]['ideal_answer']
        
        answer_record = models.Answer(
            candidate_id=cand.id,
            question_id=ans_data.id,
            question=ans_data.question,
            type=ans_data.type,
            selected=ans_data.selected,
            answer_text=ans_data.answer,
            evaluation_status='pending',
            ideal_answer=ideal_answer,
        )
        db.add(answer_record)
        answers_data.append(ans_data.model_dump())
    
    db.commit()
    
    # Start background evaluation
    background_tasks.start_background_evaluation(cand.id, answers_data)
    
    return schemas.SubmissionResponse(
        id=cand.id,
        message="Đơn ứng tuyển đã được gửi thành công! Hệ thống đang đánh giá câu trả lời của bạn.",
        status="pending"
    )


@app.get("/candidates/{candidate_id}/status")
def get_evaluation_status(candidate_id: int, db: Session = Depends(get_db)):
    """
    Get the evaluation status for a specific candidate submission.
    """
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    return {
        "id": candidate.id,
        "status": candidate.evaluation_status,
        "message": {
            "pending": "Đang chờ đánh giá...",
            "processing": "Đang đánh giá câu trả lời...",
            "completed": "Đánh giá hoàn thành!",
            "failed": "Có lỗi xảy ra trong quá trình đánh giá."
        }.get(candidate.evaluation_status, "Trạng thái không xác định")
    }


@app.post("/employer/login")
def employer_login(credentials: dict):
    """
    Authenticate an employer and return an authorization token.

    The request body should contain 'username' and 'password' keys.  A
    successful login returns a bearer token which must be included in the
    Authorization header for subsequent employer requests.
    """
    username = credentials.get('username')
    password = credentials.get('password')
    if username == EMPLOYER_USERNAME and password == EMPLOYER_PASSWORD:
        return {"token": EMPLOYER_TOKEN}
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")


@app.get("/candidates", response_model=List[schemas.CandidateOut])
def list_candidates(
    authorization: str = Header(None, description="Bearer token for employer authentication"),
    db: Session = Depends(get_db),
):
    """
    Return all candidate submissions with their evaluated answers.

    This endpoint requires an Authorization header with a valid bearer token.
    If the token is invalid or missing, a 401 error is returned.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header",
        )
    token = authorization.split(" ", 1)[1]
    if token != EMPLOYER_TOKEN:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    candidates = db.query(models.Candidate).all()
    return candidates