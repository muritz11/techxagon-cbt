import React, { useEffect, useState } from "react";
import { Clock, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import Questions from "../assets/data/questions.json";
import StudentClasses from "../assets/data/classes.json";
import { useNavigate } from "react-router-dom";

interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface SummaryInterface {
  student: {
    name: string;
    class: string;
  };
  date: string;
  score: string;
  selectedQuestions: Question[];
  selectedAnswers: {
    [key: number]: string;
  };
}

const QUESTION_LENGTH = 10;
// quiz duration in seconds
const QUIZ_DURATION = 300;

const Quiz = () => {
  const navigate = useNavigate();
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_DURATION);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const student = JSON.parse(localStorage.getItem("student") || "null");

  useEffect(() => {
    if (!student) {
      navigate("/login");
    }
  }, [student]);

  useEffect(() => {
    // let interval: NodeJS.Timeout;
    let interval: any;
    if (isQuizStarted && !isQuizComplete && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsQuizComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQuizStarted, isQuizComplete, timeRemaining]);

  const startQuiz = () => {
    const shuffled = [...Questions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, QUESTION_LENGTH);
    setSelectedQuestions(selected);
    setIsQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeRemaining(QUIZ_DURATION);
    setIsQuizComplete(false);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const submitQuiz = () => {
    setIsQuizComplete(true);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setIsQuizStarted(false);
    setIsQuizComplete(false);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setTimeRemaining(QUIZ_DURATION);
    localStorage.removeItem("student");
    navigate("/");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isQuizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Start?
          </h1>
          <p className="text-gray-600 mb-6">
            You'll have 5 minutes to answer {QUESTION_LENGTH} questions
          </p>
          <button
            onClick={startQuiz}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (isQuizComplete) {
    const score = calculateScore();
    const percentage = (score / selectedQuestions.length) * 100;
    const summaries: SummaryInterface[] =
      JSON.parse(localStorage.getItem("results") || "null") || [];
    // const summary: SummaryInterface =
    summaries.push({
      student: student,
      date: new Date()?.toString(),
      score: `${score}/${selectedQuestions.length}`,
      selectedQuestions,
      selectedAnswers,
    });
    localStorage.setItem("results", JSON.stringify(summaries));

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-3xl mx-auto py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Quiz Results
            </h1>

            {/* Student Info */}
            <div className="text-center mb-6">
              <p className="text-xl font-semibold text-gray-800 capitalize">
                {student?.name || "Unknown Student"}
              </p>
              <p className="text-gray-500 text-lg">
                Class:{" "}
                {StudentClasses?.find((val) => val.value === student?.class)
                  ?.label || "N/A"}
              </p>
            </div>

            {/* Score */}
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-indigo-600 mb-2">
                {score}/{selectedQuestions.length}
              </div>
              <div className="text-2xl text-gray-600">
                {percentage.toFixed(0)}%
              </div>
            </div>

            {/* Button */}
            <button
              onClick={resetQuiz}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Take Another Quiz
            </button>
          </div>

          <div className="space-y-4">
            {selectedQuestions.map((q, idx) => {
              const userAnswer = selectedAnswers[idx];
              const isCorrect = userAnswer === q.answer;

              return (
                <div key={idx} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    {isCorrect ? (
                      <CheckCircle
                        className="text-green-500 flex-shrink-0 mt-1"
                        size={24}
                      />
                    ) : (
                      <XCircle
                        className="text-red-500 flex-shrink-0 mt-1"
                        size={24}
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-3">
                        {idx + 1}. {q.question}
                      </h3>
                      <div className="space-y-2 mb-3">
                        {q.options.map((option, optIdx) => (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-lg border-2 ${
                              option === q.answer
                                ? "border-green-500 bg-green-50"
                                : option === userAnswer
                                ? "border-red-500 bg-red-50"
                                : "border-gray-200"
                            }`}
                          >
                            {option}
                            {option === q.answer && (
                              <span className="ml-2 text-green-600 font-semibold">
                                ✓ Correct
                              </span>
                            )}
                            {option === userAnswer && option !== q.answer && (
                              <span className="ml-2 text-red-600 font-semibold">
                                ✗ Your answer
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Explanation:</span>{" "}
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = selectedQuestions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / selectedQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm font-semibold text-gray-600">
              Question {currentQuestionIndex + 1} of {selectedQuestions.length}
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeRemaining < 60
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <Clock size={18} />
              <span className="font-mono font-semibold">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedAnswers[currentQuestionIndex] === option
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 rounded-lg border-2 border-gray-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            {currentQuestionIndex === selectedQuestions.length - 1 ? (
              <button
                onClick={submitQuiz}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={goToNextQuestion}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
