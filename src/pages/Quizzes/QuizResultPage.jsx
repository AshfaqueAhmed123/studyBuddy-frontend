import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import quizService from "../../services/quizService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Target,
  BookOpen,
} from "lucide-react";
import Button from "../../components/common/Button";

const QuizResultPage = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await quizService.getQuizResults(quizId);
        setQuiz(res.data.quiz);
        setResults(res.data.results);
      } catch (err) {
        toast.error("Failed to fetch quiz results");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!quiz || !results.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        No quiz results available.
      </div>
    );
  }

  const correctCount = results.filter(r => r.isCorrect).length;
  const incorrectCount = results.length - correctCount;

  const scoreGradient = () => {
    if (quiz.score >= 80) return "from-emerald-500 to-teal-500";
    if (quiz.score >= 60) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-red-500";
  };

  const scoreMessage = () => {
    if (quiz.score >= 90) return "Outstanding!";
    if (quiz.score >= 80) return "Great Job!";
    if (quiz.score >= 70) return "Good Work!";
    if (quiz.score >= 60) return "Not Bad!";
    return "Keep Practicing!";
  };

  const ScoreIcon =
    quiz.score >= 80 ? Trophy : quiz.score >= 60 ? Target : BookOpen;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <PageHeader title={`Quiz Results: ${quiz.title}`} />

      {/* SUMMARY CARD */}
      <div className="bg-white/80 backdrop-blur border rounded-2xl p-6 text-center mb-8">
        <div
          className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${scoreGradient()} flex items-center justify-center mb-4`}
        >
          <ScoreIcon className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-3xl font-bold">{quiz.score}%</h2>
        <p className="text-slate-600 mb-4">{scoreMessage()}</p>

        <div className="flex justify-center gap-4 text-sm">
          <span className="px-3 py-1 bg-slate-100 rounded">
            {quiz.totalQuestions} Total
          </span>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded">
            {correctCount} Correct
          </span>
          <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded">
            {incorrectCount} Incorrect
          </span>
        </div>
      </div>

      {/* DETAILED REVIEW */}
      <div className="space-y-6">
        {results.map((q, index) => {
          const correctIndex = Number(q.correctAnswer.slice(0,2)) - 1;

          return (
            <div
              key={index}
              className="bg-white/80 backdrop-blur border rounded-2xl p-5"
            >
              <div className="flex justify-between mb-3">
                <h3 className="font-semibold">
                  Question {index + 1}
                </h3>
                {q.isCorrect ? (
                  <CheckCircle2 className="text-emerald-500" />
                ) : (
                  <XCircle className="text-rose-500" />
                )}
              </div>

              <p className="mb-4">{q.question}</p>

              <div className="space-y-2">
                {q.options.map((opt, idx) => {
                  const isCorrectOption = idx === correctIndex;
                  const isSelected = q.selectedAnswer === opt;
                  const isWrongSelected = isSelected && !q.isCorrect;

                  console.log(q.correctAnswer.slice(0,2))

                  return (
                    <div
                      key={idx}
                      className={`flex justify-between items-center px-4 py-2 rounded-lg border text-sm
                        ${
                          isCorrectOption
                            ? "bg-emerald-100 border-emerald-400"
                            : isWrongSelected
                              ? "bg-rose-100 border-rose-400"
                              : "border-slate-200"
                        }`}
                    >
                      <span>{opt}</span>

                      {isCorrectOption && (
                        <span className="text-xs font-semibold text-emerald-700">
                          Correct
                        </span>
                      )}

                      {isWrongSelected && (
                        <span className="text-xs font-semibold text-rose-700">
                          Your Answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <div className="mt-3 p-3 bg-slate-50 border-l-4 border-emerald-400 text-sm">
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link to="/documents">
          <Button variant="secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default QuizResultPage;
