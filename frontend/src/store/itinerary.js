import axios from 'axios';
import { create } from 'zustand';


export const useItineraryStore = create((set, get) => ({
  currentItinerary: {},
  setCurrentItinerary: (itinerary) => set({ currentItinerary: itinerary }),

  itineraries: [],
  setItineraries: (itineraries) => set({ itineraries }),

  addItineraries: async (newItinerary) => {
    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItinerary),
      });
      const body = await res.json();
      if (!body.success) return body;

      set((state) => ({ itineraries: [...state.itineraries, body.data] }));
      return { success: true, message: "Created new itinerary" };
    } catch (error) {
      console.error("Error adding itinerary:", error);
      return { success: false, message: "Error adding itinerary" };
    }
  },

  getItineraries: async (filter = {}, sort = {}) => {
    let { minPrice = 0, maxPrice = Number.POSITIVE_INFINITY } = filter;
    delete filter.minPrice;
    delete filter.maxPrice;

    const queryString = new URLSearchParams({
      filter: JSON.stringify(filter),
      sort: JSON.stringify(sort),
      minPrice,
      maxPrice,
    }).toString();

    try {
      const res = await fetch(`/api/itinerary?${queryString}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json();
      if (!body.success) return body;

      set({ itineraries: body.data });
      
      return { success: true, message: "Fetched itineraries" };
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      return { success: false, message: "Error fetching itineraries" };
    }
  },

  getItineraryById: async (itineraryID) => {
    try {
      const res = await fetch(`/api/itinerary/${itineraryID}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json();
      if (!body.success) return body;

      set({ currentItinerary: body.data });
      return { success: true, message: "Fetched itinerary" };
    } catch (error) {
      console.error("Error fetching itinerary:", error);
      return { success: false, message: "Error fetching itinerary" };
    }
  },

  deleteItinerary: async (itineraryID) => {
    try {
      const res = await fetch(`/api/itinerary`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: itineraryID }),
      });
      const body = await res.json();
      if (!body.success) return body;

      set((state) => ({ itineraries: state.itineraries.filter((itinerary) => itinerary._id !== itineraryID) }));
      return { success: true, message: "Deleted itinerary" };
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      return { success: false, message: "Error deleting itinerary" };
    }
  },

  updateItinerary: async (itineraryID, newItinerary) => {
    try {
      const res = await fetch(`/api/itinerary`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itineraryID, newItinerary }),
      });
      const body = await res.json();
      if (!body.success) return body;

      set((state) => ({
        itineraries: state.itineraries.map((itinerary) =>
          itinerary._id === itineraryID ? body.data : itinerary
        ),
      }));
      return { success: true, message: "Updated itinerary" };
    } catch (error) {
      console.error("Error updating itinerary:", error);
      return { success: false, message: "Error updating itinerary" };
    }
  },

  activateItinerary: async (itineraryID) => {
    try {
      const res = await fetch(`/api/itinerary/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itineraryID }),
      });
      const body = await res.json();
      if (!body.success) return { success: false, message: body.message };

      set((state) => ({
        itineraries: state.itineraries.map((itinerary) =>
          itinerary._id === itineraryID ? { ...itinerary, isActivated: true } : itinerary
        ),
      }));
      return { success: true, message: "Itinerary activated successfully" };
    } catch (error) {
      console.error("Error activating itinerary:", error.message);
      return { success: false, message: "Could not activate itinerary" };
    }
  },

  deactivateItinerary: async (itineraryID) => {
    try {
      const res = await fetch(`/api/itinerary/deactivate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itineraryID }),
      });
      const body = await res.json();
      if (!body.success) return { success: false, message: body.message };

      set((state) => ({
        itineraries: state.itineraries.map((itinerary) =>
          itinerary._id === itineraryID ? { ...itinerary, isActivated: false } : itinerary
        ),
      }));
      return { success: true, message: "Itinerary deactivated successfully" };
    } catch (error) {
      console.error("Error deactivating itinerary:", error.message);
      return { success: false, message: "Could not deactivate itinerary" };
    }
  },

  createItineraryReview: async (itineraryId, rating, comment, user) => {
    console.log("Request Payload:", { rating, comment, user });
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return { success: false, message: 'Rating must be a number between 1 and 5.' };
    }

    if (typeof comment !== 'string' || comment.trim() === '') {
        return { success: false, message: 'Comment cannot be empty.' };
    }

    const { userName: name } = user;
    console.log('User received in function:', name);
    // Check if user is defined, else return an error
    if (!user || !name) {
        return { success: false, message: 'User information is required.' };
    }

    console.log('Before fetch call');
    const res = await fetch(`/api/itinerary/${itineraryId}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment, name }),
    });
    console.log("Raw Response:", res);
    console.log("Response Status:", res.status, res.statusText);
    if (!res.ok) {
        const errorText = await res.text(); 
        console.error(`HTTP Error: ${res.status} ${res.statusText}. Response: ${errorText}`);
        return { success: false, message: `HTTP Error: ${res.status} ${res.statusText}` };
    }
    console.log('After fetch call');
    console.log("Raw Response:", res);
    const data = await res.json();
    console.log("Response Data:", data);
    if (data.success && data.review) {
        const currentItinerary = get().currentItinerary || { reviews: [], numReviews: 0, rating: 0 };

        const updatedItinerary = {
            ...currentItinerary,
            reviews: [...currentItinerary.reviews, data.review],
            numReviews: data.numReviews,
            rating: data.rating,
        };
        console.log("Updated Itinerary:", updatedItinerary);
        set({ currentItinerary: updatedItinerary });
        return { success: true, message: data.message };
    } else {
        console.error('Error from API:', data.message);
        return { success: false, message: data.message || 'Could not add review' };
    }
  },

  bookItinerary: async (itineraryId) => {
    try {
      const { data } = await axios.put(`/api/itinerary/${itineraryId}/book`);
      if (data.success) {
        set((state) => ({
          itineraries: state.itineraries.map((itinerary) =>
            itinerary._id === itineraryId ? { ...itinerary, isBooked: true } : itinerary
          ),
        }));
        return { success: true, message: 'Itinerary booked successfully' };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error("Error booking itinerary:", error.message);
      return { success: false, message: 'Error booking itinerary' };
    }
  },

  // Flagging an itinerary as appropriate/inappropriate
  flagItinerary: async (itineraryID, isAppropriate ,userName ,link) => {
    try {
      const res = await fetch(`/api/itinerary/flag`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itineraryID, isAppropriate ,userName,link}),
      });
      const body = await res.json();
      if (!body.success) {
        return { success: false, message: 'Failed to flag itinerary' };
      }

      // Update the itinerary state
      set((state) => ({
        itineraries: state.itineraries.map((itinerary) =>
          itinerary._id === itineraryID ? { ...itinerary, isAppropriate } : itinerary
        ),
      }));

      return { success: true, message: 'Itinerary updated successfully' };
    } catch (error) {
      console.error('Error flagging itinerary:', error);
      return { success: false, message: 'Error flagging itinerary' };
    }
  },interestedIn: async(touristId,itineraryId) =>{
    try {
      const res = await fetch(`/api/itinerary/intrestedIn`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ touristId,itineraryId}),
      });
      const body = await res.json();
      if (!body.success) return body;

      set((state) => ({
        itineraries: state.itineraries.map((itinerary) =>
          itinerary._id === itineraryId ? body.data : itinerary
        ),
      }));
      return { success: true, message: body.message };
    } catch (error) {
      // console.error("Error updating itinerary:", error);
      return { success: false, message: body.message };
    }
  },removeInterestedIn: async(touristId,itineraryId) =>{
    try {
      const res = await fetch(`/api/itinerary/notIntrestedIn`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ touristId,itineraryId}),
      });
      const body = await res.json();
      if (!body.success) return body;

      set((state) => ({
        itineraries: state.itineraries.map((itinerary) =>
          itinerary._id === itineraryId ? body.data : itinerary
        ),
      }));
      return { success: true, message: body.message };
    } catch (error) {
      // console.error("Error updating itinerary:", error);
      return { success: false, message: body.message };
    }
  }

}));
