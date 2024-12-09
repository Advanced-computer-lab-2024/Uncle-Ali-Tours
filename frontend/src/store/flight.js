import { create } from 'zustand';

export const useFlightStore = create((set,get) => ({
    originSkyId: null,
    originEntityId: null,
    destinationSkyId: null,
    destinationEntityId: null,
    flights: [],
    BookedFlights: [],
    userBookedFlights: [],
    confirmedOffer: null,
    loading: false,
    error: null,
    
    setUserBookedFlights: (userBookedFlights) => set({ userBookedFlights }),
    setFlights: (flights) => set({ flights }),
    setConfirmedOffer: (confirmedOffer) => set({ confirmedOffer }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setOriginSkyId: (originSkyId) => set({ originSkyId }),
    setOriginEntityId: (originEntityId) => set({ originEntityId }),
    setDestinationSkyId: (destinationSkyId) => set({ destinationSkyId }),
    setDestinationEntityId: (destinationEntityId) => set({ destinationEntityId }),
    setBookedFlights: (BookedFlights) => set({ BookedFlights }),

    addBookedFlights: async (newFlight) => {
        const res = await fetch("/api/flight-booking/addFlight", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newFlight),
        });
        const body = await res.json();
        if(!body.success){
            return body;
        }

        set((state) => ({BookedFlights: [...state.BookedFlights, body.data]}))
        return {success: true, message: "created new flight"};
    },

    getBookedFlights: async (creator) => {
        const queryString = new URLSearchParams({ creator: creator }).toString();
        const res = await fetch(`/api/flight-booking/getFlights?${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log('res:',res);
        const body = await res.json();
        console.log('body:',body);
        set({ userBookedFlights: body });
        return {success: true, message: "fetched Flights"};
    },

    deleteBookedFlight: async (id) => {
        const res = await fetch(`/api/flight-booking/deleteFlight/?id=${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        if(!body.success){
            return body;
        }
        set((state) => ({userBookedFlights: state.userBookedFlights.filter((flight) => flight._id !== id)}))
        return {success: true, message: "deleted flight"};
    },

    getOrigin: async (city) => {
        if (city) {
        set({ loading: true, error: null });
        const queryString = new URLSearchParams({ query: city }).toString();
        try {
            const response = await fetch(`https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport?${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'x-rapidapi-key': '3b74a53021mshe704bd4720ea88dp1e4e0djsne3f8f5c6ac27',
		        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
            },
            });
            const data = await response.json();
            console.log('data:',data);
            if (response.ok) {
            set({ originSkyId : data.data[0].skyId, loading: false });
            set({ originEntityId : data.data[0].entityId, loading: false });
            console.log('originSkyId:',originSkyId);
            console.log('originEntityId:',originEntityId);
            } else {
            set({ error: data.message, loading: false });
            }
        } catch (error) {
            set({ error: error.message, loading: false });
        }
        }
    },
    getDestination: async (city) => {
        if (city) {
        set({ loading: true, error: null });
        const queryString = new URLSearchParams({ query: city }).toString();
        try {
            const response = await fetch(`https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport?${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'x-rapidapi-key': '3b74a53021mshe704bd4720ea88dp1e4e0djsne3f8f5c6ac27',
		        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
            },
            });
            const data = await response.json();
            console.log('data:',data);
            if (response.ok) {
            set({ destinationSkyId : data.data[0].skyId, loading: false });
            set({ destinationEntityId : data.data[0].entityId, loading: false });
            console.log('destinationSkyId:',destinationSkyId);
            console.log('destinationEntityId:',destinationEntityId);
        } else {
            set({ error: data.message, loading: false });
            }
        } catch (error) {
            set({ error: error.message, loading: false });
        }
        }
    },
    
    // Function to get flight list by origin and destination
    getFlightList: async (originSkyId ,originEntityId ,destinationSkyId ,destinationEntityId ,date ,cabinClass ,adults ,childrens) => {
        if (originSkyId && originEntityId && destinationSkyId && destinationEntityId && date && cabinClass && adults && childrens) {
        set({ loading: true, error: null });
        const queryString = new URLSearchParams({originSkyId ,destinationSkyId ,originEntityId  ,destinationEntityId ,date ,cabinClass ,adults ,childrens}).toString();
        try {
            const response = await fetch(`https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights?${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'x-rapidapi-key': '3b74a53021mshe704bd4720ea88dp1e4e0djsne3f8f5c6ac27',
		        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
            },
            });
            const data = await response.json();
            console.log('data:',data);
            if (response.ok) {
            set({ flights: data.data.itineraries, loading: false });
            } else {
            set({ error: data.message, loading: false });
            console.log('error:',error);
            }
        } catch (error) {
            set({ error: error.message, loading: false });
            console.log('error:',error);
        }
        }
    },
    
   
}));