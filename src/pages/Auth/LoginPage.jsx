import React, { useState } from 'react'
import {Link, useNavigate} from "react-router-dom"
import { useAuth } from '../../context/AuthContext'
import authService from "../../services/authService"
import {BrainCircuit,Mail,Lock,ArrowRight} from "lucide-react"
import toast from "react-hot-toast"

const LoginPage = () => {


  const [email,setEmail] = useState("exmaple@gmail.com")
  const [password,setPassword] = useState("******")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusField, setFocusField] = useState(null)

  const navigate = useNavigate()
  const {login} = useAuth;

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
    }
  }



  return (
        <></>           
  )
}

export default LoginPage