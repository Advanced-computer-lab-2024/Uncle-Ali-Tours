import {create} from 'zustand';



export const useTagStore = create((set) => ({
    tags: [],
    setTags: (tags) => set({tags}),
    addTag: async (newTag) => {
        const res = await fetch("/api/preferenceTags", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTag),
        });
        const body = await res.json();
        if(!body.success){
            return body;
        }

        set({tags: [...tags, body.data]})
    },
    getTags: async (get) => {
        // const res = await fetch("/api/preferenceTags", {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     
        // });
        // const body = await res.json();
        // if (!body.success){
        //     return (body)
        // }
        // set({tags: body.data})
        // return {success: true, message: "fetched preference tag"};
        set({tags: [{get}]})
    }
    }
));