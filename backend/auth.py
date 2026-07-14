import jwt
from flask import request, jsonify
from functools import wraps

SECRET_KEY = "SECRET_KEY"


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({
                "error": "Token is missing"
            }), 401

        if not auth_header.startswith("Bearer "):
            return jsonify({
                "error": "Authorization header must start with Bearer"
            }), 401

        token = auth_header.split(" ")[1]

        try:
            # Debug payload (without verifying signature)
            print("JWT Payload:", jwt.decode(
                token,
                options={"verify_signature": False}
            ))

            data = jwt.decode(
                token,
                SECRET_KEY,
                algorithms=["HS256"]
            )

        except Exception as e:
            return jsonify({
                "error": type(e).__name__,
                "message": str(e)
            }), 401

        return f(data, *args, **kwargs)

    return decorated