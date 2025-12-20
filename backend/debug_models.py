import google.generativeai as genai
import os

# Configure the SDK with your key
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

print(f"Checking models for API Key ending in: ...{api_key[-4:] if api_key else 'None'}")

try:
    print("\n--- AVAILABLE MODELS ---")
    found_any = False
    for m in genai.list_models():
        # We only care about models that can generate text
        if 'generateContent' in m.supported_generation_methods:
            print(f"Name: {m.name}")
            found_any = True
    
    if not found_any:
        print("No models found. Check your API Key permissions.")
        
except Exception as e:
    print(f"\nCRITICAL ERROR: {e}")