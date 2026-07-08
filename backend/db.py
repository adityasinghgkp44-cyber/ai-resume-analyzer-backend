from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
print("MONGO_URI =", MONGO_URI)

client = MongoClient(MONGO_URI)

db = client["ai_resume_analyzer"]

users_collection = db["users"]
resume_collection = db["resumes"]