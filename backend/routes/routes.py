from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from typing import Optional
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

# Request models
class QueryRequest(BaseModel):
    query: str

class QuizRequest(BaseModel):
    num_questions: Optional[int] = 5
    difficulty: Optional[str] = "medium"

class FlashcardRequest(BaseModel):
    num_cards: Optional[int] = 10

class StudyPlanRequest(BaseModel):
    duration_days: Optional[int] = 7

# Routes
@router.post("/pdf/upload")
async def upload_pdf(file: UploadFile = File(...)):
    return await uploading_pdf(file)

@router.post("/query/ask")
async def ask_query(request: QueryRequest):
    return await asking_query(request.query)

@router.post("/query/search")
async def search_query(request: QueryRequest):
    return await searching_query(request.query)

@router.post("/generate/summary")
async def generate_summary():
    return await generating_summary()

@router.post("/generate/quiz")
async def generate_quiz(request: QuizRequest):
    return await generating_quiz(request.num_questions, request.difficulty)

@router.post("/generate/flashcards")
async def generate_flashcards(request: FlashcardRequest):
    return await generating_flashcards(request.num_cards)

@router.post("/generate/mindmap")
async def generate_mindmap():
    return await generating_mindmap()

@router.post("/generate/studyplan")
async def generate_studyplan(request: StudyPlanRequest):
    return await generating_studyplan(request.duration_days)

