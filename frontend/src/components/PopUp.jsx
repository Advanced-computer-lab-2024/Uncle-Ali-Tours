import React from 'react'
import { popupVisibility } from '../lib/popup.js'

function PopUp({ func}) {
    const {visibililty,clearVisibility}=popupVisibility()
    const handleClick = () => {
        func()
        clearVisibility()
    }
  return (
    <div className={`top-[20vh] left-0 rounded-xl bg-gray-500 right-0 m-auto absolute w-[20vw] h-[20vh] ${visibililty ? "" : " hidden"}`}>
    <button className='bg-white text-black' onClick={() => (handleClick())}>confirm</button>
    </div>
  )
}

export default PopUp