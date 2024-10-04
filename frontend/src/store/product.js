import {create} from 'zustand';
import { createProduct } from '../../../backend/controllers/product.controller';


export const useProductStore = create((set) => ({
products: [],
setProducts: (products) => set({products}),
getProducts: async (filter = {}, sort = {}) => {
  const queryString = new URLSearchParams({
    filter: JSON.stringify(filter),
    sort: JSON.stringify(sort),
  }).toString();
    const res = await fetch(`/api/product?${queryString}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        query: JSON.stringify({})
    });
    const body = await res.json();
    if (!body.success){
        return (body)
    }
    set({products: body.data})
    return {success: true, message: "fetched attractions"};
    },
    createProduct: async (newProduct) => {
        const res = await fetch('/api/product', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
          });
          const data = await res.json();
          if(!data.success){
            return data
          }
        set({ products: [...products, data.data] });
        return {success: true, message:'Product created successfully!'}
    }
}
));



