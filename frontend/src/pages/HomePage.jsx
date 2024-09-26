import React from 'react'
import { Link } from 'react-router-dom'
function HomePage() {
  return (
    <div>
        <p className='text-9xl mt-20'>U A T</p>
        <div className=' text-white'>
          <Link to='/login'>
        <button className='bg-black m-2 py-2 px-6 rounded'> Login</button>
        </Link>
        <Link to='/register'>
        <button className='bg-black m-2 py-2 px-6 rounded'> Signup</button>
        </Link>
        </div>
    </div>
  )
}

export default HomePage