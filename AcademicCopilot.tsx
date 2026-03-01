import React, { useState } from "react";
import {
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";
import { auraService } from "../services/auraService";
import Markdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { QuizQuestion, Flashcard } from "../types";

export const AcademicCopilot: React.FC = () => {
  const [topic, setTopic] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const [studyPlan, setStudyPlan] = useState("");
  const [planLoading, setPlanLoading] = useState(false);

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashLoading, setFlashLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  // ---------------- SAVE HISTORY ----------------
  const saveQuery = (topic: string) => {
    const previous = JSON.parse(localStorage.getItem("studyHistory") || "[]");
    const updated = [...previous, topic];
    localStorage.setItem("studyHistory", JSON.stringify(updated));
  };

  // ---------------- EXPLAIN ----------------
  const handleExplain = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setError("");

    try {
      const cached = localStorage.getItem(`explain_${topic}`);
      if (cached) {
        setExplanation(cached);
        setLoading(false);
        return;
      }

      const result = await auraService.explainTopic(topic);

      setExplanation(result);
      localStorage.setItem(`explain_${topic}`, result);
      saveQuery(topic);

      setQuiz([]);
      setStudyPlan("");
      setFlashcards([]);
      setShowResults(false);
      setSelectedAnswers({});
    } catch (err: any) {
      console.error(err);
      setError("⚠️ API limit reached. Please wait a minute and try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- QUIZ ----------------
  const handleGenerateQuiz = async () => {
    if (!topic.trim()) return;

    setQuizLoading(true);
    try {
      const result = await auraService.generateQuiz(topic);
      setQuiz(result);
      setShowResults(false);
      setSelectedAnswers({});
    } catch (error) {
      console.error(error);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let score = 0;
    quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  // ---------------- STUDY PLAN ----------------
  const handleGeneratePlan = async () => {
    if (!topic.trim()) return;

    setPlanLoading(true);
    try {
      const result = await auraService.generateStudyPlan(topic);
      setStudyPlan(result);
    } catch (error) {
      console.error(error);
    } finally {
      setPlanLoading(false);
    }
  };

  // ---------------- FLASHCARDS ----------------
  const handleGenerateFlashcards = async () => {
    if (!topic.trim()) return;

    setFlashLoading(true);
    try {
      const result = await auraService.generateFlashcards(topic);
      setFlashcards(result);
      setFlippedCards({});
    } catch (error) {
      console.error(error);
    } finally {
      setFlashLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <header className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
          <BookOpen size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">
            Academic Copilot
          </h2>
          <p className="text-zinc-500 text-sm">
            Your AI-powered study partner
          </p>
        </div>
      </header>

      {/* INPUT */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What topic are we studying today?"
            className="flex-1 px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleExplain()}
          />

          <button
            onClick={handleExplain}
            disabled={loading || !topic.trim()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Send size={20} />
            )}
            Explain
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-500">{error}</p>
        )}
      </div>

      <AnimatePresence mode="wait">
        {explanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* EXPLANATION */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
              <Markdown>{explanation}</Markdown>

              {/* ACTION BUTTONS */}
              <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-wrap gap-4">
                <button
                  onClick={handleGenerateQuiz}
                  className="px-5 py-2.5 bg-zinc-900 text-white rounded-xl flex items-center gap-2"
                >
                  {quizLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Brain size={18} />
                  )}
                  Test My Knowledge
                </button>

                <button
                  onClick={handleGeneratePlan}
                  className="px-5 py-2.5 bg-white border border-zinc-200 rounded-xl flex items-center gap-2"
                >
                  {planLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Calendar size={18} />
                  )}
                  Get Study Plan
                </button>

                <button
                  onClick={handleGenerateFlashcards}
                  className="px-5 py-2.5 bg-purple-600 text-white rounded-xl flex items-center gap-2"
                >
                  {flashLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <BookOpen size={18} />
                  )}
                  Flashcards
                </button>

                <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm">
                  <CheckCircle2 size={18} />
                  Exam Readiness: High
                </div>
              </div>

              {studyPlan && (
                <div className="mt-6 p-6 bg-indigo-50 rounded-2xl">
                  <Markdown>{studyPlan}</Markdown>
                </div>
              )}
            </div>

            {/* QUIZ */}
            {quiz.length > 0 && (
              <div className="bg-zinc-900 text-white rounded-3xl p-8">
                <h3 className="text-xl font-semibold mb-6">Quick Quiz</h3>

                {quiz.map((q, qIdx) => (
                  <div key={qIdx} className="mb-6">
                    <p className="mb-3 font-medium">{q.question}</p>

                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedAnswers[qIdx] === oIdx;
                      const isCorrect = q.correctAnswer === oIdx;

                      let bgColor = "bg-zinc-800";

                      if (showResults) {
                        if (isCorrect) bgColor = "bg-green-600";
                        else if (isSelected) bgColor = "bg-red-600";
                      } else if (isSelected) {
                        bgColor = "bg-indigo-600";
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={showResults}
                          onClick={() =>
                            setSelectedAnswers({
                              ...selectedAnswers,
                              [qIdx]: oIdx,
                            })
                          }
                          className={`block w-full text-left mb-2 p-3 rounded-xl transition ${bgColor}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                ))}

                {!showResults ? (
                  <button
                    onClick={handleSubmitQuiz}
                    className="mt-4 px-6 py-3 bg-indigo-600 rounded-xl"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <div className="mt-6 p-4 bg-zinc-800 rounded-xl">
                    <p className="text-lg font-semibold">
                      Your Score: {calculateScore()} / {quiz.length}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* FLASHCARDS */}
            {flashcards.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border">
                <h3 className="text-xl font-semibold mb-6 text-purple-700">
                  Flashcards
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {flashcards.map((card, index) => {
                    const flipped = flippedCards[index];

                    return (
                      <div
                        key={index}
                        onClick={() =>
                          setFlippedCards({
                            ...flippedCards,
                            [index]: !flipped,
                          })
                        }
                        className="cursor-pointer"
                      >
                        <div className="bg-purple-600 text-white rounded-2xl p-6 h-40 flex items-center justify-center text-center">
                          {flipped ? card.definition : card.term}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};