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
    getIteneraries: async (filter , sort) => {
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
        set({iteneraries: [{filter , sort}]})
    }
    }
));