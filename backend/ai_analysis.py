import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GOOGLE_API_KEY")
)


def analyze_resume(resume_text):
    prompt = f"""
You are an ATS Resume Analyzer.

Analyze the following resume.

Return ONLY valid JSON.

Do not return markdown.
Do not use ```json.
Do not add explanations.

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
            model="gemini-2.5-flash",
            contents=prompt
        )

        response_text = response.text.strip()

        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "").replace("```", "").strip()

        return json.loads(response_text)

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