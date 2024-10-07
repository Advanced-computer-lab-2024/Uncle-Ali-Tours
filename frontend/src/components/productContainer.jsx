import React from 'react'
import { useState } from 'react';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import {dialog} from '../components/Dialog.jsx'
import { formdialog } from './FormDialog.jsx';  
import { Link } from 'react-router-dom';
function ProductContainer({product, productChanger}) {
  const keys = Object.keys(product)
  keys.map((key)=> (
    `${key}: ${product[key]}`
  ))
  const { showDialog } = dialog()
  const { showFormDialog } = formdialog()
  const handleClick = () => {
    showDialog()
    tagChanger(tagName)
  }
  return (
    <div className='mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto rou h-fit rounded'>
        <div className='grid p-2'>
       { keys.map((key,index)=> (
       <p key={index}>{`${key}: ${product[key]}`}</p>
       ))}
       </div>
       </div>
  )
}

export default ProductContainer