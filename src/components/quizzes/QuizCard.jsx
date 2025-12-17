import React from "react"
import { Link } from "react-router-dom"
import { Play, BarChart2, Trash2, Award } from "lucide-react"
import moment from "moment"

const QuizCard = ({ quiz, onDelete }) => {
  return (

   <div
  className="relative flex flex-col justify-between 
             min-h-[260px] sm:min-h-[280px] 
             p-4 sm:p-5 lg:p-6
             bg-white border border-slate-300 rounded-2xl sm:rounded-3xl
             shadow-sm hover:shadow-lg hover:border-emerald-300
             transition-all duration-300 group"
>

  {/* Delete Button */}
  <button
    onClick={(e) => {
      e.stopPropagation()
      onDelete(quiz)
    }}
    className="absolute top-3 right-3 sm:top-4 sm:right-4
               inline-flex items-center justify-center
               w-8 h-8 sm:w-9 sm:h-9
               rounded-lg sm:rounded-xl
               bg-white/80 hover:bg-red-50
               border border-slate-200 hover:border-red-200
               text-slate-400 hover:text-red-500
               transition-all duration-200
               shadow-sm hover:shadow-md active:scale-95"
  >
    <Trash2 className="w-4 h-4" strokeWidth={2} />
  </button>

  {/* Content */}
  <div className="space-y-4 sm:space-y-5">

    {/* Score Badge */}
    <div
      className="inline-flex items-center gap-1.5 sm:gap-2
                 px-2.5 sm:px-3 py-1 sm:py-1.5
                 rounded-full
                 bg-emerald-50 text-emerald-700
                 text-[11px] sm:text-xs font-semibold w-fit"
    >
      <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
      Score: {quiz?.score}
    </div>

    {/* Title & Date */}
    <div className="space-y-1">
      <h3
        title={quiz?.title}
        className="font-semibold text-slate-900
                   text-base sm:text-lg
                   leading-snug
                   line-clamp-2"
      >
        {quiz?.title || `Quiz - ${moment(quiz.createdAt).format("MMM D, YYYY")}`}
      </h3>

      <p className="text-xs sm:text-sm text-slate-500">
        Created {moment(quiz.createdAt).format("MMM D, YYYY")}
      </p>
    </div>

    {/* Quiz Info */}
    <div className="text-xs sm:text-sm font-medium text-slate-600">
      {quiz.questions.length}{" "}
      {quiz.questions.length === 1 ? "Question" : "Questions"}
    </div>
  </div>

  {/* Action Button */}
  <div className="mt-5 sm:mt-6">
    {quiz?.userAnswer?.length > 0 ? (
      <Link to={`/quizzes/${quiz._id}`} className="block">
        <button
          className="inline-flex items-center gap-2
                     w-full h-10 sm:h-11
                     px-4 sm:px-5
                     bg-white border border-slate-200
                     text-slate-700 font-semibold
                     text-xs sm:text-sm
                     rounded-lg sm:rounded-xl
                     hover:bg-slate-50 hover:border-slate-300
                     transition-all duration-200
                     shadow-sm hover:shadow-md active:scale-95
                     justify-center"
        >
          <BarChart2 className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
          View Results
        </button>
      </Link>
    ) : (
      <Link to={`/quizzes/${quiz._id}`} className="block">
        <button
          className="group relative inline-flex items-center gap-2
                     w-full h-10 sm:h-11
                     px-5 sm:px-6
                     bg-linear-to-r from-emerald-500 to-teal-500
                     hover:from-emerald-600 hover:to-teal-600
                     text-white font-semibold
                     text-xs sm:text-sm
                     rounded-lg sm:rounded-xl
                     transition-all duration-200
                     shadow-lg shadow-emerald-500/25
                     active:scale-95
                     focus:outline-none focus:ring-4 focus:ring-emerald-500/20
                     overflow-hidden
                     justify-center"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Play className="w-4 h-4" strokeWidth={2.5} />
            Start Quiz
          </span>

          {/* Shine effect */}
          <div
            className="absolute inset-0 bg-linear-to-r
                       from-white/0 via-white/20 to-white/0
                       translate-x-[-100%] group-hover:translate-x-[100%]
                       transition-transform duration-700"
          />
        </button>
      </Link>
    )}
  </div>
</div>

  )
}

export default QuizCard