import React from 'react'
import { Link } from 'react-router-dom'
function Navbar() {
  return (
    <div>
        <nav className='flex rounded-lg justify-between items-center border mx-[1.5vh] mt-[1.5vh] h-16 bg-[rgba(255,255,255,0.18)] text-lg relative shadow-sm font-mono' role='navigation'>
            <Link to='/' className='pl-8'>Logo</Link>
            <div className='px-4 cursor-pointer md:hidden'>
            <svg className='w-6 h-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16m-7 6h7' />
            </svg>
            </div>
            <div className='pr-8 md:block hidden'>
            <Link to='/' className='p-4'>Home</Link>
            <Link to='/' className='p-4'>About</Link>
            <Link to='/' className='p-4'>Contact</Link>
            </div>
        </nav>
    </div>
  )
}

export default Navbar