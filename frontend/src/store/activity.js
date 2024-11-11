import {create} from 'zustand';


export const useActivityStore = create((set,get) => ({
    currentActivity:{},
    setCurrentActivity:(activity) => set({currentActivity:activity}),
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
        // console.log('activiies',body)
        set({activities: body.data})
        return {success: true, message: "fetched activities"};
    },
    createActivity: async (newActivity) => {
      //  console.log(newProduct)
        try {
          const res = await fetch('http://localhost:5000/api/activity', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newActivity),
          });
          const data = await res.json();
          if (!data.success) {
            return { success: false, message: data.message };
          }
          // Refetch products after creating
       set((state)=>({activities:[...state.activities,data.data]}))
          return { success: true, message: 'activities created successfully!' };
        } catch (error) {
          return { success: false, message: error.message };
        }
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
    updateActivity: async (activityID, newActivity) => {
        const res = await fetch(`/api/activity`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id: activityID,newActivity: newActivity}),
        });
        const body = await res.json();
        if(!body.success){
            return body;
        }

        set((state) => ({activities: state.activities.map((activity) => activity._id === activityID ? body.data : activity)}));
        return {success: true, message: "updated activty"};
    },

    deleteActivity: async (id) => {
        try {
          const res = await fetch(`/api/activity`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({_id: id}),
          });
          const data = await res.json();
          if (!data.success) return { success: false, message: data.message };
          set(state => ({activities:state.activities.filter(activity => activity._id !== id)}));
          return { success: true, message: 'activity deleted successfully' };
        } catch (error) {
          return { success: false, message: error.message };
        }
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
    },


    createActivityReview: async (activityId, rating, comment, user) => {
        
        console.log("Request Payload:", { rating, comment, user });
        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return { success: false, message: 'Rating must be a number between 1 and 5.' };
        }

        if (typeof comment !== 'string' || comment.trim() === '') {
            return { success: false, message: 'Comment cannot be empty.' };
        }

        const { userName: name } = user;
        console.log('User received in function:', name);
        // Check if user is defined, else return an error
        if (!user || !name) {
            return { success: false, message: 'User information is required.' };
        }

        console.log('Before fetch call');
        const res = await fetch(`/api/activity/${activityId}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ rating, comment, name }),
        });
        console.log("Raw Response:", res);
        console.log("Response Status:", res.status, res.statusText);
        if (!res.ok) {
            const errorText = await res.text(); 
            console.error(`HTTP Error: ${res.status} ${res.statusText}. Response: ${errorText}`);
            return { success: false, message: `HTTP Error: ${res.status} ${res.statusText}` };
        }
        console.log('After fetch call');
        console.log("Raw Response:", res);
        const data = await res.json();
        console.log("Response Data:", data);
        if (data.success && data.review) {
            const activities = get().activities || { reviews: [], numReviews: 0, rating: 0 };

            const updatedActivity = {
                ...activities,
                reviews: [...activities.reviews, data.review],
                numReviews: data.numReviews,
                rating: data.rating,
            };
            console.log("Updated Activity:", updatedActivity);
            set({ activities: updatedActivity });
            return { success: true, message: data.message };
        } else {
            console.error('Error from API:', data.message);
            return { success: false, message: data.message || 'Could not add review' };
        }
    
}




}
));