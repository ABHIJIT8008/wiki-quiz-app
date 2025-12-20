import json
import os
import re
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

llm = ChatGoogleGenerativeAI(
    model="gemini-flash-latest",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.3
)

def clean_json_string(text: str):
    """
    Helper function to find and clean JSON from LLM response.
    """
    if isinstance(text, list):
        text = "".join([str(item) for item in text])
        
    pattern = r"```(?:json)?\s*(.*?)```"
    match = re.search(pattern, text, re.DOTALL)
    if match:
        text = match.group(1)

    start_index = text.find('[')
    end_index = text.rfind(']')
    
    if start_index != -1 and end_index != -1:
        text = text[start_index : end_index + 1]
    
    return text.strip()

def generate_quiz_questions(text_content: str, num_questions: int = 5):
    """
    Takes text content and returns a list of quiz questions in JSON format.
    """
    
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
    """
    
    prompt = PromptTemplate(
        input_variables=["num_questions", "text"],
        template=template
    )
    
    chain = prompt | llm
    
    try:
        response = chain.invoke({"num_questions": num_questions, "text": text_content})

        cleaned_json = clean_json_string(response.content)

        quiz_data = json.loads(cleaned_json)
        return quiz_data
        
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}")
        print(f"Raw Content that failed: {response.content}")
        return []
    except Exception as e:
        print(f"General Error generating quiz: {e}")
        return []