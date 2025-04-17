import datetime
from typing import Annotated

from fastapi import Request, FastAPI, Depends
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from dependencies import redirect_login_user
from models.user import User
from routers.tasks import router as tasks_router

front_app = FastAPI()
templates = Jinja2Templates(directory="frontend/pages")
front_app.mount("/static", StaticFiles(directory="frontend/static"), name="static")
front_app.include_router(tasks_router)


@front_app.get("/")
def index(request: Request):
    current_date = datetime.datetime.now().strftime("%Y-%m-%d")
    return RedirectResponse(f"/schedule?date={current_date}")


@front_app.get("/schedule")
def schedule(request: Request, user: Annotated[User, Depends(redirect_login_user)], date: datetime.date = None):
    if date is None:
        current_date = datetime.datetime.now().strftime("%Y-%m-%d")
        return RedirectResponse(f"/schedule?date={current_date}")

    return templates.TemplateResponse(
        "schedule.html",
        {
            "request": request,
            "current_date": date,
            "balance": 0.75
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


@front_app.get("/weekStat")
def week_stat(request: Request, user: Annotated[User, Depends(redirect_login_user)], date: datetime.date = None):
    if date is None:
        current_date = datetime.datetime.now().strftime("%Y-%m-%d")
        return RedirectResponse(f"/weekStat?date={current_date}")

    date_obj = datetime.datetime.strptime(str(date), "%Y-%m-%d")
    day_of_week = date_obj.weekday()  # 0 = Monday, 6 = Sunday

    monday = date_obj - datetime.timedelta(days=day_of_week)

    sunday = monday + datetime.timedelta(days=6)

    monday_formatted = format_date(monday)
    sunday_formatted = format_date(sunday)

    return templates.TemplateResponse(
        "weekStat.html",
        {
            "request": request,
            "week_start": monday_formatted,
            "week_end": sunday_formatted,
            "busiest_day": "Loading...",
            "avg_workload": "0.0",
            "avg_rest": "0.0"
        }
    )


def format_date(date):
    """Format date as '1st of March', '2nd of March', etc."""
    day = date.day
    suffix = 'th'
    if day == 1 or day == 21 or day == 31:
        suffix = 'st'
    elif day == 2 or day == 22:
        suffix = 'nd'
    elif day == 3 or day == 23:
        suffix = 'rd'

    month = date.strftime('%B')  # Full month name
    return f"{day}{suffix} of {month}"
