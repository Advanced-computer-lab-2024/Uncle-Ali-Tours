import React from 'react'

function LoginPage() {
  return (
    <div className='bg-white mt-32 w-[30vw] mx-auto pt-2 rounded-xl'>
        <div className='flex flex-col items-center'>
            <input className='border border-[rgb(205,205,205)] m-6 p-2 shadow-md rounded bg-gray-300' type='text' placeholder='Username' />
            <input className='border border-[rgb(205,205,205)] m-6 p-2 shadow-md rounded bg-gray-300' type='password' placeholder='Password' />
            <button className='bg-black text-white m-6 p-2 rounded'>Login</button>
        </div>
    </div>
  )
}

export default LoginPage