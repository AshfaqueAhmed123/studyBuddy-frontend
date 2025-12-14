import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from '../../context/AuthContext'
import authService from "../../services/authService"
import { BrainCircuit, Mail, Lock, ArrowRight, User } from "lucide-react"
import toast from "react-hot-toast"

const RegisterPage = () => {

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusField, setFocusField] = useState(null)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password.length < 6) {
      setError("password must be at least 6 characters long.")
      return
    }

    setError('')
    setLoading(true)
    try {
      await authService.register(username, email, password)
      toast.success('registered successfully, please login')
      navigate("/login")
    } catch (error) {
      setError(error.message || "failed to register please try again")
      toast.error(error.message || "failed to register")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-4">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl shadow-xl p-6">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 mb-3">
              <BrainCircuit strokeWidth={2} />
            </div>
            <h1 className="text-xl font-semibold text-slate-800">Create account</h1>
            <p className="text-slate-500 text-sm mt-1">start your AI powered learning experience</p>
          </div>

          {/* Form */}
          <form className="space-y-3" onSubmit={handleSubmit}>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User strokeWidth={2} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusField('username')}
                  onBlur={() => setFocusField(null)}
                  placeholder="Your username"
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${focusField === 'email' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  <Mail strokeWidth={2} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusField('email')}
                  onBlur={() => setFocusField(null)}
                  placeholder="example@email.com"
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${focusField === 'password' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  <Lock strokeWidth={2} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusField('password')}
                  onBlur={() => setFocusField(null)}
                  placeholder="******"
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none text-sm"
                />
              </div>
            </div>

            {/* Error */}
            <div className="min-h-[40px]">
              {error && (
                <div className="w-full bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2 break-words max-h-24 overflow-y-auto">
                  {error}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 flex items-center justify-center gap-2 rounded-lg font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>creating account...</span>
                </>
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center text-xs text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 hover:underline font-medium">Sign in</Link>
          </div>

        </div>

        {/* Subtitle */}
        <p className="text-center text-xs text-slate-400 mt-4 px-2">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
