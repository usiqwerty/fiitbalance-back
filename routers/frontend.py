import datetime
from typing import Annotated

from fastapi import Request, FastAPI, Depends
from fastapi.templating import Jinja2Templates
from starlette.responses import RedirectResponse
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
def schedule(request: Request, date: str = None):
    current_date = datetime.datetime.now().date() if not date else datetime.datetime.strptime(date, "%Y-%m-%d").date()
    prev_date = current_date - datetime.timedelta(days=1)
    next_date = current_date + datetime.timedelta(days=1)

    return templates.TemplateResponse(
        "schedule.html",
        {
            "request": request,
            "current_date": current_date.strftime("%Y-%m-%d"),
            "prev_date": prev_date.strftime("%Y-%m-%d"),
            "next_date": next_date.strftime("%Y-%m-%d"),
        }
    )

@front_app.get("/login")
def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@front_app.get("/register")
def register(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

@front_app.get("/unauthorized")
def unauthorized(request: Request):
    return templates.TemplateResponse("unauthorized.html", {"request": request})

