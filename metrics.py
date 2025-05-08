from collections import defaultdict
from datetime import datetime, timedelta
from typing import Sequence, Callable

from sqlmodel import Session, select

from database import engine
from models.analytics import StatViews
from models.task import Task


def average(a: list[float]):
    return sum(a) / len(a)


def _average_per_week_per_user(tasks: Sequence[Task],
                               select_for_week: Callable[[Sequence[Sequence[Task]]], float]):
    user_week_day = defaultdict(lambda: defaultdict(list))
    for task in tasks:
        user_week_day[task.user_id][task.start].append(task)

    user_weeks = defaultdict(list)

    for user, week in user_week_day.items():
        week_tasks = [day_tasks for day, day_tasks in week.items()]
        user_weeks[user] = week_tasks

    metric_for_each_user = []
    for userid, week_tasks in user_weeks.items():
        metric_for_each_user.append(select_for_week(week_tasks))
    return average(metric_for_each_user)


def _get_balance_for_day(tasks_for_day: Sequence[Task]):
    return 1 / 20 * min(max(10 - sum(task.difficulty for task in tasks_for_day), 0), 20)


def _count_balanced_days_fraction(week: Sequence[Sequence[Task]]):
    # left, right = 0.4, 0.6
    left, right = 0.35, 0.75
    days_in_week = len(week)
    balanced_days = len(list(filter(lambda day: left <= _get_balance_for_day(day) <= right, week)))
    return balanced_days / days_in_week


def _count_tasks_on_week(week: Sequence[Sequence[Task]]):
    return sum(len(day) for day in week)


def balanced_days_per_week_per_user(db: Session) -> float:
    week_ago = datetime.today() - timedelta(days=7)
    tasks = db.exec(select(Task).where(Task.start>=week_ago)).all()
    return _average_per_week_per_user(tasks, _count_balanced_days_fraction)


def added_tasks_per_week_per_user(db: Session) -> float:
    week_ago = datetime.today() - timedelta(days=7)
    tasks = db.exec(select(Task).where(Task.start>=week_ago)).all()
    return _average_per_week_per_user(tasks, _count_tasks_on_week)


def complete_tasks_per_week_per_user(db: Session) -> float:
    week_ago = datetime.today() - timedelta(days=7)
    tasks = db.exec(select(Task).where(Task.completed, Task.start>=week_ago)).all()
    return _average_per_week_per_user(tasks, _count_tasks_on_week)


def weekstat_views_per_week_per_user(db: Session) -> float:
    week_ago = datetime.today() - timedelta(days=7)
    views = db.exec(select(StatViews).where(StatViews.date_viewed>=week_ago)).all()
    for_user = defaultdict(lambda: defaultdict(list))
    for view in views:
        key = (view.date_viewed.year, view.date_viewed.isocalendar().week)
        for_user[view.user_id][key].append(view.id)

    user_averages = []
    for userid, user_weeks in for_user.items():
        user_avg = average([len(tasks) for week, tasks in user_weeks.items()])
        user_averages.append(user_avg)
    return average(user_averages)


if __name__ == "__main__":
    with Session(engine) as session:
        metrics = {
            "Сбалансированная доля недели на пользователя (основная)": f"{100*balanced_days_per_week_per_user(session):.4f}%",
            "Добавленные задачи за неделю на пользователя": added_tasks_per_week_per_user(session),
            "Завершённые задачи за неделю на пользователя": complete_tasks_per_week_per_user(session),
            "Просмотры недельной статистики за неделю на пользователя": weekstat_views_per_week_per_user(session),
        }
        for k, v in metrics.items():
            print(f"{k}: {v}")
