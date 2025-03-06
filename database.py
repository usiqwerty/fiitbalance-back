from typing import Annotated

from fastapi import Depends
from sqlalchemy import create_engine
from sqlmodel import Session

engine = create_engine("sqlite:///database.db", connect_args={"check_same_thread": False})


def get_db_session():
    with Session(engine) as session:
        yield session


DBSession = Annotated[Session, Depends(get_db_session)]
