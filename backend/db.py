from pymongo import MongoClient
client = MongoClient("mongodb://localhost:27017/") 
db = client["resume_analyzer"]
users_collection = db["users"]
resume_collection = db["resume_analysis"]