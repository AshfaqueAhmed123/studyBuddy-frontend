import React from 'react'
import { Navigate, useNavigate } from "react-router-dom"
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from "lucide-react"
import moment from "moment"

// helper function to format file size 
const formatFileSize = (bytes) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
}

const DocumentCard = ({
    document,
    onDelete
}) => {

    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/documents/${document._id}`)
    }

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(document)
    }


    return (
        <div
            // Main Card Container Styling
            className={`
        bg-white 
        border border-gray-100 
        rounded-xl 
        shadow-lg 
        transition-all 
        duration-300 
        p-6 
        max-w-sm 
        w-full 
        cursor-pointer 
        relative 
        group
        // Enhanced Hover Effect: Lift and add a distinct ring/border
        transform hover:scale-[1.03] hover:shadow-2xl hover:border-emerald-300
    `}
            onClick={handleNavigate}
        >
            {/* Visual Indicator (Subtle bottom border highlight on hover) */}
            <div className={`
        absolute 
        bottom-0 
        left-0 
        right-0 
        h-1 
        bg-emerald-500 
        rounded-b-xl 
        opacity-0 
        group-hover:opacity-100 
        transition-opacity 
        duration-300
    `}></div>

            <div className='relative z-10'>
                {/* Header section */}
                <div className='flex flex-col space-y-4'>
                    <div className='flex justify-between items-start'>
                        {/* Icon (Made Squarish and Emerald Color) */}
                        <div className={`
                    p-3 
                    rounded-lg // Changed to rounded-lg for squarish look
                    bg-emerald-100 
                    text-emerald-600 
                    flex-shrink-0
                    border border-emerald-200 // Added a subtle border
                `}>
                            <FileText strokeWidth={2} className='w-6 h-6' />
                        </div>

                        {/* Delete Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Stop navigation when clicking delete
                                handleDelete(e);
                            }}
                            className={`
                        text-gray-400 
                        hover:text-red-500 
                        transition-colors 
                        p-1 
                        rounded-full
                        hover:bg-red-50
                        focus:outline-none
                        flex-shrink-0
                    `}
                        >
                            <Trash2 strokeWidth={2} className='w-5 h-5' />
                        </button>
                    </div>

                    {/* Title */}
                    <h3 className='
                text-xl 
                font-extrabold // Made title bolder
                text-gray-900 
                truncate 
                leading-snug
                group-hover:text-purple-700 // Light purple on hover for the title
            ' title={document.title}>
                        {document.title}
                    </h3>

                    {/* document info (File Size Badge - Emerald) */}
                    <div className='text-sm text-gray-500'>
                        {document.fileSize !== undefined && (
                            <span className='
                        inline-block 
                        bg-emerald-50 
                        text-emerald-700 
                        px-3 py-1 // Slightly larger padding
                        rounded-lg // Squarish badge
                        font-medium
                        border border-emerald-100
                    '>
                                {formatFileSize(document.fileSize)}
                            </span>
                        )}
                    </div>

                    {/* stats section  */}
                    <div className='flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-gray-100'>
                        {document.flashcardCount !== undefined && (
                            <div className='flex flex-row items-center text-sm font-medium text-gray-700'>
                                <BookOpen strokeWidth={2} className='w-4 h-4 mr-2 text-emerald-500' />
                                <span>{document.flashcardCount} Flashcards</span>
                            </div>
                        )}
                        {document.quizCount !== undefined && (
                            <div className='flex items-center text-sm font-medium text-gray-700'>
                                <BrainCircuit strokeWidth={2} className='w-4 h-4 mr-2 text-purple-600' />
                                <span>{document.quizCount} Quizzes</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* footer section */}
                <div className='mt-5 pt-4 border-t border-gray-100'>
                    <div className='flex items-center text-xs text-gray-400 font-medium'>
                        <Clock strokeWidth={2} className='w-4 h-4 mr-1' />
                        <span>Uploaded {moment(document.createdAt).fromNow()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DocumentCard