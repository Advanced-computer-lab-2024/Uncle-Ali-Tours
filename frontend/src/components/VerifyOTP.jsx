import React from 'react'
import { useState } from 'react'
import { useUserStore } from '../store/user'
import { IoClose } from "react-icons/io5";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function VerifyOTP({visable = false, hide = () => {}, email = ""}) {
    const [otp, setOTP] = useState('')
    const {verifyOTP} = useUserStore()
    const navigate = useNavigate()
    const handleSubmit = async () => {
        const {success, message} = await verifyOTP(email, otp)
        success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
        if (success){
            handleClose()
            localStorage.setItem('email', email)
            navigate('/changePassword')
        }
    }

    const handleClose = () => {
        setOTP('')
        hide(2)
    }


  return (
    <>
    { visable &&
        <div className='bg-gray-700 grid h-fit text-center text-white p-4 w-[23vw] rounded-xl absolute right-0 left-0 top-[30vh] mx-auto'>
        <IoClose size={20} onClick={() => handleClose()} className='absolute right-3 h-fit top-3 rounded-full'/>
        <p className='my-4'>Verify your OTP ?</p>
        <p className='my-4'>
            please enter the OTP sent to your email
        </p>
        <input inputMode='numeric' className='mb-2 w-[14vw] rounded text-black mx-auto' placeholder=' otp' type='number' value={otp} onChange={(e) => setOTP(e.target.value)}/>
        <button onClick={() => handleSubmit()} className='bg-[#dc5809] w-fit mx-auto m-2 py-2 px-6 rounded-xl'>Send</button>
        </div>
}
<Toaster/>
        </>
  )
}

export default VerifyOTP