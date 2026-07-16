import os
import json
import time
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

if not API_KEY:
    raise ValueError("OPENROUTER_API_KEY not found in .env")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=API_KEY,
)

MODEL_NAME = "openai/gpt-oss-20b:free"


def analyze_resume(resume_text):

    resume_text = resume_text[:12000]

    prompt = f"""
You are an expert ATS Resume Analyzer.

Analyze the following resume.

Return ONLY valid JSON.

DO NOT use markdown.
DO NOT use ```json.
DO NOT explain anything.

Return exactly this JSON format:

{{
    "ats_score": 0,
    "top_skills": [],
    "missing_skills": [],
    "strengths": [],
    "weaknesses": [],
    "suggestions": [],
    "interview_questions": []
}}

Rules:

1. ATS score must be between 0-100.

2. Top skills:
- Maximum 10 skills.
- Only technology names.

3. Missing skills:
- Only individual technologies.
Correct:
["Docker","MongoDB","AWS","CI/CD","TypeScript"]

Wrong:
["Cloud Platforms (AWS/GCP/Azure)"]

4. Strengths:
Exactly 4 points.

5. Weaknesses:
Exactly 3 points.

6. Suggestions:
Exactly 5 actionable suggestions.

7. Interview Questions:
Exactly 5 interview questions.

Resume:

{resume_text}
"""

    for attempt in range(3):

        try:

            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a professional ATS Resume Analyzer. "
                            "Always respond ONLY with valid JSON."
                        )
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.2,
            )

            response_text = response.choices[0].message.content.strip()

            if response_text.startswith("```json"):
                response_text = (
                    response_text
                    .replace("```json", "")
                    .replace("```", "")
                    .strip()
                )

            if response_text.startswith("```"):
                response_text = (
                    response_text
                    .replace("```", "")
                    .strip()
                )

            analysis = json.loads(response_text)

            return analysis

        except json.JSONDecodeError:

            if attempt < 2:
                time.sleep(2)
                continue

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

            if attempt < 2:
                time.sleep(2)
                continue

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