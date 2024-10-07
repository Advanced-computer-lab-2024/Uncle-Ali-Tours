import React, { useState } from 'react'
import {create} from 'zustand';
import { IoClose } from "react-icons/io5";

export const formdialog = create((set) => ({
    show: false,
    setShow: (show) => set({show}),
    showFormDialog: () => set({show: true}),
    hideFormDialog: () => set({show: false}),
   }));


function FormDialog({msg, accept, reject, acceptButtonText= "accept", rejectButtonText="reject" , inputs=[]}) {
    const {show, hideFormDialog} = formdialog()
    const [data, setData] = useState()
     
    const acceptClick = () => {
        accept(data)
        hideFormDialog()
        setData({})
    }

    const rejectClick = () => {
        reject()
        hideFormDialog()
    }

  return (
    show &&
    <div className='bg-gray-700 h-fit text-center text-black p-4 w-[23vw] rounded-xl absolute right-0 left-0 top-[20vh] mx-auto'>
        <button onClick={() => (hideFormDialog())} className='absolute right-3 h-fit rounded-full'>
        <IoClose size={20}/>
        </button>
        <p className='my-2'>{msg}</p>
        {
            inputs.map((input,index)=>(
                <input name={input} key={index} placeholder={input} onChange={(e) => setData({ ...data, [input]: e.target.value})} className='mb-2 w-[14vw]'/> 
            ))
        }
        <button onClick={acceptClick} className='bg-[#dc5809] m-2 py-2 px-6 rounded'>{acceptButtonText}</button>
        <button onClick={rejectClick} className='bg-[#dc5809] m-2 py-2 px-6 rounded'>{rejectButtonText}</button>
        </div>
  )
}

export default FormDialog