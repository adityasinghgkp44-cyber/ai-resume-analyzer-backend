from roadmap import roadmaps
def generate_roadmap(missing_skills):

    result = []

    for skill in missing_skills:

        if skill in roadmaps:

            result.append({
                "skill": skill,
                "beginner": roadmaps[skill]["beginner"],
                "intermediate": roadmaps[skill]["intermediate"],
                "advanced": roadmaps[skill]["advanced"]
            })

    return {
        "roadmap": result
    }