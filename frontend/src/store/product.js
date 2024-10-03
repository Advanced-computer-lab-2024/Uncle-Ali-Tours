import {create} from 'zustand';
import { createProduct } from '../../../backend/controllers/product.controller';


export const useProductStore = create((set) => ({
products: [],
setProducts: (products) => set({products}),
getProducts: async (filter, sort) => {
    const res = await fetch(`/api/product?search=${filter, sort}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        // body: JSON.stringify({"filter": filter, "sort": sort}),
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



