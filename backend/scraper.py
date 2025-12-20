import requests
from bs4 import BeautifulSoup
import re

def scrape_wikipedia(url: str):
    """
    Fetches a Wikipedia URL and returns the title and cleaned text content.
    """
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status() 
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        title_element = soup.find(id="firstHeading")
        title = title_element.text if title_element else "Unknown Title"

        content_div = soup.find(id="bodyContent")
        
        if not content_div:
            return None

        paragraphs = content_div.find_all('p')
        
        clean_text = ""
        
        for p in paragraphs:
            text = p.get_text()
            if len(text) > 50:
                clean_text += text + "\n"

        clean_text = re.sub(r'\[.*?\]', '', clean_text)
        
        return {
            "title": title,
            "content": clean_text[:8000] 
        }

    except Exception as e:
        print(f"Error scraping URL: {e}")
        return None