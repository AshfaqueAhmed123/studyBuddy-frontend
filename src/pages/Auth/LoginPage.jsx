import React, { useState } from 'react'
import {Link, useNavigate} from "react-router-dom"
import { useAuth } from '../../context/AuthContext'
import authService from "../../services/authService"
import {BrainCircuit,Mail,Lock,ArrowRight} from "lucide-react"
import toast from "react-hot-toast"

const LoginPage = () => {

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusField, setFocusField] = useState(null)

  const navigate = useNavigate()
  const {login} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const {token,user} = await authService.login(email,password)
      login(user,token)
      toast.success('logged in successfully')
      navigate("/dashboard")
    } catch (error) {
      setError(error.message || "failed to login please check your credentials")
      toast.error(error.message || "failed to login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <div className="relative w-full max-w-md px-6">
        <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-3xl shadow-xl p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mb-4">
              <BrainCircuit strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Welcome back
            </h1>
            <p className="text-slate-500 mt-2">
              sign in to continue your journey
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Email
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusField === 'email' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  <Mail strokeWidth={2}/>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e)=> setEmail(e.target.value)}
                  onFocus={()=> setFocusField('email')}
                  onBlur={()=> setFocusField(null)}
                  placeholder="exmaple@email.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Password
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusField === 'password' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  <Lock strokeWidth={2}/>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e)=> setPassword(e.target.value)}
                  onFocus={()=> setFocusField('password')}
                  onBlur={()=> setFocusField(null)}
                  placeholder="******"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
                w-full h-12
                flex items-center justify-center gap-2
                rounded-xl font-medium text-white
                bg-emerald-500 hover:bg-emerald-600
                transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight strokeWidth={2.5} />
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-600 hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-center text-xs text-slate-400 mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default LoginPage
