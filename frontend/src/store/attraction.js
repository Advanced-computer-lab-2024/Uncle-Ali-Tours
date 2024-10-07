import {create} from 'zustand';
import { deleteAttraction, updateAttraction } from '../../../backend/controllers/attraction.controller';


export const useAttractionStore = create((set) => ({
    attractions: [],
    tags: [],
    setTags: (tags) => set({tags}),
    
    setAttractions: (attractions) => set({attractions}),
    getAttractions: async (filter = {} , sort = {}) => {
        const queryString = new URLSearchParams({
            filter: JSON.stringify(filter),
            sort: JSON.stringify(sort),
          }).toString();
        const res = await fetch(`/api/attraction?${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        if (!body.success){
            return (body)
        }
        set({attractions: body.data})
        return {success: true, message: "fetched attractions"};
    },
    createAttraction: async (newAttraction) => {
        const res = await fetch("/api/attraction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newAttraction),
        });
        const body = await res.json();
        if(!body.success){
            return body;
        }

        set((state) => ({attractions: [...state.attractions, body.data]}))
        return {success: true, message: "created new attraction"};
    },

    deleteAttraction: async (name) => {
        const res = await fetch("/api/attraction", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }), // Pass the name in the body
        });
        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };
        
        set((state) => ({
            attractions: state.attractions.filter(attraction => attraction.name !== name), // Filter out by name
        }));

        return { success: true, message: "Attraction deleted successfully." };
    },

    updateAttraction: async (oldAttractionName, updatedAttractionData) => {
        const res = await fetch("/api/attraction", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: oldAttractionName, ...updatedAttractionData }), // Send the name and updated data
        });
        
        const data = await res.json();
        if (!data.success) {
            return { success: false, message: data.message };
        }
    
        set((state) => ({
            attractions: state.attractions.map((attraction) =>
                attraction.name === oldAttractionName ? data.data : attraction // Replace the updated attraction
            ),
        }));
        
        return { success: true, message: "Attraction updated successfully." };
    }
    }
));