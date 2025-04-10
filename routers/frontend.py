from datetime import datetime
from typing import Annotated

from fastapi import Request, FastAPI, Depends
from fastapi.templating import Jinja2Templates
from starlette.staticfiles import StaticFiles

from dependencies import redirect_login_user
from models.user import User

front_app = FastAPI()
templates = Jinja2Templates(directory="frontend/pages")
front_app.mount("/static", StaticFiles(directory="frontend/static"), name="static")

@front_app.get("/")
def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@front_app.get("/schedule")
def schedule(request: Request, user: Annotated[User, Depends(redirect_login_user)]):
    return templates.TemplateResponse(
        "schedule.html",
        {
            "request": request,
            "current_date": datetime.now().strftime("%Y-%m-%d"),
            "balance": 0.75
        }
    )

@front_app.get("/login")
def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@front_app.get("/register")
def register(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})