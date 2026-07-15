from roadmap import roadmaps

def generate_roadmap(missing_skills):

    result = []

    for skill in missing_skills:

        # Clean the skill name
        clean_skill = skill.strip()

        # Exact match
        if clean_skill in roadmaps:
            result.append({
                "skill": clean_skill,
                "beginner": roadmaps[clean_skill]["beginner"],
                "intermediate": roadmaps[clean_skill]["intermediate"],
                "advanced": roadmaps[clean_skill]["advanced"]
            })
            continue

        # Case-insensitive match
        for key in roadmaps:
            if key.lower() == clean_skill.lower():
                result.append({
                    "skill": key,
                    "beginner": roadmaps[key]["beginner"],
                    "intermediate": roadmaps[key]["intermediate"],
                    "advanced": roadmaps[key]["advanced"]
                })
                break

    return {
        "roadmap": result
    }