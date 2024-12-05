import React, { useState , useEffect } from 'react'
import { useOrderStore } from '../store/order'
import ProductContainerForSeller from '../components/ProductContainerForSeller'
function ViewMyOrders() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const {getCurrentOrders,getPastOrders,updateOrderStatus}=useOrderStore();
    const [currentOrders,setCurrentOrders]=useState([]);
    const [pastOrders,setPastOrders]=useState([]);
	const [currentButton, setCurrentButton] = useState(false);
    useEffect(()=>{
        const func = async () => {
        setCurrentOrders(await getCurrentOrders(user.userName))
        setPastOrders(await getPastOrders(user.userName))
        }
        func()
    },[])
    console.log(currentOrders.data)
  return (
    <div>
        <div className="bg-gradient-to-b shadow-xl relative  from-[#FA7070] min-h-[60vh] w-[70vw] mx-auto rounded-lg">
				<div className="absolute top-8 shadow-md bg-[#FEFDED]/90 rounded-full left-1/2 translate-x-[-50%]">
					<button
						className={`${currentButton ? "hover:scale-[0.985] " : "shadow-md scale-[0.9]"} focus:outline-none text-2xl m-2 shadow-lg hover:shadow-md transition-all bg-[#FEFDED] py-2 px-4 rounded-full text-pink-800 `}
						onClick={() => setCurrentButton(false)}
					>
						Current
					</button>
					<button
						className={`${!currentButton ? "hover:scale-[0.985] " : "shadow-md scale-[0.9]"} focus:outline-none text-2xl m-2 shadow-lg hover:shadow-md transition-all bg-[#FEFDED] py-2 px-4 rounded-full text-pink-800 `}
						onClick={() => setCurrentButton(true)}
					>
						Past
					</button>
				</div>
                <div className="grid w-full grid-cols-2 mt-28">
					{currentOrders?.data?.map(
						(order, index) =>(
							 (order.products).map(
                                (product,index) =>
                                    <div className="grid w-full grid-cols-2 mt-28">
                                    <ProductContainerForSeller key={index} product={product} />
                                    </div>
                            )
                        )
					)}
				</div>
                </div>
    </div>
  )
}

export default ViewMyOrders