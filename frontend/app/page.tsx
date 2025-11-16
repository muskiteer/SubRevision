'use client';

import { useState } from 'react';

const API_BASE = 'http://localhost:8000';

export default function Home() {
  const [activeTab, setActiveTab] = useState('upload');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  
  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [numCards, setNumCards] = useState(10);
  const [studyDays, setStudyDays] = useState(7);

  // API functions
  const uploadPDF = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch(`${API_BASE}/pdf/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Upload failed');
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to upload PDF');
    } finally {
      setLoading(false);
    }
  };

  const askQuery = async () => {
    if (!query) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/query/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Query failed');
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to get answer');
    } finally {
      setLoading(false);
    }
  };

  const searchPDF = async () => {
    if (!searchQuery) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/query/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Search failed');
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to search');
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/generate/summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Summary generation failed');
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/generate/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ num_questions: numQuestions, difficulty }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Quiz generation failed');
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const generateFlashcards = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/generate/flashcards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ num_cards: numCards }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Flashcard generation failed');
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate flashcards');
    } finally {
      setLoading(false);
    }
  };

  const generateMindmap = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/generate/mindmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Mindmap generation failed');
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate mindmap');
    } finally {
      setLoading(false);
    }
  };

  const generateStudyPlan = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/generate/studyplan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration_days: studyDays }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Study plan generation failed');
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate study plan');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'upload', label: '📄 Upload PDF', icon: '📄' },
    { id: 'ask', label: '❓ Ask Query', icon: '❓' },
    { id: 'search', label: '🔍 Search', icon: '🔍' },
    { id: 'summary', label: '📝 Summary', icon: '📝' },
    { id: 'quiz', label: '🎯 Quiz', icon: '🎯' },
    { id: 'flashcards', label: '🃏 Flashcards', icon: '🃏' },
    { id: 'mindmap', label: '🧠 Mind Map', icon: '🧠' },
    { id: 'studyplan', label: '📅 Study Plan', icon: '📅' },
  ];

  return (
    <div className="min-h-screen bg-[#0f1419] p-4 flex flex-col">
      {/* Header */}
      <header className="pixel-container bg-[#1a1f2e] mb-4 p-4 flex-shrink-0">
        <h1 className="text-3xl font-bold text-[#00d9ff] pixel-text text-center">
          🎓 StudyHub AI Assistant
        </h1>
        <p className="text-center text-[#e2e8f0] mt-2 text-sm">
          Transform your PDFs into interactive study materials
        </p>
      </header>

      {/* Tab Navigation */}
      <nav className="pixel-container bg-[#1a1f2e] mb-4 p-2 flex-shrink-0">
        <div className="flex flex-wrap gap-2 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pixel-btn px-4 py-2 font-bold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-[#00d9ff] text-[#0f1419] scale-105'
                  : 'bg-[#242b3d] text-[#e2e8f0] hover:bg-[#2d3748]'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content Area */}
      <main className="pixel-container bg-[#1a1f2e] p-6 flex-grow overflow-auto">
        {/* Error Display */}
        {error && (
          <div className="pixel-box bg-red-900/20 border-4 border-red-500 p-4 mb-4">
            <p className="text-red-400">❌ Error: {error}</p>
          </div>
        )}

        {/* Loading Display */}
        {loading && (
          <div className="pixel-box bg-[#0f1419] p-6 text-center mb-4">
            <p className="text-[#00d9ff] text-xl">⏳ Loading...</p>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-[#00d9ff] pixel-text mb-3">
              📄 Upload PDF
            </h2>
            <div className="pixel-box bg-[#0f1419] p-6">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mb-4 text-[#e2e8f0]"
              />
              {file && <p className="text-[#00d9ff] mb-4">Selected: {file.name}</p>}
              <button 
                onClick={uploadPDF}
                disabled={loading || !file}
                className="pixel-btn bg-[#00d9ff] text-[#0f1419] px-6 py-3 font-bold hover:bg-[#00b8d4] disabled:opacity-50"
              >
                📤 Upload
              </button>
            </div>
            {result && (
              <div className="pixel-box bg-[#0f1419] p-4">
                <pre className="text-[#e2e8f0] text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ask' && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-[#00d9ff] pixel-text mb-3">
              ❓ Ask a Question
            </h2>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pixel-input w-full h-32 p-4 bg-[#0f1419] text-[#e2e8f0] border-4 border-[#2d3748]"
              placeholder="Type your question here..."
            />
            <button 
              onClick={askQuery}
              disabled={loading || !query}
              className="pixel-btn bg-[#00d9ff] text-[#0f1419] px-6 py-3 font-bold hover:bg-[#00b8d4] disabled:opacity-50"
            >
              🚀 Submit Question
            </button>
            {result && (
              <div className="pixel-box bg-[#0f1419] p-4">
                <h3 className="text-[#00d9ff] font-bold mb-2">Answer:</h3>
                <p className="text-[#e2e8f0] whitespace-pre-wrap">{result.answer}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-[#00d9ff] pixel-text mb-3">
              🔍 Search Your PDF
            </h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pixel-input w-full p-4 bg-[#0f1419] text-[#e2e8f0] border-4 border-[#2d3748]"
              placeholder="Search for keywords..."
            />
            <button 
              onClick={searchPDF}
              disabled={loading || !searchQuery}
              className="pixel-btn bg-[#00d9ff] text-[#0f1419] px-6 py-3 font-bold hover:bg-[#00b8d4] disabled:opacity-50"
            >
              🔎 Search
            </button>
            {result?.results && (
              <div className="space-y-2">
                {result.results.map((r: any, i: number) => (
                  <div key={i} className="pixel-box bg-[#0f1419] p-4">
                    <p className="text-[#e2e8f0]">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-[#00d9ff] pixel-text mb-3">
              📝 Generate Summary
            </h2>
            <div className="pixel-box bg-[#0f1419] p-4">
              <p className="text-[#e2e8f0] mb-4">
                Click the button below to generate a concise summary of your PDF
              </p>
              <button 
                onClick={generateSummary}
                disabled={loading}
                className="pixel-btn bg-[#00d9ff] text-[#0f1419] px-6 py-3 font-bold hover:bg-[#00b8d4] disabled:opacity-50"
              >
                ✨ Generate Summary
              </button>
            </div>
            {result?.summary && (
              <div className="pixel-box bg-[#0f1419] p-4">
                <pre className="text-[#e2e8f0] whitespace-pre-wrap">{result.summary}</pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-[#00d9ff] pixel-text mb-3">
              🎯 Generate Quiz
            </h2>
            <div className="pixel-box bg-[#0f1419] p-4 space-y-3">
              <div>
                <label className="text-[#e2e8f0] block mb-2">Number of Questions:</label>
                <input
                  type="number"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  className="pixel-input w-32 p-2 bg-[#1a1f2e] text-[#e2e8f0] border-4 border-[#2d3748]"
                  min={1}
                  max={20}
                />
              </div>
              <div>
                <label className="text-[#e2e8f0] block mb-2">Difficulty:</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="pixel-input p-2 bg-[#1a1f2e] text-[#e2e8f0] border-4 border-[#2d3748]"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <button 
                onClick={generateQuiz}
                disabled={loading}
                className="pixel-btn bg-[#00d9ff] text-[#0f1419] px-6 py-3 font-bold hover:bg-[#00b8d4] disabled:opacity-50"
              >
                🎲 Generate Quiz
              </button>
            </div>
            {result?.quiz && (
              <div className="pixel-box bg-[#0f1419] p-4">
                <pre className="text-[#e2e8f0] text-sm whitespace-pre-wrap overflow-auto">{result.quiz}</pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'flashcards' && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-[#00d9ff] pixel-text mb-3">
              🃏 Generate Flashcards
            </h2>
            <div className="pixel-box bg-[#0f1419] p-4 space-y-3">
              <div>
                <label className="text-[#e2e8f0] block mb-2">Number of Cards:</label>
                <input
                  type="number"
                  value={numCards}
                  onChange={(e) => setNumCards(parseInt(e.target.value))}
                  className="pixel-input w-32 p-2 bg-[#1a1f2e] text-[#e2e8f0] border-4 border-[#2d3748]"
                  min={1}
                  max={50}
                />
              </div>
              <button 
                onClick={generateFlashcards}
                disabled={loading}
                className="pixel-btn bg-[#00d9ff] text-[#0f1419] px-6 py-3 font-bold hover:bg-[#00b8d4] disabled:opacity-50"
              >
                🎴 Generate Flashcards
              </button>
            </div>
            {result?.flashcards && (
              <div className="pixel-box bg-[#0f1419] p-4">
                <pre className="text-[#e2e8f0] text-sm whitespace-pre-wrap overflow-auto">{result.flashcards}</pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'mindmap' && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-[#00d9ff] pixel-text mb-3">
              🧠 Generate Mind Map
            </h2>
            <div className="pixel-box bg-[#0f1419] p-4">
              <p className="text-[#e2e8f0] mb-4">
                Visualize key concepts and their relationships
              </p>
              <button 
                onClick={generateMindmap}
                disabled={loading}
                className="pixel-btn bg-[#00d9ff] text-[#0f1419] px-6 py-3 font-bold hover:bg-[#00b8d4] disabled:opacity-50"
              >
                🗺️ Generate Mind Map
              </button>
            </div>
            {result?.mindmap && (
              <div className="pixel-box bg-[#0f1419] p-4">
                <pre className="text-[#e2e8f0] text-sm whitespace-pre-wrap overflow-auto">{result.mindmap}</pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'studyplan' && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-[#00d9ff] pixel-text mb-3">
              📅 Generate Study Plan
            </h2>
            <div className="pixel-box bg-[#0f1419] p-4 space-y-3">
              <div>
                <label className="text-[#e2e8f0] block mb-2">Study Duration (days):</label>
                <input
                  type="number"
                  value={studyDays}
                  onChange={(e) => setStudyDays(parseInt(e.target.value))}
                  className="pixel-input w-32 p-2 bg-[#1a1f2e] text-[#e2e8f0] border-4 border-[#2d3748]"
                  min={1}
                  max={30}
                />
              </div>
              <button 
                onClick={generateStudyPlan}
                disabled={loading}
                className="pixel-btn bg-[#00d9ff] text-[#0f1419] px-6 py-3 font-bold hover:bg-[#00b8d4] disabled:opacity-50"
              >
                📆 Generate Plan
              </button>
            </div>
            {result?.study_plan && (
              <div className="pixel-box bg-[#0f1419] p-4">
                <pre className="text-[#e2e8f0] text-sm whitespace-pre-wrap overflow-auto">{result.study_plan}</pre>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="pixel-container bg-[#1a1f2e] mt-4 p-4 text-center flex-shrink-0">
        <p className="text-[#94a3b8] text-sm">
          🤖 Powered by AI • Made with 💜 for Students
        </p>
      </footer>
    </div>
  );
}
