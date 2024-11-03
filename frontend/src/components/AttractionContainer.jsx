import React from 'react'
import { useState } from 'react';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import {dialog} from '../components/Dialog.jsx'
import { formdialog } from './FormDialog.jsx';  
import { Link } from 'react-router-dom';
import { useUserStore } from '../store/user.js';
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
  const {user} = useUserStore();

  const foreignerTicket = (attraction.ticketPrices.foreigner * user.currencyRate).toFixed(2); // Convert price based on currencyRate
  const nativeTicket = (attraction.ticketPrices.native * user.currencyRate).toFixed(2); // Convert price based on currencyRate
  const studentTicket = (attraction.ticketPrices.student * user.currencyRate).toFixed(2); // Convert price based on currencyRate

 
  return (
    <div className='mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto rou h-fit rounded'>
        <div className='grid p-2'>
       { keys.map((key,index)=> (
      key==="location" ? <p key={index}>location: {attraction.location}</p> :
      key === "ticketPrices" ?<div> <h3 key={index}>ticketPrices:</h3> 
                                <p>foreigner: {foreignerTicket} {user.chosenCurrency}</p>
                                <p>native: {nativeTicket} {user.chosenCurrency}</p>
                                <p>student: {studentTicket} {user.chosenCurrency}</p>
                                
                                </div> : 
      <p key={index}>{`${key}: ${attraction[key]}`}</p>
       ))}
       </div>

        
        
        </div>
  )
}

export default AttractionContainer