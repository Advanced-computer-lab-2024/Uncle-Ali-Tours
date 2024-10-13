import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/user'
import { useEffect } from 'react'
function HomePage() {

  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      switch (user.type) {
        case "tour guide":
          navigate("/TourGuideProfilePage");
          break;
        case "advertiser":
          navigate("/advertiserProfile");
          break;
        case "seller":
          navigate("/sellerProfile");
          break;
        case "tourist":
          navigate("/touristProfile");
          break;
        case "admin":
          navigate("/admin");
          break;
      
        default:
          break;
      }
    }
  },[]);

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

export default HomePage