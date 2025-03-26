from typing import Annotated

from fastapi import APIRouter
from fastapi.params import Depends

from database import DBSession
from dependencies import logged_in_user
from models.task import Task, TaskAdd
from models.user import User

router = APIRouter(prefix='/tasks')


@router.get('/')
def get_tasks(user: Annotated[User, Depends(logged_in_user)]):
    return {"msg": "Not implemented yet"}


@router.post("/add_task")
def add_task(db: DBSession, user: Annotated[User, Depends(logged_in_user)], task: TaskAdd):
    sql_task = Task(user_id=user.id, name=task.name, text=task.text, start=task.start, end=task.end)
    db.add(sql_task)
    db.commit()
