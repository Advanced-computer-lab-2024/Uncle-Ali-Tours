import React from 'react'
import {create} from 'zustand';
import { postProductStore } from '../store/product';

const ProductPage =()=>{
    const toast = useToast;
    const {ADD}=postProductStore;
    const handleAddProduct=async ()=>{
        const {success,message}= await ADD(newProduct);
        if(!success){
            toast({
                title:"Error",
                description: message,
                isClosable: true
        });
        }

    };

  //  const {success, message} = postProductStore();

    return
(
    <div>ProductPage</div>
)
}
export default ProductPage;