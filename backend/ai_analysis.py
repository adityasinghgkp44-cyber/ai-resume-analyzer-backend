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

Do NOT return markdown.
Do NOT use ```json.
Do NOT add explanations.

Use this exact format:

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
            model="MODEL_NAME",
            contents=prompt,
        )

        response_text = response.text.strip()

        try:
            return json.loads(response_text)

        except Exception:

            cleaned = (
                response_text
                .replace("```json", "")
                .replace("```", "")
                .strip()
            )

            return json.loads(cleaned)

    except Exception as e:

        return {
            "error": str(e),
            "ats_score": 0,
            "top_skills": [],
            "missing_skills": [],
            "strengths": [],
            "weaknesses": [],
            "suggestions": [],
            "interview_questions": []
        }