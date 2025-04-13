import datetime

import jwt
from fastapi import APIRouter, HTTPException, Response
from sqlmodel import select

from database import DBSession
from dependencies import JWT_SECRET
from models.user import User, LoginUser, RegisterUser
from hashlib import sha256

router = APIRouter(prefix='/auth')


def create_auth_token(user: User) -> tuple[str, datetime.datetime]:
    until = datetime.datetime.now() + datetime.timedelta(days=90)
    token_data = {
        'id': user.id,
        'until': int(until.timestamp())
    }
    return jwt.encode(token_data, JWT_SECRET, algorithm='HS256'), until.astimezone(datetime.timezone.utc)


@router.post('/login')
def login(db: DBSession,
          response: Response,
          input_data: LoginUser):
    user = db.exec(select(User).where(User.email == input_data.email)).first()

    hashed_password = sha256(input_data.password.encode()).hexdigest()
    if user is None or user.password != hashed_password:
        raise HTTPException(status_code=401, detail="Login failed")

    token, expires = create_auth_token(user)
    response.set_cookie(key="auth_token", value=token, expires=expires)


@router.post('/register')
def register(db: DBSession, response: Response, data: RegisterUser):
    if db.exec(select(User).where(User.email == data.email)).first() is not None:
        raise HTTPException(status_code=401, detail="Provided email is already in use")

    hashed_password = sha256(data.password.encode()).hexdigest()
    user = User(name=data.name, email=data.email, password=hashed_password)
    db.add(user)
    db.commit()

    token, expires = create_auth_token(user)
    response.set_cookie(key="auth_token", value=token, expires=expires)
@router.post('/logout')
def logout(response: Response):
    response.delete_cookie(key="auth_token")