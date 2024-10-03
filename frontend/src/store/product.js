import {create} from 'zustand';


export const useProductStore = create((set) => ({
products: [],
setProducts: (products) => set({products}),
getProducts: async (filter, sort) => {
    // const res = await fetch("/api/attractions", {
    //     method: "GET",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({"filter": filter, "sort": {}}),
    // });
    // const body = await res.json();
    // if (!body.success){
    //     return (body)
    // }
    // set({attractions: body.data})
    // return {success: true, message: "fetched attractions"};
    set({products: [{filter , sort}]})}}
));


import { create } from 'zustand';

export const postProductStore = create((set) => ({
  product: [],
  
  setProducts: (product) => set({ product}),

  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.imageURL || !newProduct.price || !newProduct.description || !newProduct.seller ) {
      return { success: false, message: "Please fill in all fields." };
    }

    const res = await fetch('/api/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    });

    const data = await res.json();
    set((state) => ({ products: [...state.products, data.data] }));

    return { success: true, message: 'Product created successfully!' };
  }
}));
