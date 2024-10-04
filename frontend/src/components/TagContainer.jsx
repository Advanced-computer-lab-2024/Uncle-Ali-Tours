import React from 'react'
import { useState } from 'react';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";

import {dialog} from '../components/Dialog.jsx'
import { formdialog } from './FormDialog.jsx';
function TagContainer({tagName, tagChanger}) {
  
  const { showDialog } = dialog()
  const { showFormDialog } = formdialog()

  const handleClick = () => {
    showDialog()
    tagChanger(tagName)
  }
  const handleUpdateClick = () => {
    showFormDialog()
    tagChanger(tagName)
  }

 
  return (
    <div className='flex justify-between mb-6 text-black text-left w-[20vw] bg-white mx-auto rou h-[5vh] rounded'>
        <p className='ml-2'>{tagName}</p>
        <div className='flex'>
        <button onClick={() => (handleUpdateClick())} className='mr-4 transform transition-transform duration-300 hover:scale-125' ><MdOutlineDriveFileRenameOutline size='18' color='black' /></button>
        <button onClick={() => (handleClick())} className='mr-2 transform transition-transform duration-300 hover:scale-125 '><MdDelete size='18' color='black' /></button>
        
        </div>
        </div>
  )
}

export default TagContainer