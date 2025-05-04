from collections import defaultdict
from typing import Sequence, Callable

from sqlmodel import Session, select

from database import engine
from models.analytics import StatViews
from models.task import Task


def average(a: list[float]):
    return sum(a) / len(a)


def _average_per_week_per_user(tasks: Sequence[Task],
                               select_for_week: Callable[[Sequence[Sequence[Task]]], float]):
    user_week_day = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
    for task in tasks:
        key = (task.start.year, task.start.isocalendar().week)
        user_week_day[task.user_id][key][task.start].append(task)

    user_weeks = defaultdict(lambda: defaultdict(list))

    for user, weeks in user_week_day.items():
        for week_num, week_days in weeks.items():
            week_tasks = [day_tasks for day, day_tasks in week_days.items()]

            user_weeks[user][week_num] = week_tasks

    user_averages = []
    for userid, user_weeks in user_weeks.items():
        week_values = [select_for_week(week_tasks) for _, week_tasks in user_weeks.items()]
        user_averages.append(average(week_values))
    return average(user_averages)


def _get_balance_for_day(tasks_for_day: Sequence[Task]):
    return 1 / 20 * min(max(10 - sum(task.difficulty for task in tasks_for_day), 0), 20)


def _count_balanced_days(week: Sequence[Sequence[Task]]):
    left, right = 0.4, 0.6
    return len(list(filter(lambda day: left <= _get_balance_for_day(day) <= right, week)))


def _count_tasks_on_week(week: Sequence[Sequence[Task]]):
    return sum(len(day) for day in week)


def balanced_days_per_week_per_user(db: Session) -> float:
    tasks = db.exec(select(Task)).all()
    return _average_per_week_per_user(tasks, _count_balanced_days)


def added_tasks_per_week_per_user(db: Session) -> float:
    tasks = db.exec(select(Task)).all()
    return _average_per_week_per_user(tasks, _count_tasks_on_week)


def complete_tasks_per_week_per_user(db: Session) -> float:
    tasks = db.exec(select(Task).where(Task.completed)).all()
    return _average_per_week_per_user(tasks, _count_tasks_on_week)


def weekstat_views_per_week_per_user(db: Session) -> float:
    views = db.exec(select(StatViews)).all()
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
            "Сбалансированные дни в неделю за пользователя (основная)": balanced_days_per_week_per_user(session),
            "Добавленные задачи в неделю за пользователя": added_tasks_per_week_per_user(session),
            "Завершённые задачи в неделю за пользователя": complete_tasks_per_week_per_user(session),
            "Просмотры недельной статистики в неделю за пользователя": weekstat_views_per_week_per_user(session),
        }
        for k, v in metrics.items():
            print(f"{k}: {v}")
