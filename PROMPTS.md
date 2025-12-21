```markdown
# LangChain Prompt Templates

This application uses the following prompt templates to instruct the Google Gemini LLM.

## 1. Quiz Generation Prompt
**Used in:** `backend/quiz_generator.py`
**Purpose:** Converts raw Wikipedia text into structured JSON quiz questions.

```python
template = """
You are an expert quiz creator. Create {num_questions} multiple-choice questions based ONLY on the following text.

Text:
{text}

Output Format:
Return a valid JSON array of objects. Use double quotes for keys and values.

Example structure:
[
    {{
        "question": "What is the capital of France?",
        "options": ["London", "Berlin", "Paris", "Madrid"],
        "correct_answer": "Paris",
        "explanation": "Paris is the capital.",
        "difficulty": "Easy"
    }}
]

JSON Output:
[
  {
    "question": "Which programming language is known for its use in Data Science and Machine Learning?",
    "options": [
      "Java",
      "C++",
      "Python",
      "HTML"
    ],
    "correct_answer": "Python",
    "explanation": "Python has a vast ecosystem of libraries like Pandas and TensorFlow, making it the top choice for Data Science.",
    "difficulty": "Easy"
  },
  {
    "question": "What is the primary function of the 'pandas' library in Python?",
    "options": [
      "Web Development",
      "Data Manipulation and Analysis",
      "Game Development",
      "Network Security"
    ],
    "correct_answer": "Data Manipulation and Analysis",
    "explanation": "Pandas provides data structures and functions needed to manipulate structured data seamlessly.",
    "difficulty": "Medium"
  }
]
"""