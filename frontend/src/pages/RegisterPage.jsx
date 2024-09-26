import React from 'react'

function RegisterPage() {
    const types = ["tour guide", "advertiser", "seller"]
    const touristData = ["Username", "Email", "Password", "Mobile Number", "Nationality","Date of Birth","Occupation",]
    let typeSelector = types.map((type) => (
        <button className='bg-black text-white m-6 p-2 rounded'>{type}</button>
    ));
    let touristDataInput = touristData.map((data) => (
        <input className='border border-[rgb(205,205,205)] m-6 p-2 shadow-md rounded bg-gray-300' type='text' placeholder={data} />
    ));
  return (
    <div className='flex'>
    <div className='bg-white mt-32 h-fit mx-auto pt-2 rounded-xl'>
        <div className='flex flex-col items-center'>
            <input className='border border-[rgb(205,205,205)] m-6 p-2 shadow-md rounded bg-gray-300' type='text' placeholder='Username' />
            <input className='border border-[rgb(205,205,205)] m-6 p-2 shadow-md rounded bg-gray-300' type='text' placeholder='Email' />
            <input className='border border-[rgb(205,205,205)] m-6 p-2 shadow-md rounded bg-gray-300' type='password' placeholder='Password' />
            <p className='text-black'>registering as</p>
            <div className='text-sm flex'>
            {typeSelector}
            </div>
        </div>
    </div>
    <div className='bg-white mt-32 h-fit  mx-auto pt-2 rounded-xl'>
        <div className='flex flex-col items-center'>
            {touristDataInput}
            <div className='text-sm flex'>
            <button className='bg-black text-white m-6 p-2 rounded'>tourist</button>
            </div>
        </div>
    </div>
    </div>
  )
}

export default RegisterPage