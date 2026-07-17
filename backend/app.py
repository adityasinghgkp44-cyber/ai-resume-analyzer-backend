from services.job_services import get_required_skills
from skill_services import match_skills, get_missing_skills
from utils.candidate_classifier import detect_candidate_type
from roadmap_service import generate_roadmap
import jwt
import datetime
from jd_matcher import match_resume_with_jd
from ai_analysis import analyze_resume # Import the analyze_resume function from ai_analysis.py
from flask import Flask, request, jsonify
import os
from roadmap import roadmaps
from resume_parser import extract_text # Import the extract_text function from resume_parser.py
from flask_bcrypt import Bcrypt
from db import users_collection
from db import resume_collection
from datetime import datetime, timedelta, timezone
from ats_service import calculate_ats_score
from auth import token_required

#from jd_matcher import extract_skills


app = Flask(__name__)
app.config['SECRET_KEY'] = 'SECRET_KEY'  # Change

bcrypt = Bcrypt(app)

@app.route('/login', methods=['POST'])
def login():

    data = request.json

    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({
        "email": email
    })

    if not user:
        return jsonify({
            "error": "User not found"
        }), 404

    if not bcrypt.check_password_hash(user["password"], password):
        return jsonify({
            "error": "Invalid password"
        }), 401

    print("UTC Time:", datetime.now(timezone.utc))
    print("Expiry:", datetime.now(timezone.utc) + timedelta(hours=24))

    token = jwt.encode(
        {
            "email": email,
            "exp": datetime.now(timezone.utc) + timedelta(hours=24)
        },
        app.config["SECRET_KEY"],
        algorithm="HS256"
    )

   

    return jsonify({

        "success": True,

        "message": "Login Successful",

        "data": {

            "token": token,

            "email": email,

            "username": user["username"]

        }

    })
@app.route('/register', methods = ['POST'])
def register():
    data =request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        return jsonify({"error":"user already  exists"}), 400
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    users_collection.insert_one({
        "username" : username,
        "email" : email,
        "password" : hashed_password

    })

    return jsonify({
        "message": "User registered successfully"
    }), 201
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {"pdf", "docx"}
def allowed_file(filename):
    return (
        "." in filename and
        filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )
@app.route('/')
def home():
    return "API is running"

@app.route('/upload', methods=['POST'])
@token_required
def upload_resume(data):

    if 'resume' not in request.files:
        return jsonify({
            "error": "No file uploaded"
        }), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({
            "error": "No selected file"
        }), 400

    if not allowed_file(file.filename):
        return jsonify({
            "error": "Only PDF and DOCX files are allowed"
        }), 400

    # Job Role
    role = request.form.get("role")

    if not role:
        return jsonify({
            "error": "Please select a job role"
        }), 400

    # Save File
    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    file.save(file_path)

    # Extract Resume Text
    resume_text = extract_text(file_path)

    # Candidate Type
    candidate_type = detect_candidate_type(resume_text)

    # Required Skills from MongoDB
    required_skills = get_required_skills(role)

    if not required_skills:
        return jsonify({
            "error": "Invalid Job Role"
        }), 400

    # Match Skills
    matched_skills = match_skills(
        resume_text,
        required_skills
    )

    missing_skills = get_missing_skills(
        matched_skills,
        required_skills
    )

    # ATS Score
    ats_score = calculate_ats_score(
        matched_skills,
        required_skills
    )

    # AI Analysis
    analysis = analyze_resume(resume_text)

    # Roadmap
    roadmap = generate_roadmap(
        missing_skills
    )

    # Store in MongoDB
    resume_collection.insert_one({

        "resume_name": file.filename,

        "email": data["email"],

        "role": role,

        "candidate_type": candidate_type,

        "ats_score": ats_score,

        "matched_skills": matched_skills,

        "missing_skills": missing_skills,

        "analysis": analysis,

        "roadmap": roadmap

    })

    return jsonify({

        "resume_name": file.filename,

        "candidate_type": candidate_type,

        "role": role,

        "ats_score": ats_score,

        "matched_skills": matched_skills,

        "missing_skills": missing_skills,

        "analysis": analysis,

        "roadmap": roadmap

    })
    

@app.route('/history', methods=['GET'])
@token_required
def get_history(data):

    history = list(
        resume_collection.find({"email" : data['email'] }, {"_id": 0})
    )

    return jsonify({
        "history": history
    })
@app.route('/match-jd', methods=['POST'])
def match_jd():

    data = request.json

    resume_text = data.get("resume_text")
    job_description = data.get("job_description")

    if not resume_text or not job_description:
        return jsonify({
            "error": "resume_text and job_description are required"
        }), 400
       
    result = match_resume_with_jd(
    resume_text,
    job_description

)
    
    return jsonify(result)

@app.route('/roadmap', methods=['POST'])
def roadmap():

    data = request.json

    missing_skills = data.get("missing_skills")

    result = generate_roadmap(missing_skills)

    return jsonify(result)
@app.route('/resume/<resume_name>', methods=['DELETE'])
@token_required
def delete_resume(data, resume_name):

    result = resume_collection.delete_one({
        "email": data["email"],
        "resume_name": resume_name
    })

    if result.deleted_count == 0:
        return jsonify({
            "error": "Resume not found"
        }), 404

    return jsonify({
        "message": "Resume deleted successfully"
    })

if __name__ == '__main__':
    app.run(debug=True)
    