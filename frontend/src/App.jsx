import { useState } from 'react';
import axios from 'axios';
import { LayoutGrid, PlusCircle } from 'lucide-react';
import UrlForm from './components/UrlForm';
import QuizGame from './components/QuizGame';
import HistoryList from './components/HistoryList';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [view, setView] = useState('create'); // 'create', 'history', 'game'
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateQuiz = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/generate-quiz`, { url, num_questions: 5 });
      setQuizData(res.data);
      setView('game'); // Switch directly to game view
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to generate quiz.");
    } finally {
      setLoading(false);
    }
  };

  const startHistoryQuiz = (data) => {
    setQuizData(data);
    setView('game');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* --- NAVBAR --- */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
              <span>WikiQuiz AI</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setView('create')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'create' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                New Quiz
              </button>
              <button
                onClick={() => setView('history')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'history' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                History
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* VIEW: CREATE */}
        {view === 'create' && (
          <div className="flex flex-col items-center justify-center py-12">
            <UrlForm onSubmit={generateQuiz} isLoading={loading} />
            {error && (
              <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
                {error}
              </div>
            )}
          </div>
        )}

        {/* VIEW: HISTORY */}
        {view === 'history' && (
          <HistoryList onSelectQuiz={startHistoryQuiz} />
        )}

        {/* VIEW: GAME */}
        {view === 'game' && quizData && (
          <div className="w-full">
            <button 
              onClick={() => setView('create')}
              className="mb-6 text-gray-500 hover:text-blue-600 flex items-center gap-2"
            >
              ← Back to Home
            </button>
            <QuizGame 
              title={quizData.title || quizData.topic_summary || "Quiz"} 
              questions={quizData.questions} 
              onReset={() => setView('create')}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;