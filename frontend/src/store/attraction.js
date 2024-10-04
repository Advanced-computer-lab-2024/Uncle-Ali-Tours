import {create} from 'zustand';


export const useAttractionStore = create((set) => ({
    attractions: [],
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
    setAttractions: (attractions) => set({attractions}),
    getAttractions: async (filter, sort) => {
        // const queryString = new URLSearchParams({
        //     filter: JSON.stringify(filter),
        //     sort: JSON.stringify(sort),
        //   }).toString();

        // const res = await fetch(`/api/attractions?${queryString}`, {
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
        set({attractions: [{filter, sort}]})
    }
    }
));