import os
from datetime import datetime

import jwt
from fastapi import HTTPException, Request
from sqlmodel import select

from database import DBSession
from models.user import User

# JWT_SECRET = os.getenv('JWT_SECRET')
JWT_SECRET="special_secret_key_so_hackers_wont_hack_our_users"


def logged_in_user(request: Request, db: DBSession):
    token = request.cookies.get('auth_token')
    if token is None:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        token_data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    except jwt.exceptions.DecodeError:
        raise HTTPException(status_code=401, detail="Invalid token data")

    user = db.exec(select(User).where(User.id == token_data['id'])).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid token data")
    if datetime.now() >= datetime.fromtimestamp(token_data['until']):
        raise HTTPException(status_code=401, detail="Token expired")
    return user
