import { create } from 'zustand';
import axios from 'axios';


export const useItineraryStore = create((set,get) => ({
    currentItinerary:{},
    setCurrentItinerary:(itinerary) => set({currentItinerary:itinerary}),
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

        set((state) => ({itineraries: state.itineraries.map((itinerary) => itinerary._id === itineraryID ? body.data : itinerary)}));
        return {success: true, message: "updated itinerary"};
    },

    // Add to useItineraryStore in the frontend store

    activateItinerary: async (itineraryID) => {
        try {
            const res = await fetch(`/api/itinerary/activate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: itineraryID }),
            });

            const body = await res.json();

            if (!body.success) {
                return { success: false, message: body.message };
            }

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

            if (!body.success) {
                return { success: false, message: body.message };
            }

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


    createProductReview: async (itineraryId, rating, comment, user) => {
        try {
            if (typeof rating !== 'number' || rating < 1 || rating > 5) {
                return { success: false, message: 'Rating must be a number between 1 and 5.' };
            }
    
            if (typeof comment !== 'string' || comment.trim() === '') {
                return { success: false, message: 'Comment cannot be empty.' };
            }
    
            // Check if user is defined, else return an error
            if (!user || !user.userId || !user.name) {
                return { success: false, message: 'User information is required.' };
            }
    
            const { userId, name } = user;
            console.log('User received in function:', user);
            console.log('Itinerary ID:', itineraryId);
            console.log('Rating:', rating);
            console.log('Comment:', comment);
          
            const res = await fetch(`/api/itinerary/${itineraryId}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rating, comment, user: userId, name }),
            });
    
            const data = await res.json();
    
            if (data.success && data.review) {
                const currentItinerary = get().currentItinerary || { reviews: [], numReviews: 0, rating: 0 };
    
                const updatedItinerary = {
                    ...currentItinerary,
                    reviews: [...currentItinerary.reviews, data.review],
                    numReviews: data.numReviews,
                    rating: data.rating,
                };
    
                set({ currentItinerary: updatedItinerary });
                return { success: true, message: data.message };
            } else {
                console.error('Error from API:', data.message);
                return { success: false, message: data.message || 'Could not add review' };
            }
        } catch (error) {
            console.error('Error creating review:', error.message);
            return { success: false, message: 'Could not add review' };
        }
    }
    




}
));


