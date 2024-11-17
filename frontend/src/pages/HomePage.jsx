import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate, Navigate } from 'react-router-dom'
import { useUserStore } from '../store/user'
import { useEffect } from 'react'
function HomePage() {

  const navigate = useNavigate()

    localStorage.removeItem('email')
    const user = JSON.parse(localStorage.getItem("user"));
    if (!!user) {
      console.log(user)
      switch (user.type) {
        case "tour guide":
          return <Navigate to="/TourGuideProfilePage"/>;
        case "advertiser":
          return <Navigate to="/advertiserProfile"/>;
        case "seller":
          return <Navigate to="/sellerProfile"/>;
        case "tourist":
          return <Navigate to="/touristProfile"/>;
        case "admin":
          return <Navigate to="/admin"/>;

        case "governor":
          return <Navigate to="/attraction"/>;
      
        default:
          break;
      }
    }
    else{


  return (
    <div>
        <p className='text-9xl mt-20'>U A T</p>
        <div className=' text-black'>
          <Link to='/login'>
        <button className='bg-[#dc5809] m-2 py-2 px-6 rounded'> Login</button>
        </Link>
        <Link to='/register'>
        <button className='bg-[#dc5809] m-2 py-2 px-6 rounded'> Signup</button>
        </Link>
        </div>
    </div>
  )
}
}

export default HomePage