import React from 'react'
import { useState, useEffect } from 'react'
import { useUserStore } from '../store/user'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [forgot, setForgot] = useState(false)
    const {changePassword} = useUserStore()
    const navigate = useNavigate()
    useEffect(() => {
        const email = localStorage.getItem('email')
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user && !email) {
            navigate('/')
        }
        if (email && !user) {
            setForgot(true)
        }
    }
    , [])

    const handleChangePassword = async () => {
        const email = localStorage.getItem('email')
        const user = JSON.parse(localStorage.getItem("user"));
        const data = !email ? {
            userName: user.userName,
            oldPassword: oldPassword,
            newPassword: newPassword,
            forgot: forgot
        } : {
            email: email,
            newPassword: newPassword,
            forgot: forgot
        }
        const {success, message} =  await changePassword(data)
        const t = success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
        if (success) {
            localStorage.removeItem('email')
            await new Promise(r => setTimeout(r, 1000));
            toast.remove(t)
            navigate('/')
        }

    }
  return (
    <div className='bg-white mt-32 w-fit h-fit mx-auto pt-2 rounded-xl'>
        <Toaster />
        <div className='flex flex-col items-center'>
            {!forgot && <input name='userName' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder='Old Password' className='border border-[rgb(205,205,205)] m-6 p-2 shadow-md rounded bg-gray-300' type='password' />}
            <input name='email' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='New Password' className='border border-[rgb(205,205,205)] m-6 p-2 shadow-md rounded bg-gray-300' type='password' />
            <button onClick={() => (handleChangePassword())} className='bg-black text-white m-6 p-2 rounded'>Change Password</button>
        </div>
    </div>
  )
}

export default ChangePassword