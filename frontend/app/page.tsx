'use client';

import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('upload');

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
    <div className="min-h-screen bg-[#2a2a4a] p-4">
      {/* Header */}
      <header className="pixel-container bg-[#1a1a3a] mb-4 p-4">
        <h1 className="text-3xl font-bold text-[#ffd700] pixel-text text-center">
          🎓 StudyHub AI Assistant
        </h1>
        <p className="text-center text-[#c0c0ff] mt-2 text-sm">
          Transform your PDFs into interactive study materials
        </p>
      </header>

      {/* Tab Navigation */}
      <nav className="pixel-container bg-[#1a1a3a] mb-4 p-2">
        <div className="flex flex-wrap gap-2 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pixel-btn px-4 py-2 font-bold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-[#ffd700] text-[#1a1a3a] scale-105'
                  : 'bg-[#3a3a6a] text-[#c0c0ff] hover:bg-[#4a4a7a]'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content Area */}
      <main className="pixel-container bg-[#1a1a3a] p-6 min-h-[500px]">
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#ffd700] pixel-text mb-4">
              📄 Upload PDF
            </h2>
            <div className="pixel-box bg-[#2a2a4a] p-8 text-center border-4 border-dashed border-[#4a4a7a]">
              <p className="text-[#c0c0ff] mb-4">📤 Drop your PDF here or click to browse</p>
              <button className="pixel-btn bg-[#ffd700] text-[#1a1a3a] px-6 py-3 font-bold hover:bg-[#ffed4e]">
                Choose File
              </button>
            </div>
            <p className="text-[#8080b0] text-sm">
              💡 Supported: PDF files up to 50MB
            </p>
          </div>
        )}

        {activeTab === 'ask' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#ffd700] pixel-text mb-4">
              ❓ Ask a Question
            </h2>
            <textarea
              className="pixel-input w-full h-32 p-4 bg-[#2a2a4a] text-[#c0c0ff] border-4 border-[#4a4a7a]"
              placeholder="Type your question here..."
            />
            <button className="pixel-btn bg-[#ffd700] text-[#1a1a3a] px-6 py-3 font-bold hover:bg-[#ffed4e]">
              🚀 Submit Question
            </button>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#ffd700] pixel-text mb-4">
              🔍 Search Your PDF
            </h2>
            <input
              type="text"
              className="pixel-input w-full p-4 bg-[#2a2a4a] text-[#c0c0ff] border-4 border-[#4a4a7a]"
              placeholder="Search for keywords..."
            />
            <button className="pixel-btn bg-[#ffd700] text-[#1a1a3a] px-6 py-3 font-bold hover:bg-[#ffed4e]">
              🔎 Search
            </button>
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#ffd700] pixel-text mb-4">
              📝 Generate Summary
            </h2>
            <div className="pixel-box bg-[#2a2a4a] p-6">
              <p className="text-[#c0c0ff] mb-4">
                Click the button below to generate a concise summary of your PDF
              </p>
              <button className="pixel-btn bg-[#ffd700] text-[#1a1a3a] px-6 py-3 font-bold hover:bg-[#ffed4e]">
                ✨ Generate Summary
              </button>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#ffd700] pixel-text mb-4">
              🎯 Generate Quiz
            </h2>
            <div className="pixel-box bg-[#2a2a4a] p-6 space-y-4">
              <div>
                <label className="text-[#c0c0ff] block mb-2">Number of Questions:</label>
                <input
                  type="number"
                  className="pixel-input w-32 p-2 bg-[#1a1a3a] text-[#c0c0ff] border-4 border-[#4a4a7a]"
                  defaultValue={5}
                  min={1}
                  max={20}
                />
              </div>
              <button className="pixel-btn bg-[#ffd700] text-[#1a1a3a] px-6 py-3 font-bold hover:bg-[#ffed4e]">
                🎲 Generate Quiz
              </button>
            </div>
          </div>
        )}

        {activeTab === 'flashcards' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#ffd700] pixel-text mb-4">
              🃏 Generate Flashcards
            </h2>
            <div className="pixel-box bg-[#2a2a4a] p-6">
              <p className="text-[#c0c0ff] mb-4">
                Create study flashcards from your PDF content
              </p>
              <button className="pixel-btn bg-[#ffd700] text-[#1a1a3a] px-6 py-3 font-bold hover:bg-[#ffed4e]">
                🎴 Generate Flashcards
              </button>
            </div>
          </div>
        )}

        {activeTab === 'mindmap' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#ffd700] pixel-text mb-4">
              🧠 Generate Mind Map
            </h2>
            <div className="pixel-box bg-[#2a2a4a] p-6">
              <p className="text-[#c0c0ff] mb-4">
                Visualize key concepts and their relationships
              </p>
              <button className="pixel-btn bg-[#ffd700] text-[#1a1a3a] px-6 py-3 font-bold hover:bg-[#ffed4e]">
                🗺️ Generate Mind Map
              </button>
            </div>
          </div>
        )}

        {activeTab === 'studyplan' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#ffd700] pixel-text mb-4">
              📅 Generate Study Plan
            </h2>
            <div className="pixel-box bg-[#2a2a4a] p-6 space-y-4">
              <div>
                <label className="text-[#c0c0ff] block mb-2">Study Duration (days):</label>
                <input
                  type="number"
                  className="pixel-input w-32 p-2 bg-[#1a1a3a] text-[#c0c0ff] border-4 border-[#4a4a7a]"
                  defaultValue={7}
                  min={1}
                  max={30}
                />
              </div>
              <button className="pixel-btn bg-[#ffd700] text-[#1a1a3a] px-6 py-3 font-bold hover:bg-[#ffed4e]">
                📆 Generate Plan
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="pixel-container bg-[#1a1a3a] mt-4 p-4 text-center">
        <p className="text-[#8080b0] text-sm">
          🤖 Powered by AI • Made with 💜 for Students
        </p>
      </footer>
    </div>
  );
}
