import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, ArrowRight, Loader2, BookOpen } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function HistoryList({ onSelectQuiz }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/quizzes`);
      setQuizzes(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizClick = async (id) => {
    try {
      console.log(`Fetching quiz ${id}...`);
      const res = await axios.get(`${API_URL}/quizzes/${id}`);
      
      const dbData = res.data;
      console.log("RAW DB DATA:", dbData);

      const normalizedQuestions = dbData.questions.map((q, index) => {
        
        const optA = q.choice_a || q.choiceA || q.option_a || q.options?.[0];
        const optB = q.choice_b || q.choiceB || q.option_b || q.options?.[1];
        const optC = q.choice_c || q.choiceC || q.option_c || q.options?.[2];
        const optD = q.choice_d || q.choiceD || q.option_d || q.options?.[3];

        const finalOptions = [optA, optB, optC, optD].filter(Boolean);

        if (finalOptions.length === 0) {
          console.warn(`Question ${index} has no options!`, q);
          finalOptions.push("Option A missing", "Option B missing", "Option C missing", "Option D missing");
        }

        return {
          question: q.question_text || q.question || "Question text missing",
          options: finalOptions,
          correct_answer: q.correct_answer || optA, 
          explanation: q.explanation || "No explanation provided.",
          difficulty: "Review"
        };
      });

      onSelectQuiz({
        title: dbData.topic_summary,
        questions: normalizedQuestions
      });

    } catch (err) {
      console.error("Error loading quiz details:", err);
      alert("Error loading quiz. Open console (F12) for details.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-600" />
        <p>Loading your library...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="w-8 h-8 text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-800">Your Quiz Library</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <button
            key={quiz.id}
            onClick={() => handleQuizClick(quiz.id)}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-300 transition-all text-left group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <span className="text-xl">📝</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
            
            <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
              {quiz.topic_summary || "Untitled Quiz"}
            </h3>
            
            <div className="flex items-center text-sm text-gray-500 gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(quiz.created_at).toLocaleDateString()}
            </div>
          </button>
        ))}
      </div>
      
      {quizzes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No quizzes found.
        </div>
      )}
    </div>
  );
}