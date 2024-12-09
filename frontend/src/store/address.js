import { create } from 'zustand';
import { setAddressDefault } from '../../../backend/controllers/address.controller';

export const useAddressStore = create((set) => ({
  addresses: [],
  currentAddress:{},
  setOrders: (addresses) => set({ addresses }),

  // Create a new order
  createAddress: async (newAddress) => {
    try {
      const res = await fetch('/api/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAddress),
      });
      const data = await res.json();
      if (!data.success) {
        return { success: false, message: data.message };
      }
      set((state) => ({ addresses: [...state.addresses, data.data] }));
      return { success: true, message: 'Address created successfully!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Update order status
  setAddressDefault: async (id) => {
    try {
      const res = await fetch(`/api/address/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };
      set((state) => ({
        addresses: state.addresses.map((address) =>
            address._id === id ? { ...address, isDefault: true } : address
        ),
      }));
      return { success: true, message: `Address set default` };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Fetch order status by username
  getAddressByUsername: async (username) => {
    try {
      const res = await fetch(`/api/address/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      // Optionally set data to orders or handle as needed
      set({ addresses: data.data });

      return { success: true, message: 'Fetched addresses by username', data: data.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  
}));
