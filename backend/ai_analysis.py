import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in .env")

client = genai.Client(api_key=GOOGLE_API_KEY)

MODEL_NAME = "models/gemini-3.5-flash"


def analyze_resume(resume_text):
    
    prompt = f"""
You are an ATS Resume Analyzer.

Analyze the following resume and return ONLY valid JSON.

Do not use markdown.
Do not use ```json.
Do not add any explanation.

Return exactly this format:

{{
    "ats_score": 0,
    "top_skills": [],
    "missing_skills": [],
    "strengths": [],
    "weaknesses": [],
    "suggestions": [],
    "interview_questions": []
}}

Resume:
{resume_text}
"""

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
        )

        response_text = response.text.strip()

        if response_text.startswith("```json"):
            response_text = (
                response_text.replace("```json", "")
                .replace("```", "")
                .strip()
            )

        return json.loads(response_text)

    except json.JSONDecodeError:
        return {
            "ats_score": 0,
            "top_skills": [],
            "missing_skills": [],
            "strengths": [],
            "weaknesses": [],
            "suggestions": [],
            "interview_questions": [],
            "error": "AI returned invalid JSON"
        }

    except Exception as e:
        return {
            "ats_score": 0,
            "top_skills": [],
            "missing_skills": [],
            "strengths": [],
            "weaknesses": [],
            "suggestions": [],
            "interview_questions": [],
            "error": str(e)
        }