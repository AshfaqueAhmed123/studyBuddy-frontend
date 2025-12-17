import React, { useState, useEffect } from 'react'
import { Plus, Trash2 } from "lucide-react"
import toast from "react-hot-toast"

import quizService from "../../services/quizService"
import AiService from "../../services/aiServices"
import Spinner from "../../components/common/Spinner"
import Button from "../../components/common/Button"
import Modal from "../../components/common/Modal"
import QuizCard from "./QuizCard"
import EmptyState from '../common/EmptyState'

const QuizManager = ({ documentId }) => {


    const [quizzes, setQuizzes] = useState([])
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [isGenerateModalOpen, setIsGeneratedModalOpen] = useState(false)
    const [numQuestions, setNumQuestions] = useState(5)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [selectedQuiz, setSelectedQuiz] = useState(null)


    const fetchQuizzes = async () => {
        setLoading(true)
        try {
            const data = await quizService.getQuizzesForDocument(documentId)
            setQuizzes(data.quiz)
        } catch (error) {
            toast.error("Failed to fetch quizzes")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (documentId) {
            fetchQuizzes()
        }
    }, [documentId])



    const handleGenerateQuiz = async (e) => {
        e.preventDefault()
        setGenerating(true)
        try {
            await AiService.generateQuiz(documentId, { numQuestions })
            toast.success("Quiz generated successfully")
            setIsGeneratedModalOpen(false)
            fetchQuizzes()
        } catch (error) {
            toast.error(error?.message || "Failed to generate Quiz")
        } finally {
            setGenerating(false)
        }
    }


    const handleDeleteRequest = (quiz) => {
        setSelectedQuiz(quiz)
        setIsDeleteModalOpen(true)
    }


    const handleConfirmDelete = async () => {
        if(!selectedQuiz) return
        setDeleting(true)
        try {
            await quizService.deleteQuiz(selectedQuiz._id)
            toast.success(`${selectedQuiz.title || "Quiz"} deleted.`)
            setIsDeleteModalOpen(false)
            setSelectedQuiz(null)
            setQuizzes(quizzes.filter(q => q._id !== selectedQuiz._id))
        } catch (error) {
            toast.error(`failed to delete quiz`)
        }finally{
            setDeleting(false)
        }
    }

    const renderQuizContent = () => {
        if(loading){
            return <Spinner/>
        }

        if(!quizzes || quizzes.length === 0){
            return (
                <EmptyState 
            title="No Quizzes"
            description="Generate a Quiz from your documents to test your knowledge"
            />
            )
        }


        return (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {quizzes?.map((quiz)=>(
                    <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDeleteRequest} />
                ))}
            </div>
        )

    }




    return (
        <div className='bg-white border border-neutral-200 rounded-lg p-6'>
            <div className='flex justify-end gap-2 mb-4'>
                <Button
                    onClick={()=>setIsGeneratedModalOpen(true)}
                >
                    <Plus size={16} />
                    Generate Quiz
                </Button>
            </div>

            {renderQuizContent()}


            {/* Generate Quiz */}
            <Modal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGeneratedModalOpen(false)}
                title="Generate New Quiz"
            >
                <form onSubmit={handleGenerateQuiz} className="space-y-6">

                    {/* Input Group */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Number of Questions
                        </label>

                        <input
                            type="number"
                            value={numQuestions}
                            onChange={(e) =>
                                setNumQuestions(Math.max(1, parseInt(e.target.value) || 1))
                            }
                            min="1"
                            required
                            className="w-full h-11 px-4
                   rounded-xl
                   border border-slate-300
                   bg-white
                   text-slate-900 text-sm font-medium
                   placeholder-slate-400
                   focus:outline-none focus:ring-4 focus:ring-emerald-500/20
                   focus:border-emerald-500
                   transition-all duration-200"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 sm:justify-end pt-2">

                        {/* Cancel */}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsGeneratedModalOpen(false)}
                            disabled={generating}
                            className="h-11 px-6
                   rounded-xl
                   text-sm font-semibold
                   border border-slate-300
                   bg-white
                   text-slate-700
                   hover:bg-slate-50
                   transition-all duration-200
                   active:scale-95"
                        >
                            Cancel
                        </Button>

                        {/* Generate */}
                        <Button
                            type="submit"
                            disabled={generating}
                            className="relative h-11 px-6
                   rounded-xl
                   text-sm font-semibold text-white
                   bg-linear-to-r from-emerald-500 to-teal-500
                   hover:from-emerald-600 hover:to-teal-600
                   shadow-lg shadow-emerald-500/25
                   transition-all duration-200
                   active:scale-95
                   focus:outline-none focus:ring-4 focus:ring-emerald-500/20
                   overflow-hidden"
                        >
                            <span className="relative z-10">
                                {generating ? "Generating..." : "Generate"}
                            </span>

                            {/* Shine effect */}
                            <div
                                className="absolute inset-0 bg-linear-to-r
                     from-white/0 via-white/20 to-white/0
                     translate-x-[-100%]
                     group-hover:translate-x-[100%]
                     transition-transform duration-700"
                            />
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete modal */}
            <Modal
                 isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Delete Quiz"
            >
                <div className="space-y-6">

                    {/* Warning Text */}
                    <p className="text-sm text-slate-600">
                        Are you sure you want to DELETE : <span className="font-semibold text-red-600">{selectedQuiz?.title || "this Quiz"}</span>{" "}
                        <span className="font-medium text-slate-900"></span>?. This action can not be undone.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 sm:justify-end pt-2">

                        {/* Cancel Button */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={deleting}
                            className="h-11 px-6
                   rounded-xl
                   text-sm font-semibold
                   border border-slate-300
                   bg-white
                   text-slate-700
                   hover:bg-slate-50
                   transition-all duration-200
                   active:scale-95"
                        >
                            Cancel
                        </Button>

                        {/* Delete Button */}
                        <Button
                            onClick={handleConfirmDelete}
                            disabled={deleting}
                            className="relative h-11 px-6
                   rounded-xl
                   text-sm font-semibold text-white
                   bg-linear-to-r from-red-500 to-rose-500
                   hover:from-red-600 hover:to-rose-600
                   shadow-lg shadow-red-500/25
                   transition-all duration-200
                   active:scale-95
                   focus:outline-none focus:ring-4 focus:ring-red-500/20
                   overflow-hidden w-full sm:w-auto"
                        >
                            <span className="relative z-10">{deleting ? "Deleting..." : "Delete"}</span>

                            {/* Shine Effect */}
                            <div
                                className="absolute inset-0 bg-linear-to-r
                     from-white/0 via-white/20 to-white/0
                     translate-x-[-100%]
                     group-hover:translate-x-[100%]
                     transition-transform duration-700"
                            />
                        </Button>

                    </div>
                </div>
            </Modal>

            
        </div>
    )
}

export default QuizManager