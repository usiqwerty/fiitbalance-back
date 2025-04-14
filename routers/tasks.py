import datetime
from typing import Annotated

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from sqlmodel import select

from database import DBSession
from dependencies import logged_in_user
from models.task import Task, TaskAdd, TaskUpdate
from models.user import User

router = APIRouter(prefix='/tasks')


@router.get('/')
def get_tasks(db: DBSession, user: Annotated[User, Depends(logged_in_user)]):
    query = select(Task).where(Task.user_id == user.id)
    tasks = db.exec(query)
    return tasks.all()


@router.get("/for_date")
def get_tasks_for_day(db: DBSession, user: Annotated[User, Depends(logged_in_user)], date: datetime.date):
    query = select(Task).where(Task.user_id == user.id, Task.start == date)
    tasks = db.exec(query)
    return tasks.all()

@router.post("/update")
def update_task(db: DBSession,user: Annotated[User, Depends(logged_in_user)], task: TaskUpdate):
    sql_task = db.get(Task, task.id)
    
    if not sql_task:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    
    if sql_task.user_id != user.id:
        raise HTTPException(status_code=403, detail="У вас нет прав на изменение этой задачи")
    
    sql_task.name = task.name
    sql_task.text = task.text
    sql_task.start = task.start.date()
    sql_task.end = task.end.date()
    sql_task.difficulty = task.difficulty
    
    db.commit()
    db.refresh(sql_task)
    
    return {"message": "Задача успешно обновлена", "task": sql_task}

@router.delete('/delete_task')
def delete_task(db: DBSession, user: Annotated[User, Depends(logged_in_user)], task_id: int):
    query = select(Task).where(Task.user_id == user.id, Task.id == task_id)
    task = db.exec(query).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()


@router.post("/add_task")
def add_task(db: DBSession, user: Annotated[User, Depends(logged_in_user)], task: TaskAdd):
    sql_task = Task(user_id=user.id, name=task.name, text=task.text,
                    start=task.start.date(), end=task.end.date(), difficulty=task.difficulty)
    db.add(sql_task)

    db.commit()
    return {"id": sql_task.id}


@router.post("/complete")
def complete_task(db: DBSession, user: Annotated[User, Depends(logged_in_user)], task_id: int, completed: bool = True):
    query = select(Task).where(Task.id == task_id, Task.user_id == user.id)
    task = db.exec(query).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    task.completed = completed
    db.commit()
