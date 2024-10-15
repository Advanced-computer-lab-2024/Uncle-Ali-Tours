import React from 'react'
import { useState } from 'react'
import { useUserStore } from '../store/user'
import { IoClose } from "react-icons/io5";
import toast, { Toaster } from 'react-hot-toast';

function ForgotPassword({visable = false, hide = () => {}, verify = () => {}}) {
    const [email, setEmail] = useState('')
    const {forgetPassword} = useUserStore()

    const handleSubmit = async () => {
        const {success, message} = await forgetPassword(email)
        success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
        if (success){
            verify(email)
            handleClose()
        }
            
    }

    const handleClose = () => {
        hide(1)
        setEmail('')
    }


  return (
    <>
    { visable &&
        <div className='bg-gray-700 grid h-fit text-center text-white p-4 w-[23vw] rounded-xl absolute right-0 left-0 top-[30vh] mx-auto'>
        <IoClose size={20} onClick={() => handleClose()} className='absolute right-3 h-fit top-3 rounded-full'/>
        <p className='my-4'>Forgot your Password ?</p>
        <p className='my-4'>
            please enter your email address
        </p>
        <input className='mb-2 w-[14vw] rounded text-black mx-auto' placeholder=' email' type='text' value={email} onChange={(e) => setEmail(e.target.value)}/>
        <button onClick={() => handleSubmit()} className='bg-[#dc5809] w-fit mx-auto m-2 py-2 px-6 rounded-xl'>Send</button>
        </div>
}
<Toaster/>
        </>
  )
}

export default ForgotPassword