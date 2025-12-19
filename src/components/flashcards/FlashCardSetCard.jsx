// import React from 'react'
// import {Navigate, useNavigate} from "react-router-dom"
// import {BookOpen, Sparkles, TrendingUp } from "lucide-react"
// import moment from "moment"

// const FlashCardSetCard = ({flashcardSet}) => {


//   const navigate = useNavigate();

//   const handleStudyNav = () => {
//     navigate(`/documents/${flashcardSet.documentId._id}/flashcards`)
//   }

//   const reviewedCount = flashcardSet.cards.filter(card => card.lastReviewed).length;
//   const totalCards = flashcardSet.cards.length;
//   const progress = totalCards > 0 ? Math.round((reviewedCount/totalCards)*100) : 0

//   return (
//     <div>FlashcardSetCard</div>
//   )
// }

// export default FlashCardSetCard

import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, TrendingUp } from "lucide-react";
import moment from "moment";

const FlashCardSetCard = ({ flashcardSet }) => {
  const navigate = useNavigate();

  const handleStudyNav = () => {
    navigate(`/document/${flashcardSet.documentId._id}/flashcards`);
    
  };

  const totalCards = flashcardSet.cards.length;
  const reviewedCount = flashcardSet.cards.filter(
    (card) => card.lastReviewed
  ).length;

  const progressPercentage =
    totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

  return (
    <div className="bg-white max-w- border-2 border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-emerald-600" strokeWidth={2.2} />
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900 leading-tight">
            {flashcardSet.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Created {moment(flashcardSet.createdAt).fromNow()}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-slate-700">
          <Sparkles className="w-3.5 h-3.5" />
          {totalCards} Cards
        </div>

        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
          <TrendingUp className="w-3.5 h-3.5" />
          {progressPercentage}%
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Progress</span>
          <span>
            {reviewedCount}/{totalCards} reviewed
          </span>
        </div>

        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleStudyNav}
        className="mt-2 inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold text-sm transition"
      >
        <Sparkles className="w-4 h-4" strokeWidth={2.2} />
        Study Now
      </button>
    </div>
  );
};

export default FlashCardSetCard;
