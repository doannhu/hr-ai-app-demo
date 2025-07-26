"""
Evaluation functions using LangChain and OpenAI.

This module defines helper functions to score multiple choice answers and
evaluate free‑form answers using a language model.  The OpenAI API key must
be supplied via the environment variable ``OPENAI_API_KEY`` before running
the evaluation functions.
"""

import json
import os
from typing import Tuple, List, Dict
from dotenv import load_dotenv

from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

# Load environment variables from .env file
load_dotenv()


# Answer key for multiple choice questions 1–20.
# Keys correspond to question IDs and values are the correct option letter.
MC_ANSWER_KEYS: Dict[int, str] = {
    1: 'B',
    2: 'B',
    3: 'B',
    4: 'B',
    5: 'B',
    6: 'B',
    7: 'A',
    8: 'B',
    9: 'A',
    10: 'B',
    11: 'A',
    12: 'B',
    13: 'C',
    14: 'A',
    15: 'B',
    16: 'B',
    17: 'B',
    18: 'A',
    19: 'A',
    20: 'A',
}


def evaluate_multiple_choice(question_id: int, selected: str) -> Tuple[float, str]:
    """Return a score (1.0 or 0.0) and simple feedback for a multiple choice answer."""
    correct = MC_ANSWER_KEYS.get(question_id)
    if not correct:
        # Unknown question: neutral evaluation
        return 0.0, "No evaluation available"
    if selected == correct:
        return 1.0, "Câu trả lời chính xác"
    return 0.0, f"Đáp án đúng là {correct}"


def get_chat_model() -> ChatOpenAI:
    """Initialize and return a ChatOpenAI model using the environment API key."""
    # This will raise if the API key is not set
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise RuntimeError(
            'OPENAI_API_KEY environment variable is not set. Please set your OpenAI API key.'
        )
    # Instantiate the chat model.  temperature=0 yields deterministic outputs.
    return ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0.0)


def evaluate_short_answer(question: str, answer: str, chat: ChatOpenAI) -> Tuple[float, str]:
    """
    Evaluate a free‑form answer using ChatGPT via LangChain.

    The prompt instructs the model to score the answer on a 0–2 scale based on
    relevance, completeness and professional tone, and to provide a brief
    explanation.  It returns the score and feedback extracted from the model's
    JSON response.  If parsing fails, the raw content is returned as feedback.
    """
    system_prompt = (
        "Bạn là trợ lý nhân sự đánh giá câu trả lời phỏng vấn. "
        "Chấm điểm câu trả lời của ứng viên từ 0 đến 2 dựa trên mức độ đầy đủ, phù hợp "
        "và thái độ chuyên nghiệp."
    )
    user_prompt = (
        f"Câu hỏi: {question}\n"
        f"Câu trả lời của ứng viên: {answer}\n"
        "Hãy trả về kết quả ở dạng JSON với hai trường 'score' (một số nguyên 0–2) và 'feedback' (một câu nhận xét ngắn)."
    )
    messages = [SystemMessage(content=system_prompt), HumanMessage(content=user_prompt)]
    response = chat.invoke(messages)
    content = response.content.strip()
    try:
        data = json.loads(content)
        score = float(data.get('score', 0))
        feedback = data.get('feedback', '')
        return score, feedback
    except Exception:
        # If the model didn't return valid JSON, try to extract a number and treat rest as feedback
        # Fallback: attempt to parse "score: X, feedback: Y" like string
        # Score default to 0
        score = 0.0
        feedback = content
        return score, feedback


def evaluate_candidate_answers(answers: List[dict]) -> List[dict]:
    """
    Given a list of answer dicts from the API request, compute evaluation results.

    Each answer dict must contain:
      - type: 'mc' or 'text'
      - id: question ID
      - question: question text
      - selected: selected letter (for multiple choice)
      - answer: text (for short answer)

    Returns a list of evaluation results with fields 'score' and 'feedback'.
    """
    results: List[dict] = []
    chat_model = None
    for ans in answers:
        qid = ans.get('id')
        qtype = ans.get('type')
        if qtype == 'mc':
            selected = ans.get('selected') or ''
            score, feedback = evaluate_multiple_choice(qid, selected)
        elif qtype == 'text':
            # Lazy initialize the chat model to avoid creating it unnecessarily
            if chat_model is None:
                chat_model = get_chat_model()
            answer_text = ans.get('answer') or ''
            score, feedback = evaluate_short_answer(ans.get('question', ''), answer_text, chat_model)
        else:
            score, feedback = 0.0, "Unknown question type"
        results.append({'score': score, 'feedback': feedback})
    return results