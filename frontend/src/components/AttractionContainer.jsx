import React from 'react'
import { useState } from 'react';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import {dialog} from '../components/Dialog.jsx'
import { formdialog } from './FormDialog.jsx';  
import { Link } from 'react-router-dom';
function AttractionContainer({attraction}) {
  const keys = Object.keys(attraction)
  keys.map((key)=> (
    `${key}: ${attraction[key]}`
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
      key==="location" ? <p key={index}>location: {attraction.location.coordinates[0]+" , "+attraction.location.coordinates[1]}</p> :
      key === "ticketPrices" ?<div> <h3 key={index}>ticketPrices:</h3> 
                                <p>foreigner: ${attraction.ticketPrices.foreigner}</p>
                                <p>native: ${attraction.ticketPrices.native}</p>
                                <p>student: ${attraction.ticketPrices.student}</p>
                                
                                </div> : 
      <p key={index}>{`${key}: ${attraction[key]}`}</p>
       ))}
       </div>

        
        
        </div>
  )
}

export default AttractionContainer