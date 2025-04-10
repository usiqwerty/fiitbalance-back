from datetime import datetime
from fastapi import Request, FastAPI
from fastapi.templating import Jinja2Templates
from starlette.staticfiles import StaticFiles

front_app = FastAPI()
templates = Jinja2Templates(directory="frontend/pages")
front_app.mount("/static", StaticFiles(directory="frontend/static"), name="static")

@front_app.get("/")
def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@front_app.get("/schedule")
def schedule(request: Request):
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