import jwt

token = auth_header.split(" ")[1]

print(jwt.decode(
    token,
    options={"verify_signature": False}
))