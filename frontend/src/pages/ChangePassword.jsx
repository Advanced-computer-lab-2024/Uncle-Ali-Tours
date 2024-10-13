import React from 'react'
import { useState, useEffect } from 'react'
import { useUserStore } from '../store/user'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const {changePassword} = useUserStore()
    const navigate = useNavigate()
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            navigate('/')
        }
    }
    , [])

    const handleChangePassword = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const data = {
            userName: user.userName,
            oldPassword: oldPassword,
            newPassword: newPassword
        }
        const {success, message} =  await changePassword(data)
        success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})

    }
  return (
    <div className='bg-white mt-32 w-fit h-fit mx-auto pt-2 rounded-xl'>
        <Toaster />
        <div className='flex flex-col items-center'>
            <input name='userName' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder='Old Password' className='border border-[rgb(205,205,205)] m-6 p-2 shadow-md rounded bg-gray-300' type='password' />
            <input name='email' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='New Password' className='border border-[rgb(205,205,205)] m-6 p-2 shadow-md rounded bg-gray-300' type='password' />
            <button onClick={() => (handleChangePassword())} className='bg-black text-white m-6 p-2 rounded'>Change Password</button>
        </div>
    </div>
  )
}

export default ChangePassword