def calculate_ats_score(resume_text):

    score = 0

    resume_text = resume_text.lower()

    # Skills
    skills = [
        "python",
        "java",
        "flask",
        "react",
        "sql",
        "mongodb",
        "git"
    ]

    for skill in skills:
        if skill in resume_text:
            score += 5

    # Sections
    sections = [
        "education",
        "skills",
        "projects",
        "experience"
    ]

    for section in sections:
        if section in resume_text:
            score += 10

    if score > 100:
        score = 100

    return score