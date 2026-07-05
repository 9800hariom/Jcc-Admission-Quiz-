import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Timer, ArrowRight, CheckCircle2, Award, Sparkles, Brain } from "lucide-react";
import { Student, Question } from "../types";

interface QuizEngineProps {
  student: Student;
  onQuizComplete: (quizResults: any) => void;
}

export default function QuizEngine({ student, onQuizComplete }: QuizEngineProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fallback seed questions if API fails or server restarting
  const fallbackQuestions: Question[] = [
    {
      id: 1,
      text: "Which is the highest peak in the world, located in Nepal?",
      options: ["K2", "Mount Everest", "Kangchenjunga", "Lhotse"],
      answer: "Mount Everest",
      category: "GENERAL_KNOWLEDGE"
    },
    {
      id: 2,
      text: "What does CPU stand for in computer systems?",
      options: ["Central Processing Unit", "Computer Personal Unit", "Central Processor Utility", "Control Power Unit"],
      answer: "Central Processing Unit",
      category: "COMPUTER_SCIENCE"
    },
    {
      id: 3,
      text: "What is the chemical formula for pure water?",
      options: ["CO2", "H2O", "NaCl", "O2"],
      answer: "H2O",
      category: "SCIENCE_MATH"
    }
  ];

  // Fetch quiz questions
  useEffect(() => {
    async function loadQuestions() {
      try {
        const response = await fetch("/api/questions");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setQuestions(data);
          } else {
            setQuestions(fallbackQuestions);
          }
        } else {
          setQuestions(fallbackQuestions);
        }
      } catch (e) {
        setQuestions(fallbackQuestions);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, []);

  // Timer countdown hook
  useEffect(() => {
    if (loading || questions.length === 0 || timeLeft <= 0) {
      if (timeLeft === 0) {
        handleAutoSubmit();
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, timeLeft, questions]);

  const handleSelectAnswer = (option: string) => {
    if (questions.length === 0) return;
    const currentQ = questions[currentIdx];
    setAnswers({
      ...answers,
      [currentQ.id]: option
    });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleAutoSubmit = () => {
    handleSubmitQuiz(true);
  };

  const handleSubmitQuiz = async (isAuto = false) => {
    if (submitting) return;
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpent = 300 - timeLeft;

    try {
      const response = await fetch("/api/submit-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.id,
          answers,
          timeTaken: timeSpent
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit quiz results");
      }

      onQuizComplete(data);
    } catch (err: any) {
      setError(err.message || "Failed to record answers. Please try again.");
      setSubmitting(false);
    }
  };

  // Convert seconds to MM:SS format
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm font-medium">Assembling gamified questions pool...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white max-w-2xl mx-auto p-8 rounded-2xl border border-slate-200 shadow text-center space-y-4">
        <p className="text-rose-600 font-bold">Error loading assessment pool.</p>
        <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium">
          Reload Portal
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const progressPercent = ((currentIdx + 1) / questions.length) * 100;
  const isTimeUrgent = timeLeft < 60;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
      {/* Top Gaming Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 text-white p-4 rounded-2xl shadow border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/40 shrink-0">
            <Brain className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-tight">{student.fullName}</h4>
            <p className="text-[11px] text-slate-400 font-mono">Stream Goal: {(student.interestFields || []).join(", ")}</p>
          </div>
        </div>

        {/* Live Timer */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/80">
            <Timer className={`w-4 h-4 ${isTimeUrgent ? "text-rose-400 animate-pulse" : "text-amber-400"}`} />
            <span className={`font-mono text-sm font-bold tracking-wider ${isTimeUrgent ? "text-rose-400 animate-pulse" : "text-amber-400"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="text-xs bg-indigo-950 text-indigo-300 px-3 py-2 rounded-xl font-semibold border border-indigo-800/40">
            {Object.keys(answers).length} / {questions.length} Answered
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-semibold text-slate-500">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span>{Math.round(progressPercent)}% Complete</span>
        </div>
        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-700 text-sm px-4 py-3 rounded-xl border border-rose-200 flex items-center space-x-2">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md space-y-6"
        >
          {/* Category Chip */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
              {currentQuestion.category.replace("_", " ")}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">10 points potential</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-snug">
            {currentQuestion.text}
          </h3>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentQuestion.id] === option;
              const charOption = ["A", "B", "C", "D"][idx];
              return (
                <button
                  key={option}
                  onClick={() => handleSelectAnswer(option)}
                  className={`flex items-center space-x-3 text-left px-5 py-4 rounded-xl border text-sm transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 border-indigo-400 text-indigo-900 font-semibold shadow-sm"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${
                    isSelected ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    {charOption}
                  </span>
                  <span className="leading-tight">{option}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Control Buttons */}
      <div className="flex justify-between items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="px-6 py-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all cursor-pointer"
        >
          Previous
        </button>

        {currentIdx === questions.length - 1 ? (
          <button
            onClick={() => handleSubmitQuiz(false)}
            disabled={submitting}
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-emerald-200 hover:from-emerald-700 hover:to-emerald-800 transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50"
          >
            {submitting ? (
              <span>Evaluating results...</span>
            ) : (
              <>
                <span>Complete Assessment</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-indigo-200 transition-all cursor-pointer flex items-center space-x-2"
          >
            <span>Next Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="text-center">
        <p className="text-[11px] text-slate-400">
          ⚠️ Note: If the 5 minutes countdown expires, your quiz will auto-submit instantly.
        </p>
      </div>
    </div>
  );
}
