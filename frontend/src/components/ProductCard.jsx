import React, { useEffect } from 'react'
import { useState } from 'react';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import {dialog} from '../components/Dialog.jsx'
import { formdialog } from './FormDialog.jsx';  
import { Link } from 'react-router-dom';
function ProductCard({product, productChanger, accept, reject}) {
  const keys = Object.keys(product)
  keys.map((key)=> (
    `${key}: ${product[key]}`
  ))
  const { showDialog } = dialog()
  const { showFormDialog } = formdialog()

  const handleClick = () => {
    showDialog()
    productChanger(product)
  }

  

  const handleUpdateClick = () => {
    showFormDialog()
    productChanger(product)
  }

  return (
    <div className='mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto rou h-fit rounded'>
        <div className='grid p-2'>
       { keys.map((key,index)=> (
       <p key={index}>{`${key}: ${product[key]}`}</p>
       ))}
       </div>
       <button onClick={() => (handleUpdateClick())} className='mr-4 transform transition-transform duration-300 hover:scale-125' ><MdOutlineDriveFileRenameOutline size='18' color='black' /></button>
        <button onClick={() => (handleClick())} className='mr-2 transform transition-transform duration-300 hover:scale-125 '><MdDelete size='18' color='black' /></button>
        
       </div>
  )
}

export default ProductCard