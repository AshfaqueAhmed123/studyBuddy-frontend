import React, { useEffect, useState } from 'react'
import Spinner from "../../components/common/Spinner"
import progressService from "../../services/progressService"
import toast from "react-hot-toast"
import {
  FileText,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  Clock
} from "lucide-react"

const DashboardPage = () => {

  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData()
        setDashboardData(data.data)
      } catch (error) {
        toast.error('failed to fetch dashboard data')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading) return <Spinner />

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4'>
            <TrendingUp className='w-8 h-8 text-slate-400' />
          </div>
          <p className='text-slate-600 text-sm'>
            No dashboard data available
          </p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: "Total Documents",
      value: dashboardData.overview.totalDocuments,
      icon: FileText,
      gradient: 'from-blue-400 to-cyan-500',
      shadowColor: 'shadow-blue-500/25'
    },
    {
      label: "Total Flashcards",
      value: dashboardData.overview.totalFlashcards,
      icon: BookOpen,
      gradient: 'from-purple-400 to-pink-500',
      shadowColor: 'shadow-purple-500/25'
    },
    {
      label: "Total Quizzes",
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
      gradient: 'from-emerald-400 to-teal-500',
      shadowColor: 'shadow-emerald-500/25'
    }
  ]

  // Prepare recent activity array
  const recentActivity = [
    ...(dashboardData.recentActivity?.documents || []).map(doc => ({
      id: doc._id,
      description: doc.title,
      timestamp: doc.lastAccessed,
      link: `/documents/${doc._id}`,
      type: 'document'
    })),
    ...(dashboardData.recentActivity?.quizzes || []).map(quiz => ({
      id: quiz._id,
      description: quiz.title,
      timestamp: quiz.lastAccessed,
      link: `/quizzes/${quiz._id}`,
      type: 'quiz'
    }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your learning progress and activity
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`relative bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg ${stat.shadowColor} mb-4`}>
              <stat.icon size={22} strokeWidth={2.5} />
            </div>
            <p className="text-sm text-slate-500">{stat.label}</p>
            <h2 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-emerald-600" />
          <h3 className="text-sm font-semibold text-slate-900">
            Recent Activity
          </h3>
        </div>

        {recentActivity.length === 0 ? (
          <p className="text-sm text-slate-500">
            No recent activity yet. Start learning to see progress here.
          </p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200/60 hover:bg-slate-50 transition-colors duration-200"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {activity.type === 'document' ? 'Accessed Document' : 'Attempted Quiz'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {activity.description}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
                <a
                  href={activity.link}
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
