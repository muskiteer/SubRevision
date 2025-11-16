# API Testing Guide

## Base URL
```
http://localhost:8000
```

## Endpoints

### 1. Upload PDF
```bash
curl -X POST "http://localhost:8000/pdf/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/file.pdf"
```

### 2. Ask Query
```bash
curl -X POST "http://localhost:8000/query/ask" \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the main topic of this document?"}'
```

### 3. Search Query
```bash
curl -X POST "http://localhost:8000/query/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "machine learning"}'
```

### 4. Generate Summary
```bash
curl -X POST "http://localhost:8000/generate/summary" \
  -H "Content-Type: application/json"
```

### 5. Generate Quiz
```bash
curl -X POST "http://localhost:8000/generate/quiz" \
  -H "Content-Type: application/json" \
  -d '{"num_questions": 5, "difficulty": "medium"}'
```

**Difficulty options:** easy, medium, hard

### 6. Generate Flashcards
```bash
curl -X POST "http://localhost:8000/generate/flashcards" \
  -H "Content-Type: application/json" \
  -d '{"num_cards": 10}'
```

### 7. Generate Mind Map
```bash
curl -X POST "http://localhost:8000/generate/mindmap" \
  -H "Content-Type: application/json"
```

### 8. Generate Study Plan
```bash
curl -X POST "http://localhost:8000/generate/studyplan" \
  -H "Content-Type: application/json" \
  -d '{"duration_days": 7}'
```

## Interactive API Documentation

Visit these URLs in your browser:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Setup Requirements

1. **Create `.env` file:**
```bash
cd ~/Desktop/studyhub/backend
cp .env.example .env
```

2. **Add your Gemini API key to `.env`:**
```env
GEMINI_API_KEY=your_actual_api_key_here
```

3. **Get free Gemini API key from:**
https://makersuite.google.com/app/apikey

## Response Examples

### Upload PDF Response
```json
{
  "status": "success",
  "message": "PDF processed and stored successfully",
  "filename": "document.pdf",
  "file_size_mb": 2.5,
  "num_pages": 45,
  "text_length": 12500,
  "num_chunks": 25,
  "embeddings_stored": 25
}
```

### Ask Query Response
```json
{
  "status": "success",
  "query": "What is machine learning?",
  "answer": "Machine learning is a subset of artificial intelligence...",
  "context_used": 3
}
```

### Quiz Response
```json
{
  "status": "success",
  "num_questions": 5,
  "difficulty": "medium",
  "quiz": "[{\"question\": \"...\", \"options\": {...}, \"correct_answer\": \"A\", \"explanation\": \"...\"}]"
}
```
