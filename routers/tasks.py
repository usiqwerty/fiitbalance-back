from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import select

from database import DBSession
from dependencies import logged_in_user
from models.task import Task, TaskAdd
from models.user import User

router = APIRouter(prefix='/tasks')


@router.get('/')
def get_tasks(
        db: DBSession,
        user: Annotated[User, Depends(logged_in_user)]
) -> dict:
    """Получение списка задач текущего пользователя"""
    tasks = db.exec(
        select(Task)
        .where(Task.user_id == user.id)
        .order_by(Task.start.asc())
    ).all()

    return {
        "tasks": [
            {
                "id": task.id,
                "name": task.name,
                "text": task.text,
                "start": task.start.isoformat(),
                "end": task.end.isoformat()
            }
            for task in tasks
        ]
    }


@router.post("/add_task")
def add_task(
        db: DBSession,
        user: Annotated[User, Depends(logged_in_user)],
        task: TaskAdd
) -> dict:
    """Добавление новой задачи"""
    sql_task = Task(
        user_id=user.id,
        name=task.name,
        text=task.text,
        start=task.start,
        end=task.end
    )

    db.add(sql_task)
    db.commit()
    db.refresh(sql_task)

    return {"message": "Task added successfully", "task_id": sql_task.id}