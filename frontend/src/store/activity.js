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
            catNames += (object.name)
         ));
         set({categories: catNames})
    },
    
    setActivities: (activites) => set({activites}),
    getActivities: async (filter , sort) => {
        // const res = await fetch("/api/attractions", {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({"filter": filter, "sort": {}}),
        // });
        // const body = await res.json();
        // if (!body.success){
        //     return (body)
        // }
        // set({attractions: body.data})
        // return {success: true, message: "fetched attractions"};
        set({activites: [{filter , sort}]})
    }
    }
));