import { create } from 'zustand';
import axios from 'axios';

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),

  // Fetch products with filters and sorting
 // product.js in your zustand store
getProducts: async (filter = {}, sort = {}) => {
  try {
      const queryString = new URLSearchParams({
          filter: JSON.stringify(filter),
          sort: JSON.stringify(sort),
      }).toString();

      const res = await axios.get(`http://localhost:3000/api/product?${queryString}`); // Updated to use axios

      const data = res.data;
      if (!data.success) {
          return { success: false, message: data.message };
      }
      set({ products: data.data });
      return { success: true, message: "Fetched products" };
  } catch (error) {
      console.error("Error in getProducts:", error);
      return { success: false, message: error.message };
  }
},

  // Create a new product and add it to state
  createProduct: async (newProduct) => {
    try {
      const res = await axios.post('http://localhost:5000/api/product', newProduct);
      if (!res.data.success) {
        return { success: false, message: res.data.message };
      }
      set((state) => ({ products: [...state.products, res.data.data] }));
      return { success: true, message: 'Product created successfully!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Delete a product and remove it from state
  deleteProduct: async (id) => {
    try {
      const res = await axios.delete(`/api/product/${id}`);
      if (!res.data.success) return { success: false, message: res.data.message };
      set((state) => ({ products: state.products.filter(product => product._id !== id) }));
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Update a product and update it in state
  updateProduct: async (id, newProduct) => {
    try {
      const res = await axios.put(`/api/product/${id}`, { newProduct });
      if (!res.data.success) return { success: false, message: res.data.message };
      set((state) => ({
        products: state.products.map((product) => product._id === id ? res.data.data : product)
      }));
      return { success: true, message: "Product updated successfully." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Archive a product and update it in state
  archiveProduct: async (id, archive) => {
    try {
      const res = await axios.put(`/api/product/archiveProduct/${id}`, { archive });
      if (!res.data.success) return { success: false, message: res.data.message };
      set((state) => ({
        products: state.products.map((product) => product._id === id ? res.data.data : product)
      }));
      return { success: true, message: "Product archived successfully." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Upload profile picture for a product
  uploadProfilePicture: async (name, profilePicture) => {
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);
    formData.append("name", name);

    try {
      const response = await axios.put(`http://localhost:3000/api/product/uploadPicture`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log("Upload response:", response.data);

      const data = response.data;
      if (data.success && data.profilePicture) {
        const profileImagePath = data.profilePicture;
        
        set((state) => ({
          products: { ...state.products, profilePicture: profileImagePath },
        }));

        return { success: true, message: "Profile picture uploaded successfully", profilePicture: profileImagePath };
      } else {
        return { success: false, message: data.message || "No profile picture path returned" };
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      return { success: false, message: "Error uploading profile picture" };
    }
  },

}));
