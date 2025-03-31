from fastapi import Request, FastAPI
from fastapi.templating import Jinja2Templates
from starlette.staticfiles import StaticFiles

front_app = FastAPI()
templates = Jinja2Templates(directory="frontend/pages")
front_app.mount("/static", StaticFiles(directory="frontend/static"))


@front_app.get("/")
def index_page(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")
