import {create} from 'zustand';

export const useAdvertiserstore = create((set) => ({
    advertiser:{},
    setAdvertiser: (advertiser) => set({advertiser}),
    getAdvertiser: async (filter = {}, sort = {}) => {
      console.log(filter)
      const queryString = new URLSearchParams({
        filter: JSON.stringify(filter),
        sort: JSON.stringify(sort),
      }).toString();
        const res = await fetch(`/api/advertiser?${queryString}`, {
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
        set({advertiser: body.data[0]})
        console.log(body.data[0])
        return {success: true, message: "fetched attractions"};
        },

        deleteAdvertiser: async (name) => {
          const res = await fetch('/api/advertiser',{
              method : "DELETE",
              headers:{
                  "Content-Type":"application/json"
              },
              body: JSON.stringify({name})
          });
          const data = await res.json();
          if(!data.success) return { success : false, message: data.message};
          set({advertiser: {}})
          return {success: true , message: data.message};
      },
      updateAdvertiser : async (oldAdvertiser,newAdvertiser) => {
        try {
            const response = await fetch('/api/advertiser' , {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName: oldAdvertiser, newAdvertiser }),
            });
            const data = await response.json();
            if (data.success) {
                return {success: true, message: "Successful"}
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error("Error updating advertiser profile:", error);
        }
    }
    
    }
    ));