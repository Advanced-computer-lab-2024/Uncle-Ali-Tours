import { create } from 'zustand';

export const useHotelStore = create((set) => ({
  cityCode: null,
  hotels: [],
  offers: [],
  confirmedOffer: null,
  loading: false,
  error: null,
  BookedHotels: [],
  userBookedHotels: [],

  setcityCode: (cityCode) => set({ cityCode }),
  setHotels: (hotels) => set({ hotels }),
  setOffers: (offers) => set({ offers }),
  setConfirmedOffer: (confirmedOffer) => set({ confirmedOffer }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setBookedHotels: (BookedHotels) => set({ BookedHotels }),
  setUserBookedHotels: (userBookedHotels) => set({ userBookedHotels }),

  addBookedHotels: async (newHotel) => {
    const res = await fetch("/api/hotel-booking/addHotel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newHotel),
    });
    const body = await res.json();
    if (!body.success) {
      return body;
    }

    set((state) => ({ BookedHotels: [...state.BookedHotels, body.data] }));
    return { success: true, message: "created new hotel" };
  },

  getBookedHotels: async (creator) => {
    const queryString = new URLSearchParams({ creator: creator }).toString();
    const res = await fetch(`/api/hotel-booking/getHotels?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = await res.json();
    console.log('body:',body);
    set({ userBookedHotels: body });
    return { success: true, message: "fetched Hotels" };
  },

  // Function to search for cities by name
  searchCity: async (city) => {
    if (city) {
      set({ loading: true, error: null });
      const queryString = new URLSearchParams({ city: city }).toString();
      try {
        const response = await fetch(`/api/hotel-booking/search?${queryString}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log('data:',data[0].iataCode);
        if (response.ok) {
          set({ cityCode: data[0].iataCode, loading: false });
        } else {
          set({ error: data.message, loading: false });
        }
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    }
  },

  // Function to get hotel list by city code
  getHotelListByCity: async (cityCode) => {
    if (cityCode) {
      set({ loading: true, error: null });
      const queryString = new URLSearchParams({ cityCode }).toString();
      try {
        const response = await fetch(`/api/hotel-booking/hotels?${queryString}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          set({ hotels: data, loading: false });
        } else {
          set({ error: data.message, loading: false });
        }
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    }
  },

  // Function to get hotel offers by hotel IDs
  getHotelOffers: async (hotelIds ,checkInDate ,checkOutDate) => {
    if (hotelIds) {
      set({ loading: true, error: null });
      const queryString = new URLSearchParams({ hotelIds ,checkInDate ,checkOutDate }).toString();
      try {
        const response = await fetch(`/api/hotel-booking/offers?${queryString}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          set({ offers: data[0].offers, loading: false });
        } else {
          set({ error: data.message, loading: false });
          set({ offers: null });
        }
      } catch (error) {
        set({ error: error.message, loading: false });
        set({ offers: null });
      }
    }
  },

  // Function to confirm a hotel offer by offer ID
  confirmHotelOffer: async (offerId) => {
    if (offerId) {
      set({ loading: true, error: null });
      const queryString = new URLSearchParams({ offerId }).toString();
      try {
        const response = await fetch(`/api/hotel-booking/offer?${queryString}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          set({ confirmedOffer: data, loading: false });
        } else {
          set({ error: data.message, loading: false });
        }
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    }
  },
}));