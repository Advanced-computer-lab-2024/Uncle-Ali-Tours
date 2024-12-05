import { create } from 'zustand';

export const useOrderStore = create((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),

  // Fetch orders with optional filters and sorting
  getOrders: async (filter = {}, sort = {}) => {
    const queryString = new URLSearchParams({
      filter: JSON.stringify(filter),
      sort: JSON.stringify(sort),
    }).toString();

    try {
      const res = await fetch(`/api/orders?${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const body = await res.json();
      if (!body.success) {
        return { success: false, message: body.message };
      }
      set({ orders: body.data });
      return { success: true, message: 'Fetched orders' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Create a new order
  createOrder: async (newOrder) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder),
      });
      const data = await res.json();
      if (!data.success) {
        return { success: false, message: data.message };
      }
      set((state) => ({ orders: [...state.orders, data.data] }));
      return { success: true, message: 'Order created successfully!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === id ? { ...order, status: data.data.status } : order
        ),
      }));
      return { success: true, message: `Order status updated to ${status}` };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Fetch order status by username
  getOrdersByUsername: async (username) => {
    try {
      const res = await fetch(`/api/orders/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      // Optionally set data to orders or handle as needed
      set({ orders: data.data });

      return { success: true, message: 'Fetched orders by username', data: data.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  getCurrentOrders: async (username) => {
    try {
      const res = await fetch(`/api/orders/${username}/current`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      // Optionally set data to orders or handle as needed
      set({ orders: data.data });

      return { success: true, message: 'Fetched orders by username', data: data.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  getPastOrders: async (username) => {
    try {
      const res = await fetch(`/api/orders/${username}/past`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      // Optionally set data to orders or handle as needed
      set({ orders: data.data });

      return { success: true, message: 'Fetched orders by username', data: data.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

}));
