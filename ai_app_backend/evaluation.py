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
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain.schema.runnable import RunnableMap

# Load environment variables from .env file
load_dotenv()


# Answer key for multiple choice questions 1–20.
# Keys correspond to question IDs and values are the correct option letter.
MC_ANSWER_KEYS: Dict[int, str] = {
    1: 'B',
    2: 'B',
    3: 'B',
    4: 'B',
    5: 'C',
    6: 'B',
    7: 'B',
    8: 'B',
    9: 'A',
    10: 'A',
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
    model_name = "gpt-4o"
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise RuntimeError(
            'OPENAI_API_KEY environment variable is not set. Please set your OpenAI API key.'
        )
    # Instantiate the chat model.  temperature=0 yields deterministic outputs.
    return ChatOpenAI(model_name=model_name, temperature=0)


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
        "và thái độ chuyên nghiệp cho vị trí chăm sóc khách hàng và bán hàng tại cửa hàng trang sức vàng bạc."
    )
    user_prompt = (
        f"Câu hỏi: {question}\n"
        f"Câu trả lời của ứng viên: {answer}\n"
        "Hãy trả về kết quả ở dạng JSON với hai trường 'score' (một số nguyên 0–2) và 'feedback' (hai câu nhận xét ngắn)."
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


# Step 1: Define schema
schema = [
    ResponseSchema(name="score", description="Score between 0 and 2"),
    ResponseSchema(name="feedback", description="Short feedback on the answer"),
]
parser = StructuredOutputParser.from_response_schemas(schema)

# Step 2: Create prompt
prompt = PromptTemplate(
    input_variables=["question", "ideal_answer", "candidate_answer"],
    template="""
        Bạn là một trợ lý nhân sự chuyên đánh giá câu trả lời phỏng vấn cho vị trí chăm sóc khách hàng tại cửa hàng trang sức bạc.

        Câu hỏi: {question}

        Câu trả lời mẫu (tốt nhất): {ideal_answer}

        Câu trả lời của ứng viên: {candidate_answer}

        Hãy chấm điểm câu trả lời của ứng viên từ 0 đến 2, dựa trên mức độ phù hợp, đầy đủ và chuyên nghiệp.  
        Sau đó, đưa ra **nhận xét ngắn gọn bằng tiếng Việt** giúp ứng viên hiểu mình đã làm tốt gì và cần cải thiện gì.

        Phản hồi của bạn phải đúng định dạng JSON sau:
        {format_instructions}
    """,
    partial_variables={"format_instructions": parser.get_format_instructions()}
)

# Step 3: Define the model
llm = ChatOpenAI(model="gpt-4", temperature=0)

# Step 4: Create a chain using the Runnable interface
chain = (
    {"question": lambda x: x["question"],
     "ideal_answer": lambda x: x["ideal_answer"],
     "candidate_answer": lambda x: x["candidate_answer"]}
    | prompt
    | llm
    | parser
)

# Step 5: Use `.invoke()` instead of `.run()`
def evaluate_answer(question: str, ideal_answer: str, candidate_answer: str):
    return chain.invoke({
        "question": question,
        "ideal_answer": ideal_answer,
        "candidate_answer": candidate_answer
    })

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
    
    # Import ideal answers
    from ideal_answers import ideal_answers
    
    for ans in answers:
        qid = ans.get('id')
        qtype = ans.get('type')
        
        if qtype == 'mc':
            selected = ans.get('selected') or ''
            score, feedback = evaluate_multiple_choice(qid, selected)
        elif qtype == 'text':
            answer_text = ans.get('answer') or ''
            question_text = ans.get('question', '')
            
            # Get ideal answer if available
            ideal_answer = ""
            if qid in ideal_answers:
                ideal_answer = ideal_answers[qid]['ideal_answer']
            
            # Use new structured evaluation with ideal answer
            if ideal_answer:
                try:
                    evaluation_result = evaluate_answer(question_text, ideal_answer, answer_text)
                    score = evaluation_result['score']
                    feedback = evaluation_result['feedback']
                except Exception as e:
                    # Fallback to old method if structured evaluation fails
                    chat_model = get_chat_model()
                    score, feedback = evaluate_short_answer(question_text, answer_text, chat_model)
            else:
                # Fallback to old method if no ideal answer available
                chat_model = get_chat_model()
                score, feedback = evaluate_short_answer(question_text, answer_text, chat_model)
        else:
            score, feedback = 0.0, "Unknown question type"
            
        results.append({'score': score, 'feedback': feedback})
    return results