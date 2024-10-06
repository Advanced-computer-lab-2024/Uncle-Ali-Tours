import {create} from 'zustand';


export const useIteneraryStore = create((set) => ({
    iteneraries: [],
    tags: [],
    setTags: (tags) => set({tags}),
    getTags: async () =>{
         const res = await fetch("/api/preferencetags", {
             method: "GET",
             headers: {
                 "Content-Type": "application/json",
             },
         });
         const body = await res.json();
         if (!body.success){
             return (body)
         }
         const tagObjects = body.data;
         let tagNames = []
         tagObjects.map((object) => (
            tagNames += (object.name)
         ));
         set({tags: body.data})
    },
    setIteneraries: (iteneraries) => set({iteneraries}),
    getIteneraries: async (filter = {} , sort = {}) => {
        const queryString = new URLSearchParams({
            filter: JSON.stringify(filter),
            sort: JSON.stringify(sort),
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
        set({iteneraries: body.data})
        return {success: true, message: "fetched iteneraries"};
    }
    }
    
));