import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/user';
import { useSellerStore } from '../store/seller';
import Currency from './Currency';
import Settings from './Settings';
function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { sell } = useSellerStore();
  


  return (
    <div>
        <nav className='flex rounded-lg justify-between items-center mx-[1.5vh] mt-[1.5vh] h-16 bg-[#161821f0] text-lg relative shadow-sm font-mono' role='navigation'>
            <Link to='/' className='pl-8'>Logo</Link>
            <div className='w-[30vw] flex content-center justify-end mr-8'>
              {!!user && (user?.type === 'tourist' ? <Link to='/touristProfile' className='p-4'>Profile</Link> : <Link to='/' className='p-4'>Dashboard</Link>)}
            {user?.type === 'seller' && sell?.verified && <Link to='/product' className='p-4'>Products</Link>}
            <Settings/>
            </div>
        </nav>
    </div>
  )
}

export default Navbar