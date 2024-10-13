import React from 'react'
import { useState, useEffect } from 'react'
import { useUserStore } from '../store/user'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [credentials, setCredentials] = useState({
    userName: '',
    password: ''
  })
  const {login} = useUserStore()
  const navigate = useNavigate()

  const redirect = (type) => {
    switch (type) {
      case "tour guide":
        navigate("/TourGuideProfilePage");
        break;
      case "advertiser":
        navigate("/advertiserProfile");
        break;
      case "seller":
        navigate("/sellerProfile");
        break;
      case "tourist":
        navigate("/touristProfile");
        break;
      case "admin":
        navigate("/admin");
        break;

      case "governor":
        navigate("/attraction");
        break;
    
      default:
        break;
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress, false);

    return () => {
      document.removeEventListener("keydown", handleKeyPress, false);
    };
  }, [handleKeyPress]);


  const handleSubmit = async () => {
    const {success, message, type} =  await login(credentials)
    console.log(type)
    success ? toast.success(message, {className: "text-white bg-gray-800"}) : toast.error(message, {className: "text-white bg-gray-800"})
    if (success) {
      await new Promise(r => setTimeout(r, 2000));
      redirect(type);
    }
  }

  return (
    <div className='bg-white mt-32 w-fit mx-auto pt-2 rounded-xl'>
      <Toaster />
        <div className='flex flex-col items-center'>
            <input className='border border-[rgb(205,205,205)] m-6 p-2 shadow-md rounded bg-gray-300' value={credentials.userName} onChange={(e) => (setCredentials({...credentials, userName:e.target.value}))} type='text' placeholder='Username' />
            <input className='border border-[rgb(205,205,205)] m-6 p-2 shadow-md rounded bg-gray-300' value={credentials.password} onChange={(e) => (setCredentials({...credentials, password:e.target.value}))} type='password' placeholder='Password' />
            <button onClick={() => (handleSubmit())} className='bg-black text-white m-6 p-2 rounded'>Login</button>
        </div>
    </div>
  )
}

export default LoginPage