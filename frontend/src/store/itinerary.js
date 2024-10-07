import {create} from 'zustand';



export const useItineraryStore = create((set) => ({
    itineraries: [],
    setItineraries: (itineraries) => set({itineraries}),
    addItineraries: async (newItinerary) => {
        const res = await fetch("/api/itinerary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newItinerary),
        });
        const body = await res.json();
        if(!body.success){
            return body;
        }

        set((state) => ({itineraries: [...state.itineraries, body.data]}))
        return {success: true, message: "created new itinerary"};
    },
    getItineraries: async (filter = {} , sort = {}) => {
        let minPrice = 0
       let maxPrice = Number.POSITIVE_INFINITY
       if(filter.minPrice){
        minPrice = filter.minPrice
        delete filter.minPrice
       }
       if(filter.maxPrice){
        maxPrice = filter.maxPrice
        delete filter.maxPrice
       }
        const queryString = new URLSearchParams({
            filter: JSON.stringify(filter),
            sort: JSON.stringify(sort),
            minPrice:minPrice,
            maxPrice:maxPrice,
          }).toString();
        const res = await fetch(`/api/itinerary?${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        if (!body.success){
            return (body)
        }
        set({itineraries: body.data})
        return {success: true, message: "fetched Itineraries"};
    },
    deleteItinerary: async (itineraryID) => {
        const res = await fetch(`/api/itinerary`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({_id: itineraryID}),
        });
        const body = await res.json();
        if(!body.success){
            return body;
        }

        set(state => ({itineraries:state.itineraries.filter(itinerary => itinerary._id !== itineraryID)}));
        return {success: true, message: "deleted itinerary"};
    },
    updateItinerary: async (itineraryID, newItinerary) => {
        const res = await fetch(`/api/itinerary`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id: itineraryID,newItinerary: newItinerary}),
        });
        const body = await res.json();
        if(!body.success){
            return body;
        }

        set((state) => ({itineraries: state.itineraries.map((itinerary) => itineraries._id === itineraryID ? body.data : itinerary)}));
        return {success: true, message: "updated interenary"};
    },
}
));



// getItineraries: async () => {
    //     const res = await fetch("/api/itinerary", {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
            
    //     });
    //     const body = await res.json();
    //     if (!body.success){
    //         return (body)
    //     }
    //     set({Itinerarys: body.data})
    //     return {success: true, message: "fetched itineraries"};
    // },