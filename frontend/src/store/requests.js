import { create } from 'zustand';

export const useRequestStore = create((set) => ({
  requests: [],
  setRequests: (requests) => set({ requests }),

  // Fetch requests with optional filters and sorting
  getRequests: async (filter = {}, sort = {}) => {
    const queryString = new URLSearchParams({
      filter: JSON.stringify(filter),
      sort: JSON.stringify(sort),
    }).toString();

    try {
      const res = await fetch(`/api/requests?${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const body = await res.json();
      if (!body.success) {
        return { success: false, message: body.message };
      }
      set({ requests: body.data });
      return { success: true, message: 'Fetched requests' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Create a new request
  createRequest: async (newRequest) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRequest),
      });
      const data = await res.json();
      if (!data.success) {
        return { success: false, message: data.message };
      }
      set((state) => ({ requests: [...state.requests, data.data] }));
      return { success: true, message: 'Request created successfully!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Update request status
  updateRequestStatus: async (id, status) => {
    try {
      const res = await fetch(`/api/requests/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };
      set((state) => ({
        requests: state.requests.map((request) =>
          request._id === id ? { ...request, status: data.data.status } : request
        ),
      }));
      return { success: true, message: `Request status updated to ${status}` };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Fetch all delete requests
  getDeleteRequests: async () => {
    try {
      const res = await fetch('/api/requests/delete', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };
      set({ requests: data.data });
      return { success: true, message: 'Fetched delete requests' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Fetch all verify requests
  getVerifyRequests: async () => {
    try {
      const res = await fetch('/api/requests/verify', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };
      set({ requests: data.data });
      return { success: true, message: 'Fetched verify requests' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  // Fetch request status by username
  getRequestStatusByUsername: async (username) => {
    try {
      const res = await fetch(`/api/requests/${username}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      // Optionally set data to requests or handle as needed
      set({ requests: data.data });

      return { success: true, message: 'Fetched request status by username', data: data.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

}));
