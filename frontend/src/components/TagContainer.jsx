import React from 'react'
import { useState } from 'react';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import PopUp from './PopUp';
import { popupVisibility } from '../lib/popup.js'
function TagContainer({tagName}) {
  const {setVisibility} = popupVisibility()
  
  const handleDelete = () => (
    setVisibility()
  )
  const del = () => {
    console.log(tagName)
}
  
const popup = <PopUp func={del}/>
  return (
    <div className='flex justify-between mb-6 text-black text-left w-[20vw] bg-white mx-auto rou h-[5vh] rounded'>
        <p className='ml-2'>{tagName}</p>
        <div className='flex'>
        <button className='mr-4' ><MdOutlineDriveFileRenameOutline size='18' color='black' /></button>
        <button className='mr-2' onClick={()=>{handleDelete()}}><MdDelete size='18' color='black' /></button>
        </div>
        
        </div>
  )
}

export default TagContainer