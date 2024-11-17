import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/user';
function Navbar() {
  const navigate = useNavigate();
  const { logout } = useUserStore();
  const user = localStorage.getItem("user");
  const handleLogout = () => {
    localStorage.removeItem("profilePicture");
    localStorage.removeItem("userToken");
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
            {  !!user ?
            <button onClick={() => handleLogout()} className='bg-red-500 w-[9ch] m-2 py-1 px-4 rounded-full'>Logout</button>
            :
            <button onClick={() => navigate("/login")} className='bg-green-500 w-[9ch] m-2 py-1 px-4 rounded-full'>Login</button>
            }
            </div>
        </nav>
    </div>
  )
}

export default Navbar