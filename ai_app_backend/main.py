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


@app.post("/candidates", status_code=status.HTTP_201_CREATED)
def create_candidate(candidate: schemas.CandidateCreate, db: Session = Depends(get_db)):
    """
    Create a new candidate submission.

    The request body should include the candidate's name, phone number and a list
    of answers (multiple choice or text).  After storing the submission, the
    answers are evaluated using the AI evaluator.
    """
    # Create candidate record
    cand = models.Candidate(name=candidate.name, phone=candidate.phone)
    db.add(cand)
    db.commit()
    db.refresh(cand)

    # Evaluate answers
    evaluation_results = evaluation.evaluate_candidate_answers(
        [answer.model_dump() for answer in candidate.answers]
    )

    # Persist each answer along with the evaluation
    for ans_data, eval_data in zip(candidate.answers, evaluation_results):
        answer_record = models.Answer(
            candidate_id=cand.id,
            question_id=ans_data.id,
            question=ans_data.question,
            type=ans_data.type,
            selected=ans_data.selected,
            answer_text=ans_data.answer,
            evaluation_score=eval_data['score'],
            evaluation_feedback=eval_data['feedback'],
        )
        db.add(answer_record)
    db.commit()
    return {"id": cand.id}


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