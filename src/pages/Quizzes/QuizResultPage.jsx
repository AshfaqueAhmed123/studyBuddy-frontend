// import React,{useState,useEffect} from 'react'
// import { useParams, Link } from 'react-router-dom'
// import quizService from '../../services/quizService'
// import PageHeader from '../../components/common/PageHeader'
// import Spinner from '../../components/common/Spinner'
// import toast from "react-hot-toast"
// import {ArrowLeft,CheckCircle2,XCircle,Trophy,Target,BookOpen} from "lucide-react"

// const QuizResultPage = () => {

//     const {quizId} = useParams()
//     const [results,setResults] = useState(null)
//     const [loading,setLoading] = useState(true)


//    useEffect(()=>{
//      const fetchResults = async () => {
//       try {
//           const data = await quizService.getQuizResults(quizId)
//           setResults(data)
//       } catch (error) {
//         toast.error('Failed to fetch Quiz results')
//         console.error(error)
//       } finally{
//         setLoading(false)
//       }
//     }

//     fetchResults()
//    },[quizId])


//    if(loading){
//     return (
//       <div className='flex items-center justify-center min-h-[60vh]'>
//         <Spinner/>
//       </div>
//     )
//    }

//    if(!results || !results.data){
//     return (
//       <div className='flex items-center justify-center min-h-[60vh]'>
//         <div className='text-center'>
//           <p className='text-slate-600 text-lg'>Quiz results not found.</p>
//         </div>
//       </div>
//     )
//    }


//    const {data:{quiz, result:detailedResults}} = results;
//    const score = quiz.score
//    const totalQuestions = detailedResults?.length
//    const correctAnswers = detailedResults?.filter(r => r.isCorrect)?.length;
//    const inCorrectAnswers = totalQuestions-correctAnswers

//    const getScoreColor = () => {
//     if(score >= 80) return "from-emerald-500 to-teal-500"
//     if(score >= 60) return "from-amber-500 to-orange-500"
//     return "from-rose-500 to-red-500"
//    }

//    const getScoreMessage = ()=> {
//       if(score >= 90) return "OutStanding!"
//       if(score >= 80) return "Great Job!"
//       if(score >= 70) return "Good work!"
//       if(score >= 60) return "Not bad!"
//       return "Keep practising"
//    }

//   return (
//     <div className='max-w-5xl mx-auto'>
//       <div className='mb-6'>
//         <Link
//           to={`/documents/${quiz.document}`}
//           className='group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors duration-200'
//         >
//           <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200' strokeWidth={2}/>
//           Back to Document
//         </Link>
//       </div>

//       <PageHeader title={`${quiz.title || 'Quiz'} Results`} />

//       {/* score card */}
//       <div className='bg-white/80 backdrop-blur-xl border-2 border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50  p-8 mb-8'>
//         <div className='text-center space-y-6'>
//             <div className="inline-flex items-center justify-center w-15 h-15 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 shadow-lg shadow-emerald-500/25">
//               <Trophy className='w-7 h-7 text-emerald-600' strokeWidth={2}/>
//             </div>

//             <div className=''>
//               <p className='text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2'>
//                 Your Score
//               </p>
//               <div className={`inline-block text-5xl font-bold bg-linear-to-r ${getScoreColor(score)} bg-clip-text text-transparent mb-2 `}>
//                 {score}%
//               </div>
//               <p className='text-lg font-medium text-slate-700'>
//                 {getScoreMessage(score)}
//               </p>
//             </div>

//             {/* Stats  */}
//             <div className=''>
//               <div className="">
//                 <Target className="" strokeWidth={2}/>
//                 <span>
//                   {totalQuestions} Total
//                 </span>
//               </div>

//               <div>
//                 <CheckCircle2 strokeWidth={2}></CheckCircle2>
//                 <span>
//                   {correctAnswers} correct
//                 </span>
//               </div>
//               <div className="">
//                 <XCircle strokeWidth={2}/>
//                 <span>
//                   {inCorrectAnswers} InCorrect
//                 </span>
//               </div>
//             </div>

//         </div>
//       </div>
//     </div>
//   )
// }

// export default QuizResultPage

import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import quizService from "../../services/quizService"
import PageHeader from "../../components/common/PageHeader"
import Spinner from "../../components/common/Spinner"
import toast from "react-hot-toast"
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Target
} from "lucide-react"

const QuizResultPage = () => {
  const { quizId } = useParams()

  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await quizService.getQuizResults(quizId)
        setResults(response)
      } catch (error) {
        toast.error("Failed to fetch quiz results")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [quizId])

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    )
  }

  /* ---------------- Empty State ---------------- */
  if (!results?.data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-600 text-lg">Quiz results not found.</p>
      </div>
    )
  }

  /* ---------------- Data Mapping (FIXED) ---------------- */
  const { quiz, results: detailedResults } = results.data

  const totalQuestions = detailedResults.length
  const correctAnswers = detailedResults.filter(r => r.isCorrect).length
  const incorrectAnswers = totalQuestions - correctAnswers

  const score =
    quiz.score ||
    Math.round((correctAnswers / totalQuestions) * 100)

  /* ---------------- Helpers ---------------- */
  const getScoreColor = () => {
    if (score >= 80) return "from-emerald-500 to-teal-500"
    if (score >= 60) return "from-amber-500 to-orange-500"
    return "from-rose-500 to-red-500"
  }

  const getScoreMessage = () => {
    if (score >= 90) return "Outstanding!"
    if (score >= 80) return "Great job!"
    if (score >= 70) return "Good work!"
    if (score >= 60) return "Not bad!"
    return "Keep practicing"
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-5xl mx-auto">
      {/* Back link */}
      <div className="mb-6">
        <Link
          to={`/documents/${quiz.document}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Document
        </Link>
      </div>

      <PageHeader title={`${quiz.title || "Quiz"} Results`} />

      {/* Score Card */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 mb-8 shadow-lg">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100">
            <Trophy className="w-7 h-7 text-emerald-600" />
          </div>

          {/* Score */}
          <div>
            <p className="text-sm font-semibold text-slate-600 uppercase mb-2">
              Your Score
            </p>
            <div
              className={`text-5xl font-bold bg-gradient-to-r ${getScoreColor()} bg-clip-text text-transparent`}
            >
              {score}%
            </div>
            <p className="text-lg font-medium text-slate-700">
              {getScoreMessage()}
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2 text-slate-600">
              <Target className="w-4 h-4" />
              {totalQuestions} Total
            </div>

            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              {correctAnswers} Correct
            </div>

            <div className="flex items-center gap-2 text-rose-600">
              <XCircle className="w-4 h-4" />
              {incorrectAnswers} Incorrect
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizResultPage
