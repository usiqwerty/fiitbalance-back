import datetime
from typing import Annotated

from pydantic import BaseModel
from sqlmodel import SQLModel, Field


class Task(SQLModel, table=True):
    id: Annotated[int, Field(primary_key=True)]
    user_id: int
    name: str
    text: str
    start: datetime.datetime
    end: datetime.datetime


class TaskAdd(BaseModel):
    name: str
    text: str
    start: datetime.datetime
    end: datetime.datetime
