from urllib import response

import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

# Load environment variables
load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("models/gemini-2.5-flash")


def analyze_resume(resume_text):

    prompt = f"""
    Analyze this resume.

    Return ONLY valid JSON.
    Do not add markdown
    Do not use '''json
    do not add explanatoins

    Format:

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

    response = model.generate_content(prompt)

    response_text = response.text

    # Remove markdown formatting
    response_text = response_text.replace("```json", "").replace("```", "").strip()

    try:
        data = json.loads(response_text)
    except Exception as e:
        data = {
            "error": str(e),
            "raw_response": response_text
        }
        
    return data