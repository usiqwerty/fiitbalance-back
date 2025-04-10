from typing import Annotated

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from sqlmodel import select

from database import DBSession
from dependencies import logged_in_user
from models.task import Task, TaskAdd
from models.user import User

router = APIRouter(prefix='/tasks')


@router.get('/')
def get_tasks(db: DBSession, user: Annotated[User, Depends(logged_in_user)]):
    query = select(Task).where(Task.user_id == user.id)
    tasks = db.exec(query)
    return tasks.all()


@router.delete('/delete_task')
def get_tasks(db: DBSession, user: Annotated[User, Depends(logged_in_user)], task_id: int):
    query = select(Task).where(Task.user_id == user.id, Task.id == task_id)
    task = db.exec(query).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()


@router.post("/add_task")
def add_task(db: DBSession, user: Annotated[User, Depends(logged_in_user)], task: TaskAdd):
    sql_task = Task(user_id=user.id, name=task.name, text=task.text,
                    start=task.start, end=task.end, difficulty=task.difficulty)
    db.add(sql_task)
    db.commit()
