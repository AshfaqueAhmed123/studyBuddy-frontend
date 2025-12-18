import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import quizService from '../../services/quizService'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import toast from "react-hot-toast"
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Target, BookOpen } from "lucide-react"
import Button from "../../components/common/Button"

const QuizResultPage = () => {

  const { quizId } = useParams()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await quizService.getQuizResults(quizId)
          console.log(data)
        // Map answers to indexes for frontend highlighting
        if (data?.results) {
          const mappedResults = data.results.map(q => ({
            ...q,
            correctOptionIndex: q.options.findIndex(o => o === q.correctAnswer),
            selectedOptionIndex: q.selectedAnswer !== null ? q.options.findIndex(o => o === q.selectedAnswer) : -1
          }))
          data.results = mappedResults
        }

        setResults(data)
      } catch (error) {
        toast.error('Failed to fetch Quiz results')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [quizId])


  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <Spinner />
      </div>
    )
  }

  if (!results || !results.data) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <p className='text-slate-600 text-lg'>Quiz results not found.</p>
        </div>
      </div>
    )
  }

  const { data: { quiz, results: detailedResults } } = results;
  const score = quiz.score
  const totalQuestions = detailedResults?.length
  const correctAnswers = detailedResults?.filter(r => r.isCorrect)?.length;
  const inCorrectAnswers = totalQuestions - correctAnswers


  console.log("correctAnswers",correctAnswers)
  console.log("inCorrectAnswers",inCorrectAnswers)
  console.log("score",score)



  const getScoreColor = () => {
    if (score >= 80) return "from-emerald-500 to-teal-500"
    if (score >= 60) return "from-amber-500 to-orange-500"
    return "from-rose-500 to-red-500"
  }

  const getScoreMessage = () => {
    if (score >= 90) return "Outstanding!"
    if (score >= 80) return "Great Job!"
    if (score >= 70) return "Good work!"
    if (score >= 60) return "Not bad!"
    return "Keep practising"
  }

                console.log(detailedResults)


  return (
    <div className='max-w-4xl mx-auto'>
      <PageHeader title={`Quiz Results: ${quiz.title}`} />

      {/* Result Summary Card */}
      <div className={`bg-white/80 backdrop-blur-xl border-2 border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-6 my-6 flex flex-col items-center text-center`}>
        <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 bg-linear-to-r ${getScoreColor()}`}>
          {score >= 80 ? <Trophy className="w-8 h-8 text-white" /> : score >= 60 ? <Target className="w-8 h-8 text-white" /> : <BookOpen className="w-8 h-8 text-white" />}
        </div>
        <h2 className='text-3xl font-bold text-slate-900 mb-2'>{score}%</h2>
        <p className='text-lg font-semibold text-slate-700 mb-4'>{getScoreMessage()}</p>

        <div className='flex gap-6'>
          <div>
            <p className='text-slate-500'>Total Questions</p>
            <p className='font-semibold text-slate-900'>{totalQuestions}</p>
          </div>
          <div>
            <p className='text-slate-500'>Correct</p>
            <p className='font-semibold text-emerald-600'>{correctAnswers}</p>
          </div>
          <div>
            <p className='text-slate-500'>Incorrect</p>
            <p className='font-semibold text-rose-500'>{inCorrectAnswers}</p>
          </div>
        </div>
      </div>

      {/* Detailed Review */}
      <div className='space-y-6'>
        {detailedResults.map((q, index) => (
          <div key={index} className='bg-white/80 backdrop-blur-xl border-2 border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-5'>
            <div className='flex items-center gap-2 mb-4'>
              <div className={`w-2 h-2 rounded-full ${q.isCorrect ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-pulse'}`}></div>
              <h3 className='font-semibold text-slate-900 text-lg'>Question {index + 1}</h3>
            </div>
            <p className='text-slate-800 mb-4'>{q.question}</p>

            <div className='space-y-2'>
              {q.options.map((option, idx) => {
                return (
                 <div>{option}</div>
                )
              })}
            </div>

            {q.explanation && (
              <div className='mt-3 p-3 bg-slate-50 border-l-4 border-emerald-300 rounded-r-lg text-slate-700 text-sm'>
                <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Back Button */}
      <div className='mt-6 flex justify-center'>
        <Link to="/documents">
          <Button variant="secondary">
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2.5} />
            Back to Documents
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default QuizResultPage
