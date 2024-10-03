import React from 'react'
import {create} from 'zustand';
import { IoClose } from "react-icons/io5";

export const dialog = create((set) => ({
    show: false,
    setShow: (show) => set({show}),
    showDialog: () => set({show: true}),
    hideDialog: () => set({show: false}),
   }));


function Dialog({msg, accept, reject}) {
    const {show, hideDialog} = dialog()
     
    const acceptClick = () => {
        accept()
        hideDialog()
    }

    const rejectClick = () => {
        reject()
        hideDialog()
    }

  return (
    show &&
    <div className='bg-gray-700 h-fit text-center p-4 w-[23vw] rounded-xl absolute right-0 left-0 top-[20vh] mx-auto'>
        <button onClick={() => (hideDialog())} className='absolute right-3 h-fit rounded-full'>
        <IoClose size={20}/>
        </button>
        <p className='my-2'>{msg}</p>
        <button onClick={acceptClick} className='bg-[#dc5809] m-2 py-2 px-6 rounded'>Accept</button>
        <button onClick={rejectClick} className='bg-[#dc5809] m-2 py-2 px-6 rounded'>Reject</button>
        </div>
  )
}

export default Dialog