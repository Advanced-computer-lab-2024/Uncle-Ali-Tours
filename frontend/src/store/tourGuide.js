import {create} from 'zustand';

export const useGuideStore = create((set,get) => ({
    guide:{},
    allGuides: [],
    setGuide: (guide) => set({guide}),
    getGuide: async (filter = {}, sort = {}) => {
      const queryString = new URLSearchParams({
        filter: JSON.stringify(filter),
        sort: JSON.stringify(sort),
      }).toString();
        const res = await fetch(`/api/tourGuide?${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            query: JSON.stringify({})
        });
        const body = await res.json();
        if (!body.success){
            return ({body})
        }
        delete body.data[0].password;
        set({guide: body.data[0]})
        return {success: true, message: "fetched attractions"};
        },
        fetchAllGuides: async () => {
            const res = await fetch(`/api/tourGuide`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (!data.success) {
                console.error('Failed to fetch tour guides:', data.message);
                return { success: false, message: data.message };
            }
            set({ allGuides: data.data }); 
            return { success: true, message: "Fetched all tour guides." };
        },
        deleteGuide: async (name) => {
          const res = await fetch('/api/tourGuide',{
              method : "DELETE",
              headers:{
                  "Content-Type":"application/json"
              },
              body: JSON.stringify({userName:name})
          });
          const data = await res.json();
          if(!data.success) return { success : false, message: data.message};
          set({guide: {}})
          return {success: true , message: data.message};
      },
      updateGuide: async(oldGuide,newTourGuide = {})=>{
        const res = await fetch('/api/tourGuide',{
            method : "PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({userName:oldGuide, newTourGuide})
        });
            const data = await res.json();
            if (!data.success) return {success: false, message: data.message};
            console.log(data)
            set((state) => ({guide: {...state.guide,newTourGuide}}))
            return{success: true, message: "tour guide updated successfully."};
    },
    checkBookings: async (userName) => {
        const res = await fetch(`/api/tourGuide/checkBookings/${userName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
    
        if (!data.success) {
          return { success: false, message: data.message || "Failed to check bookings" };
        }
    
        return { success: true, message: data.message };
    },


    createTourGuideReview: async (tourguideName, rating, comment, user) => {
        
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
        const res = await fetch(`/api/tourGuide/${tourguideName}/reviews`, {
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
            const guide = get().guide || { reviews: [], numReviews: 0, rating: 0 };

            const updatedTourGuide = {
                ...guide,
                reviews: [...guide.reviews, data.review],
                numReviews: data.numReviews,
                rating: data.rating,
            };
            console.log("Updated Tour Guide:", updatedTourGuide);
            set({ guide: updatedTourGuide });
            return { success: true, message: data.message };
        } else {
            console.error('Error from API:', data.message);
            return { success: false, message: data.message || 'Could not add review' };
        }
    
}






    
    }
    ));