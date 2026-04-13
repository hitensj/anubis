from google import genai
from google.genai import types
from config import GEMINI_API_KEY

def get_oracle_judgment(origin, destination, cargo, risk_category, factors, news):
    if not GEMINI_API_KEY:
        return f"The Oracle is silent. Fallback logic warns of {risk_category} risk."

    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        
        prompt = f"""
        You are Anubis, the ancient Egyptian god who guides souls, but reimagined as an AI controlling a modern global supply chain intelligence system. Speak with ancient authority and mysticism, but deliver practical supply chain insights.
        
        Provide a 2-3 sentence judgment regarding a shipment of {cargo} from {origin} to {destination}.
        The network has calculated the risk as {risk_category}.
        Primary factors: Weather ({factors['weather']}/10), Geopolitics ({factors['geopolitical']}/10), News ({factors['news']}/10).
        Recent News context: {news[0]['title'] if news else 'Quiet waters'}.
        
        Render your verdict.
        """
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,
                top_p=0.95,
                top_k=64,
                max_output_tokens=150,
                response_mime_type="text/plain",
            )
        )
        return response.text.replace('\n', ' ').strip()
    except Exception as e:
        print("Gemini API Error:", e)
        return f"The omens are clouded. The winds speak of {risk_category} turbulence."
