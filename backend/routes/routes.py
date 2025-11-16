from fastapi import APIRouter
from backend.handlers.handler import (
    uploading_pdf,
    asking_query,
    searching_query,
    generating_summary,
    generating_quiz,
    generating_flashcards,
    generating_mindmap,
    generating_studyplan,
)

router = APIRouter()

@router.post("/pdf/upload")
async def upload_pdf():
    return await uploading_pdf()

@router.post("/query/ask")
async def ask_query():
    return await asking_query()

@router.post("/query/search")
async def search_query():
    return await searching_query()

@router.post("/generate/summary")
async def generate_summary():
    return await generating_summary()

@router.post("/generate/quiz")
async def generate_quiz():
    return await generating_quiz()

@router.post("/generate/flashcards")
async def generate_flashcards():
    return await generating_flashcards()

@router.post("/generate/mindmap")
async def generate_mindmap():
    return await generating_mindmap()

@router.post("/generate/studyplan")
async def generate_studyplan():
    return await generating_studyplan()

