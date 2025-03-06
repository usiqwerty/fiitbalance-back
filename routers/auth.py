import datetime

import jwt
from fastapi import APIRouter, HTTPException, Response
from sqlmodel import select

from database import DBSession
from dependencies import JWT_SECRET
from models.user import User, LoginUser, RegisterUser

router = APIRouter(prefix='/auth')


def create_auth_token(user: User) -> str:
    token_data = {
        'id': user.id,
        'until': int((datetime.datetime.now() + datetime.timedelta(days=90)).timestamp())
    }
    return jwt.encode(token_data, JWT_SECRET, algorithm='HS256')


@router.post('/login')
def login(db: DBSession,
          response: Response,
          input_data: LoginUser):
    user = db.exec(select(User).where(User.email == input_data.email)).first()

    if user is None or user.password != input_data.password:
        raise HTTPException(status_code=401, detail="Login failed")

    response.set_cookie(key="auth_token", value=create_auth_token(user))


@router.post('/register')
def register(db: DBSession, response: Response, data: RegisterUser):
    if db.exec(select(User).where(User.email == data.email)).first() is not None:
        raise HTTPException(status_code=401, detail="Provided email is already in use")

    user = User(name=data.name, email=data.email, password=data.password)
    db.add(user)
    db.commit()
    response.set_cookie(key="auth_token", value=create_auth_token(user))
