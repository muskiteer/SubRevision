# 🚀 Groq API Setup (FREE & FAST!)

## Why Groq?
- ✅ **Completely FREE** with generous limits
- ✅ **Extremely FAST** (faster than Gemini)
- ✅ **No quota issues**
- ✅ Uses Llama 3.3 70B model (very powerful)

## Get Your Free Groq API Key

### Step 1: Sign up
Visit: https://console.groq.com/

### Step 2: Create API Key
1. Click on "API Keys" in the left menu
2. Click "Create API Key"
3. Give it a name (e.g., "StudyHub")
4. Copy the API key

### Step 3: Add to .env
```bash
cd ~/Desktop/studyhub/backend
echo "GROQ_API_KEY=your_actual_api_key_here" > .env
```

Replace `your_actual_api_key_here` with your actual key!

## Restart the Server
```bash
cd ~/Desktop/studyhub
source backend/.venv/bin/activate
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

## Test It!
```bash
# Upload PDF
curl -X POST http://localhost:8000/pdf/upload \
  -F "file=@/home/muskiteer/Downloads/lefl101.pdf"

# Generate quiz (should work now!)
curl -X POST http://localhost:8000/generate/quiz \
  -H "Content-Type: application/json" \
  -d '{"num_questions": 3, "difficulty": "medium"}'
```

## Models Used
- **llama-3.3-70b-versatile**: For all endpoints
- Super fast inference (< 1 second)
- Free tier: 30 requests/minute

## Free Tier Limits
- ✅ 30 requests per minute
- ✅ 14,400 requests per day
- ✅ No credit card required
- ✅ No expiration

## Alternative: Use Ollama (Completely Local)

If you want 100% free with no API at all:

1. Install Ollama: https://ollama.com/
2. Run: `ollama pull llama3.2`
3. The app would need different code (let me know if you want this!)

---

**Current Status:** ✅ Code updated to use Groq!
**Next Step:** Get your Groq API key and add it to `.env`
