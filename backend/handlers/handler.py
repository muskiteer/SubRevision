import os
from fastapi import UploadFile, HTTPException
from groq import Groq
from backend.db.db import vector_db
from backend.utils.pdf_processor import PDFProcessor
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Groq API (free and fast!)
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def uploading_pdf(file: UploadFile):
    """
    Upload and process PDF file:
    1. Validate file type and size
    2. Extract text from PDF
    3. Check if PDF is empty
    4. Clear ChromaDB collection
    5. Chunk text and create embeddings
    6. Store in ChromaDB
    
    Args:
        file: Uploaded PDF file
        
    Returns:
        Dictionary with processing status and metadata
    """
    
    # Validate file type
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Read file content
    try:
        pdf_bytes = await file.read()
        file_size_mb = len(pdf_bytes) / (1024 * 1024)
        
        # Check file size (max 50MB)
        if file_size_mb > 50:
            raise HTTPException(status_code=400, detail="File size exceeds 50MB limit")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")
    
    # Initialize PDF processor
    pdf_processor = PDFProcessor()
    
    # Extract text from PDF
    try:
        extracted_text = pdf_processor.extract_text_from_pdf(pdf_bytes)
        
        # Check if PDF is empty
        if pdf_processor.is_pdf_empty(extracted_text):
            return {
                "status": "error",
                "message": "The PDF document is empty or contains no extractable text",
                "filename": file.filename
            }
        
        # Store full text for later use
        vector_db.full_text = extracted_text
        
        # Get PDF metadata
        metadata = pdf_processor.get_pdf_metadata(pdf_bytes)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")
    
    # Reset storage (clear previous data)
    try:
        vector_db.reset_collection()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error resetting storage: {str(e)}")
    
    # Chunk the text for better embeddings
    try:
        chunks = pdf_processor.chunk_text(extracted_text, chunk_size=500, overlap=50)
        
        # Prepare metadata for each chunk
        chunk_metadatas = [
            {
                "filename": file.filename,
                "chunk_id": i,
                "total_chunks": len(chunks),
                "num_pages": metadata.get("num_pages", 0)
            }
            for i in range(len(chunks))
        ]
        
        # Generate IDs for chunks
        chunk_ids = [f"chunk_{i}" for i in range(len(chunks))]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error chunking text: {str(e)}")
    
    # Store in vector database
    try:
        vector_db.add_documents(
            texts=chunks,
            metadatas=chunk_metadatas,
            ids=chunk_ids
        )
        
        doc_count = vector_db.get_collection_count()
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error storing documents: {str(e)}")
    
    # Return success response
    return {
        "status": "success",
        "message": "PDF processed and stored successfully",
        "filename": file.filename,
        "file_size_mb": round(file_size_mb, 2),
        "num_pages": metadata.get("num_pages", 0),
        "text_length": len(extracted_text),
        "num_chunks": len(chunks),
        "embeddings_stored": doc_count
    }

async def asking_query(query: str):
    """
    Ask a question about the uploaded PDF using Gemini
    
    Args:
        query: User's question
        
    Returns:
        Dictionary with answer and relevant context
    """
    if not vector_db.full_text:
        raise HTTPException(status_code=400, detail="No PDF uploaded yet. Please upload a PDF first.")
    
    try:
        # Get relevant chunks from vector DB
        results = vector_db.query_documents(query, n_results=3)
        context_chunks = results.get("documents", [[]])[0]
        context = "\n\n".join(context_chunks) if context_chunks else vector_db.full_text[:3000]
        
        # Generate answer using Groq
        prompt = f"""Based on the following context from a PDF document, answer the question.

Context:
{context}

Question: {query}

Please provide a clear and concise answer based only on the information in the context."""
        
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1024
        )
        
        return {
            "status": "success",
            "query": query,
            "answer": response.choices[0].message.content,
            "context_used": len(context_chunks)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

async def searching_query(query: str):
    """
    Search for relevant sections in the PDF
    
    Args:
        query: Search query
        
    Returns:
        Dictionary with matching text chunks
    """
    if not vector_db.full_text:
        raise HTTPException(status_code=400, detail="No PDF uploaded yet. Please upload a PDF first.")
    
    try:
        # Search in stored documents
        results = vector_db.query_documents(query, n_results=5)
        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        
        search_results = []
        for i, doc in enumerate(documents):
            search_results.append({
                "chunk_id": metadatas[i].get("chunk_id", i) if metadatas else i,
                "text": doc,
                "relevance": "high" if i < 2 else "medium"
            })
        
        return {
            "status": "success",
            "query": query,
            "results_count": len(search_results),
            "results": search_results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching: {str(e)}")

async def generating_summary():
    """
    Generate a comprehensive summary of the uploaded PDF
    
    Returns:
        Dictionary with summary and key points
    """
    if not vector_db.full_text:
        raise HTTPException(status_code=400, detail="No PDF uploaded yet. Please upload a PDF first.")
    
    try:
        # Use first 4000 chars to stay within limits
        text_to_summarize = vector_db.full_text[:4000]
        
        prompt = f"""Please provide a comprehensive summary of the following document. Include:
1. Main topic/theme
2. Key points (3-5 bullet points)
3. Brief overview (2-3 sentences)

Document:
{text_to_summarize}

Format your response as:
**Main Topic:** [topic]

**Key Points:**
- [point 1]
- [point 2]
- [point 3]

**Overview:**
[overview text]"""
        
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1024
        )
        
        return {
            "status": "success",
            "summary": response.choices[0].message.content,
            "text_length_analyzed": len(text_to_summarize)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")

async def generating_quiz(num_questions: int = 5, difficulty: str = "medium"):
    """
    Generate a quiz from the uploaded PDF
    
    Args:
        num_questions: Number of questions to generate
        difficulty: Difficulty level (easy, medium, hard)
        
    Returns:
        Dictionary with quiz questions
    """
    if not vector_db.full_text:
        raise HTTPException(status_code=400, detail="No PDF uploaded yet. Please upload a PDF first.")
    
    try:
        # Use a good portion of the text
        text_for_quiz = vector_db.full_text[:3500]
        
        prompt = f"""Generate {num_questions} {difficulty} multiple-choice quiz questions based on this document.

Document:
{text_for_quiz}

For each question, provide:
1. Question text
2. Four options (A, B, C, D)
3. Correct answer (letter)
4. Brief explanation

Format as JSON array:
[
  {{
    "question": "Question text?",
    "options": {{"A": "option1", "B": "option2", "C": "option3", "D": "option4"}},
    "correct_answer": "A",
    "explanation": "Why this is correct"
  }}
]"""
        
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8,
            max_tokens=2048
        )
        
        return {
            "status": "success",
            "num_questions": num_questions,
            "difficulty": difficulty,
            "quiz": response.choices[0].message.content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating quiz: {str(e)}")

async def generating_flashcards(num_cards: int = 10):
    """
    Generate flashcards from the uploaded PDF
    
    Args:
        num_cards: Number of flashcards to generate
        
    Returns:
        Dictionary with flashcards
    """
    if not vector_db.full_text:
        raise HTTPException(status_code=400, detail="No PDF uploaded yet. Please upload a PDF first.")
    
    try:
        text_for_cards = vector_db.full_text[:3500]
        
        prompt = f"""Create {num_cards} flashcards from this document. Each flashcard should have a clear question/term on front and concise answer/definition on back.

Document:
{text_for_cards}

Format as JSON array:
[
  {{
    "front": "Question or term",
    "back": "Answer or definition",
    "category": "Topic category"
  }}
]"""
        
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=2048
        )
        
        return {
            "status": "success",
            "num_cards": num_cards,
            "flashcards": response.choices[0].message.content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating flashcards: {str(e)}")

async def generating_mindmap():
    """
    Generate a mind map structure from the uploaded PDF
    
    Returns:
        Dictionary with mind map structure
    """
    if not vector_db.full_text:
        raise HTTPException(status_code=400, detail="No PDF uploaded yet. Please upload a PDF first.")
    
    try:
        text_for_mindmap = vector_db.full_text[:3500]
        
        prompt = f"""Create a hierarchical mind map structure from this document.

Document:
{text_for_mindmap}

Format as JSON:
{{
  "central_topic": "Main topic",
  "branches": [
    {{
      "name": "Branch 1",
      "sub_branches": ["sub1", "sub2", "sub3"]
    }},
    {{
      "name": "Branch 2",
      "sub_branches": ["sub1", "sub2"]
    }}
  ]
}}"""
        
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1536
        )
        
        return {
            "status": "success",
            "mindmap": response.choices[0].message.content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating mindmap: {str(e)}")

async def generating_studyplan(duration_days: int = 7):
    """
    Generate a study plan from the uploaded PDF
    
    Args:
        duration_days: Number of days for the study plan
        
    Returns:
        Dictionary with study plan
    """
    if not vector_db.full_text:
        raise HTTPException(status_code=400, detail="No PDF uploaded yet. Please upload a PDF first.")
    
    try:
        text_for_plan = vector_db.full_text[:3500]
        
        prompt = f"""Create a {duration_days}-day study plan for this document. Break down the content into manageable daily tasks.

Document:
{text_for_plan}

Format as JSON:
{{
  "total_days": {duration_days},
  "daily_plan": [
    {{
      "day": 1,
      "topics": ["Topic 1", "Topic 2"],
      "tasks": ["Read section X", "Practice Y"],
      "estimated_time": "2 hours"
    }}
  ],
  "tips": ["Study tip 1", "Study tip 2"]
}}"""
        
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=2048
        )
        
        return {
            "status": "success",
            "duration_days": duration_days,
            "study_plan": response.choices[0].message.content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating study plan: {str(e)}")