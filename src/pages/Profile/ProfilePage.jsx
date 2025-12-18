import React, {useState,useEffect} from 'react'
import PageHeader from "../../components/common/PageHeader"
import Button from "../../components/common/Button"
import Spinner from "../../components/common/Spinner"
import authService from "../../services/authService"
import {useAuth} from "../../context/AuthContext"
import toast from "react-hot-toast"
import {User,Mail,Lock} from "lucide-react"

const ProfilePage = () => {

  const [loading,setLoading] = useState(true)
  const [passwordLoading,setPasswordLoading] = useState(false)

  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [currentPassword,setCurrentPassword] = useState("")
  const [newPassword,setNewPassword] = useState("")
  const [confirmNewPassword,setConfirmNewPassword] = useState("")


  

  return (
    <div>ProfilePage</div>
  )
}

export default ProfilePage