from typing import Annotated

from pydantic import BaseModel
from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    id: Annotated[int, Field(primary_key=True)]
    password: str
    email: str


class LoginUser(BaseModel):
    email: str
    password: str


class RegisterUser(BaseModel):
    email: str
    password: str
