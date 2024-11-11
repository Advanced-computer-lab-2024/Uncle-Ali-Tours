import { create } from 'zustand';

export const useComplaintStore = create((set) => ({
  complaints: [],
  setComplaints: (complaints) => set({ complaints }),

  // Fetch complaints with optional filters and sorting
  getComplaints: async (filter = {}, sort = {}) => {
    const queryString = new URLSearchParams({
      filter: JSON.stringify(filter),
      sort: JSON.stringify(sort),
    }).toString();

    try {
      const res = await fetch(`/api/complaint?${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const body = await res.json();
      if (!body.success) {
        return { success: false, message: body.message };
      }
      set({ complaints: body.data });
      return { success: true, message: 'Fetched complaints' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Create a new complaint
  createComplaint: async (newComplaint) => {
    try {
      const res = await fetch('/api/complaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComplaint),
      });
      const data = await res.json();
      if (!data.success) {
        return { success: false, message: data.message };
      }
      set((state) => ({ complaints: [...state.complaints, data.data] }));
      return { success: true, message: 'Complaint created successfully!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Delete complaint
  deleteComplaint: async (id) => {
    try {
      const res = await fetch(`/api/complaint/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };
      set((state) => ({
        complaints: state.complaints.filter((complaint) => complaint._id !== id),
      }));
      return { success: true, message: 'Complaint deleted successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Update complaint status (pending or resolved)
  updateComplaintStatus: async (id, status) => {
    try {
      const res = await fetch(`/api/complaint/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };
      set((state) => ({
        complaints: state.complaints.map((complaint) =>
          complaint._id === id ? { ...complaint, status: data.data.status } : complaint
        ),
      }));
      return { success: true, message: `Complaint marked as ${status}` };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Fetch a specific complaint by ID (for viewing details)
  getComplaintDetails: async (id) => {
    try {
      const res = await fetch(`/api/complaint/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!data.success) {
        return { success: false, message: data.message };
      }
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  updateComplaintReply: async (id, reply) => {
    try {
      const res = await fetch(`/api/complaint/${id}/reply`, {  // Updated endpoint
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reply }),
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        complaints: state.complaints.map((complaint) =>
          complaint._id === id ? { ...complaint, reply: data.data.reply } : complaint
        ),
      }));
      return { success: true, message: 'Reply updated successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },


}));
