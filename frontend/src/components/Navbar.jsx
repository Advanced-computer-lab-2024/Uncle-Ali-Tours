import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/user';
function Navbar() {
  const navigate = useNavigate();
  const { logout } = useUserStore();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
        <nav className='flex rounded-lg justify-between items-center mx-[1.5vh] mt-[1.5vh] h-16 bg-[#161821f0] text-lg relative shadow-sm font-mono' role='navigation'>
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
            <Link to='/changeCurrency' className='p-4'>Currency</Link>
            <button onClick={() => handleLogout()} className='bg-[#dc5809] m-2 py-1 px-4 rounded-full'>Logout</button>
            </div>
        </nav>
    </div>
  )
}

export default Navbar