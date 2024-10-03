import React from 'react'
import { Link } from 'react-router-dom'
import Dialog, {dialog} from '../components/Dialog.jsx'
import { useProductStore } from '../store/product.js'
function HomePage() {
  const {products, createProduct, getProducts} = useProductStore();
  const { showDialog } = dialog()

  const accept = () => {
    console.log('accepted')
  }

  const reject = () => {
    console.log('rejected')
  }

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
        <button onClick={() => (showDialog())} className='bg-[#dc5809] m-2 py-2 px-6 rounded'>dialog</button>
        <button onClick={() => (getProducts())}>get</button>
        <button onClick={() => (console.log(products))}>show</button>
        <Dialog msg={"sure ?"} accept={accept} reject={reject}/>
    </div>
  )
}

export default HomePage