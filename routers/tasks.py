from typing import Annotated

from fastapi import APIRouter
from fastapi.params import Depends

from dependencies import logged_in_user
from models.user import User

router = APIRouter(prefix='/tasks')

@router.get('/')
def get_tasks(user: Annotated[User, Depends(logged_in_user)]):
    return {"msg": "Not implemented yet"}