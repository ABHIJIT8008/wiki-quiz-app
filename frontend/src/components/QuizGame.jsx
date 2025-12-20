import { useState } from 'react';
import { CheckCircle, XCircle, Trophy, ArrowRight, RefreshCw } from 'lucide-react';

export default function QuizGame({ title, questions, onReset }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (option) => {
    if (selectedOption) return; // Prevent changing answer
    
    setSelectedOption(option);
    setShowExplanation(true);

    if (option === currentQuestion.correct_answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  // --- GAME OVER SCREEN ---
  if (isFinished) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center animate-in fade-in zoom-in duration-300">
        <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
        <p className="text-gray-500 mb-8">You finished the quiz on {title}</p>
        
        <div className="text-5xl font-extrabold text-blue-600 mb-8">
          {score} / {questions.length}
        </div>
        
        <button 
          onClick={onReset}
          className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-all"
        >
          <RefreshCw className="w-5 h-5" />
          Create New Quiz
        </button>
      </div>
    );
  }

  // --- QUESTION CARD ---
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6 flex justify-between items-center text-sm font-medium text-gray-500">
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span>Score: {score}</span>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Question Header */}
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-xl font-bold leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Options List */}
        <div className="p-6 space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === currentQuestion.correct_answer;
            const isWrong = isSelected && !isCorrect;
            
            // Dynamic styling logic
            let buttonStyle = "border-gray-200 hover:border-blue-500 hover:bg-blue-50";
            if (selectedOption) {
              if (isCorrect) buttonStyle = "border-green-500 bg-green-50 text-green-700";
              else if (isWrong) buttonStyle = "border-red-500 bg-red-50 text-red-700";
              else buttonStyle = "border-gray-200 opacity-50"; // Dim other options
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                disabled={!!selectedOption}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium flex justify-between items-center ${buttonStyle}`}
              >
                {option}
                {selectedOption && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                {selectedOption && isWrong && <XCircle className="w-5 h-5 text-red-600" />}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Button */}
        {showExplanation && (
          <div className="bg-gray-50 p-6 border-t border-gray-100 animate-in slide-in-from-bottom-2">
            <div className="mb-4">
              <span className="font-bold text-gray-900">Explanation:</span>
              <p className="text-gray-600 mt-1">{currentQuestion.explanation}</p>
            </div>
            
            <button
              onClick={handleNext}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {currentIndex === questions.length - 1 ? "See Results" : "Next Question"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}