import requests
from bs4 import BeautifulSoup

def scrape_wikipedia(url: str):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        title_element = soup.find('h1', {'id': 'firstHeading'})
        title = title_element.text if title_element else "Unknown Topic"
        
        content_div = soup.find('div', {'id': 'bodyContent'})
        paragraphs = content_div.find_all('p') if content_div else []
        
        text_content = " ".join([p.text for p in paragraphs[:10]])
        
        return {
            "title": title,
            "content": text_content
        }
        
    except Exception as e:
        print(f"Scraping Error: {e}")
        return None