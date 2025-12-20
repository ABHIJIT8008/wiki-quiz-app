import requests
from bs4 import BeautifulSoup
import re

def scrape_wikipedia(url: str):
    """
    Fetches a Wikipedia URL and returns the title and cleaned text content.
    """
    try:
        # --- NEW: Add Headers to mimic a browser ---
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        
        # Pass headers=headers here
        response = requests.get(url, headers=headers)
        response.raise_for_status() 
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # 1. Get the Title
        title_element = soup.find(id="firstHeading")
        title = title_element.text if title_element else "Unknown Title"

        # 2. Get the Main Content
        content_div = soup.find(id="bodyContent")
        
        if not content_div:
            return None

        # 3. Extract Paragraphs
        paragraphs = content_div.find_all('p')
        
        clean_text = ""
        
        for p in paragraphs:
            text = p.get_text()
            # Remove empty paragraphs or super short ones
            if len(text) > 50:
                clean_text += text + "\n"

        # 4. Cleaning
        clean_text = re.sub(r'\[.*?\]', '', clean_text)
        
        return {
            "title": title,
            "content": clean_text[:8000] 
        }

    except Exception as e:
        print(f"Error scraping URL: {e}")
        return None