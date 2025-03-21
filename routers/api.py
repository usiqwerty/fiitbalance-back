from fastapi import APIRouter

from routers import auth, tasks

router = APIRouter(prefix="/api")

router.include_router(auth.router)
router.include_router(tasks.router)
