from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import models
from database import engine, get_db
from scraper import scrape_wikipedia
from quiz_generator import generate_quiz_questions

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuizRequest(BaseModel):
    url: str
    num_questions: int = 5

@app.get("/")
async def root():
    return {"message": "Wiki Quiz API is running!"}

@app.post("/generate-quiz")
def generate_quiz(request: QuizRequest, db: Session = Depends(get_db)):
    print(f"Scraping URL: {request.url}")
    scraped_data = scrape_wikipedia(request.url)
    
    if not scraped_data:
        raise HTTPException(status_code=400, detail="Failed to scrape Wikipedia page")

    print("Generating Questions...")
    questions_data = generate_quiz_questions(scraped_data['content'], request.num_questions)
    
    if not questions_data:
        raise HTTPException(status_code=500, detail="Failed to generate questions from LLM")

    # Save to Database
    db_quiz = models.Quiz(
        source_url=request.url,
        topic_summary=scraped_data['title']
    )
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)

    for q in questions_data:
        db_question = models.Question(
            quiz_id=db_quiz.id,
            question_text=q['question'],
            options=q['options'],
            correct_answer=q['correct_answer'],
            explanation=q['explanation'],
            difficulty=q['difficulty']
        )
        db.add(db_question)
    
    db.commit()

    return {
        "quiz_id": db_quiz.id, 
        "title": db_quiz.topic_summary,
        "questions": questions_data
    }

@app.get("/quizzes")
def get_quizzes(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    quizzes = db.query(models.Quiz).order_by(models.Quiz.created_at.desc()).offset(skip).limit(limit).all()
    return quizzes

@app.get("/quizzes/{quiz_id}")
def get_quiz_detail(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return {
        "id": quiz.id,
        "source_url": quiz.source_url,
        "topic_summary": quiz.topic_summary,
        "created_at": quiz.created_at,
        "questions": quiz.questions
    }