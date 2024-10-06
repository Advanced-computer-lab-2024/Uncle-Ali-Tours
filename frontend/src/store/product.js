import {create} from 'zustand';
//import { createProduct, deleteProduct, updateProduct } from '../../../backend/controllers/product.controller';
//import Product from '../../../backend/models/product..model';


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
         return { success: false, message: body.message };
    }
    set({products: body.data})
    return {success: true, message: "fetched attractions"};
    },

    createProduct: async (newProduct) => {
       try {
        const res = await fetch('/api/product', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
          });
          const data = await res.json();
          if(!data.success){
            return { success: false, message: data.message };
          }
          set((state) => ({ products: [...state.products, data.data] }));
         } catch (error) {
            return{success: false, message: error.message};
        }  

        return {success: true, message:'Product created successfully!'}
        },
    
       
        
    
    deleteProduct: async (id) => {
      const res = await fetch(`/api/product'/${id}`,{
          method : "DELETE",
          headers:{
              "Content-Type":"application/json"
          },
          body: JSON.stringify({id})
      });
      const data = await res.json();
      if(!data.success) return { success : false, message: data.message};
      set(state => ({products:state.products.filter(product => product.id !== id)})); //update ui imm.
      return {success: true , message: data.message};
  },
  updateProduct: async(oldProduct,newProduct)=>{
    const res = await fetch('/api/product',{
        method : "PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({name:oldProduct, newProduct})
    });
        const data = await res.json();
        if (!data.success) return {success: false, message: data.message};
        console.log(data)
        set((state) => ({
          products: state.products.map((product) => (product.name == oldProduct.name ? data.data: product)),
        }))
        return{success: true, message: "Product updated successfully."};
}

}
));




