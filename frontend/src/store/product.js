import { create } from 'zustand';
import { archiveProduct } from '../../../backend/controllers/product.controller';
export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),

  // Fetch products with filters and sorting
  getProducts: async (filter = {}, sort = {}) => {
    console.log(filter)
    const queryString = new URLSearchParams({
      filter: JSON.stringify(filter),
      sort: JSON.stringify(sort),
    }).toString();
    
    try {
      const res = await fetch(`/api/product?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const body = await res.json();
      if (!body.success) {
        return { success: false, message: body.message };
      }
      set({ products: body.data });
      return { success: true, message: "Fetched products" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Create a new product and refetch products
  createProduct: async (newProduct) => {
    console.log(newProduct)
    try {
      const res = await fetch('http://localhost:5000/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (!data.success) {
        return { success: false, message: data.message };
      }
      // Refetch products after creating
   set((state)=>({products:[...state.products,data.data]}))
      return { success: true, message: 'Product created successfully!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Delete product and refetch products
  deleteProduct: async (id) => {
    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };
      set(state => ({products:state.products.filter(product => product._id !== id)}));
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Update product and refetch products
  updateProduct: async (id, newProduct) => {
    console.log(id, newProduct)
    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({newProduct: newProduct})
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };
      set((state) => ({products: state.products.map((product) => product._id === id ? data.data : product)}));
      return { success: true, message: "Product updated successfully." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  archiveProduct: async (id, archive) => {
    try {
      const res = await fetch(`/api/product/archiveProduct/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({archive: archive})
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };
      set((state) => ({products: state.products.map((product) => product._id === id ? data.data : product)}));
      return { success: true, message: "Product archived successfully." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}));
