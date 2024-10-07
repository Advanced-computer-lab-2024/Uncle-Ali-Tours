import {create} from 'zustand';

export const useGuideStore = create((set) => ({
    guide:{},
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
            return (body)
        }
        set({guide: body.data[0]})
        return {success: true, message: "fetched attractions"};
        },

        deleteGuide: async (name) => {
          const res = await fetch('/api/tourGuide',{
              method : "DELETE",
              headers:{
                  "Content-Type":"application/json"
              },
              body: JSON.stringify({name})
          });
          const data = await res.json();
          if(!data.success) return { success : false, message: data.message};
          set({guide: {}})
          return {success: true , message: data.message};
      },
      updateGuide: async(oldGuide,newTourGuide)=>{
        const res = await fetch('/api/tourGuide',{
            method : "PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({name:oldGuide, newTourGuide})
        });
            const data = await res.json();
            if (!data.success) return {success: false, message: data.message};
            console.log(data)
            set({guide: body.data})
            return{success: true, message: "tour guide updated successfully."};
    }
    
    }
    ));