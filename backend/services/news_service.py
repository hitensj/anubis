import requests
from config import NEWSAPI_KEY

def get_news(keywords_list):
    if not NEWSAPI_KEY:
        return []
    
    query = " OR ".join(keywords_list)
    url = f"https://newsapi.org/v2/everything?q={query}&language=en&sortBy=publishedAt&pageSize=3"
    
    try:
        res = requests.get(url, headers={"X-Api-Key": NEWSAPI_KEY})
        data = res.json()
        articles = data.get("articles", [])
        
        parsed = []
        for a in articles:
            parsed.append({
                "title": a.get("title", ""),
                "source": "NewsAPI",
                "severity": "HIGH" if any(w in a.get("title","").lower() for w in ["strike", "war", "block", "attack"]) else "MEDIUM"
            })
        return parsed
    except Exception as e:
        print("NewsAPI error:", e)
        return []
