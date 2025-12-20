from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    source_url = Column(String, index=True)
    topic_summary = Column(Text, nullable=True) # Short summary of what was scraped
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship: One Quiz has many Questions
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    
    question_text = Column(Text)
    options = Column(JSON)  # Stores ["Option A", "Option B", ...]
    correct_answer = Column(String)
    explanation = Column(Text)
    difficulty = Column(String) # Easy, Medium, Hard

    # Relationship link back to Quiz
    quiz = relationship("Quiz", back_populates="questions")