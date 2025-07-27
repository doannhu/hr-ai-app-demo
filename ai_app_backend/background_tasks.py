"""
Background task processing for candidate evaluation.

This module handles the asynchronous evaluation of candidate answers
to prevent blocking the main request thread.
"""

import asyncio
import threading
from typing import List, Dict
from sqlalchemy.orm import Session
import models, database, evaluation
from ideal_answers import ideal_answers


def evaluate_candidate_background(candidate_id: int, answers_data: List[Dict]):
    """
    Background task to evaluate candidate answers.
    
    This function runs in a separate thread to avoid blocking the main request.
    """
    try:
        # Get database session
        db = database.SessionLocal()
        
        try:
            # Update candidate status to processing
            candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
            if candidate:
                candidate.evaluation_status = 'processing'
                db.commit()
            
            # Evaluate answers
            evaluation_results = evaluation.evaluate_candidate_answers(answers_data)
            
            # Update answers with evaluation results
            for i, (ans_data, eval_data) in enumerate(zip(answers_data, evaluation_results)):
                answer = db.query(models.Answer).filter(
                    models.Answer.candidate_id == candidate_id,
                    models.Answer.question_id == ans_data['id']
                ).first()
                
                if answer:
                    answer.evaluation_score = eval_data['score']
                    answer.evaluation_feedback = eval_data['feedback']
                    answer.evaluation_status = 'completed'
            
            # Update candidate status to completed
            if candidate:
                candidate.evaluation_status = 'completed'
                db.commit()
                
        finally:
            db.close()
            
    except Exception as e:
        # Handle errors and update status
        db = database.SessionLocal()
        try:
            candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
            if candidate:
                candidate.evaluation_status = 'failed'
                db.commit()
        finally:
            db.close()
        print(f"Error in background evaluation for candidate {candidate_id}: {e}")


def start_background_evaluation(candidate_id: int, answers_data: List[Dict]):
    """
    Start background evaluation in a separate thread.
    """
    thread = threading.Thread(
        target=evaluate_candidate_background,
        args=(candidate_id, answers_data),
        daemon=True
    )
    thread.start()
    return thread 