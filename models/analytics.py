import datetime
from typing import Annotated

from sqlmodel import SQLModel, Field


class StatViews(SQLModel, table=True):
    id: Annotated[int, Field(primary_key=True)]
    date_viewed: datetime.date
    user_id: int
