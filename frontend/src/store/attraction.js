import {create} from 'zustand';


export const useAttractionStore = create((set) => ({
    attractions: [],
    setAttractions: (attractions) => set({attractions}),
    getAttractions: async (filter) => {
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
        set({attractions: [{filter}]})
    }
    }
));