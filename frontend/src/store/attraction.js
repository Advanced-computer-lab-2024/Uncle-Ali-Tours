import {create} from 'zustand';


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
    },}
));