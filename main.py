from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlmodel import SQLModel

from routers import api, frontend
from database import engine


@asynccontextmanager
async def lifespan(_app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(api.router)
app.mount("/", frontend.front_app)
