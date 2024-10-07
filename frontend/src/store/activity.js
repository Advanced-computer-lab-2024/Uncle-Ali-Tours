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
    },
    
    createActivityCategory: async (newCategory) => {
     try {
        const res = await fetch("/api/activityCategory",{
            method :"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(newCategory)
    })
    const data = await res.json();
    if (!data.success) {
        return data;
    }
    set((state) => ({categories:[...state.categories , data.data.name]}))
} catch (error) {
    return{success: false, message: error.message};
}  
return{success: true, message: "ActivityCategory created successfully."};


    },
    deleteActivityCategory: async (name) => {
      
        const res = await fetch('/api/activityCategory',{
            method : "DELETE",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({name:name})
        });
        const data = await res.json();
        if(!data.success) return { success : false, message: data.message};
        set(state => ({categories:state.categories.filter(category => category !== name)}));
        return {success: true , message: data.message};
    },
    updateActivityCategory: async(oldCategory,newCategory)=>{
        const res = await fetch('/api/activityCategory',{
            method : "PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({name:oldCategory, newCategory})
        });
            const data = await res.json();
            if (!data.success) return {success: false, message: data.message};
            console.log(data)
            set((state) => ({
                categories: state.categories.map((category) => (category == oldCategory ? data.data.name : category)),
            }))
            return{success: true, message: "ActivityCategory updated successfully."};
    }
}
));