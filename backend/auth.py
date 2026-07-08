import jwt
from flask import request, jsonify
from functools import wraps

SECRET_KEY = "SECRET_KEY"  # Change this to a secure key in production


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        token = request.headers.get("Authorization")

        if not token:
            return jsonify({
                "error": "Token is missing"
            }), 401

        try:
            data = jwt.decode(
                token,
                SECRET_KEY,
                algorithms=["HS256"]
            )

        except:
            return jsonify({
                "error": "Invalid token"
            }), 401

        return f(data, *args, **kwargs)

    return decorated