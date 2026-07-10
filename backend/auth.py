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

        try:
            token = auth_header.split(" ")[1]

            data = jwt.decode(
                token,
                SECRET_KEY,
                algorithms=["HS256"]
            )

        except Exception as e:
         return jsonify({
        "error": str(e)
    }), 401

        return f(data, *args, **kwargs)

    return decorated