import {create} from 'zustand';


export const useActivityStore = create((set) => ({
    activities: [],
    categories: [], 
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
    setCategories: (categories) => set({categories}),
    getCategories: async () =>{
        try {
         const res = await fetch("/api/activityCategory", {
             method: "GET",
             headers: {
                 "Content-Type": "application/json",
             },
         });
         const body = await res.json();
         if (!body.success){
             return (body)
         }
         const catObjects = body.data;
         let catNames = []
         catObjects.map((object) => (
            catNames = [...catNames,(object.name)]
         ));
         set({categories: catNames})
        }
        catch (error){
            console.log(error)
        }
    },
    
    setActivities: (activities) => set({activities}),
    
    getActivities: async (filter = {} , sort = {}) => {
        const queryString = new URLSearchParams({
            filter: JSON.stringify(filter),
            sort: JSON.stringify(sort),
          }).toString();
        const res = await fetch(`/api/activity?${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        if (!body.success){
            return (body)
        }
        set({activities: body.data})
        return {success: true, message: "fetched activities"};
    }
    }
));