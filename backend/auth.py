import jwt
from flask import request, jsonify
from functools import wraps

SECRET_KEY = "SECRET_KEY"

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"error": "Token is missing"}), 401

        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Invalid Authorization header"}), 401

        token = auth_header.split(" ")[1]

        try:
            data = jwt.decode(
                token,
                SECRET_KEY,
                algorithms=["HS256"]
            )
        except Exception:
            return jsonify({"error": "Invalid or expired token"}), 401

        return f(data, *args, **kwargs)

    return decorated