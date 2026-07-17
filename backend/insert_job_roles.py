from pymongo import MongoClient
from job_roles import job_roles


client = MongoClient("mongodb+srv://adityasinghgkp44_db_user:Aditya120@cluster0.wrq8om5.mongodb.net/?appName=Cluster0")


db = client["resume_analyzer"]

collection = db["job_roles"]


for role, data in job_roles.items():

    document = {
        "role_name": role,
        "required_skills": data["required_skills"]
    }

    collection.insert_one(document)


print("Job roles inserted successfully")