import {create} from 'zustand';
import { deleteTourist, getTourist, updateTourist } from '../../../backend/controllers/tourist.controller';

export const useTouristStore = create((set) => ({
    tourist:{},
    settourist: (tourist) => set({tourist}),
    getTourist: async (filter = {}, sort = {}) => {
      const queryString = new URLSearchParams({
        filter: JSON.stringify(filter),
        sort: JSON.stringify(sort),
      }).toString();
        const res = await fetch(`/api/tourist?${queryString}`, {
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
        set({tourist: body.data[0]})
        return {success: true, message: "fetched attractions"};
        },

    //     deleteTourist: async (name) => {
    //       const res = await fetch('/api/tourGuide',{
    //           method : "DELETE",
    //           headers:{
    //               "Content-Type":"application/json"
    //           },
    //           body: JSON.stringify({name})
    //       });
    //       const data = await res.json();
    //       if(!data.success) return { success : false, message: data.message};
    //       set({guide: {}})
    //       return {success: true , message: data.message};
    //   },
      updateTourist: async(oldTourist,newTourist)=>{
        const res = await fetch('/api/tourist',{
            method : "PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({userName:oldTourist, newTourist})
        });
            const data = await res.json();
            if (!data.success) return {success: false, message: data.message};
            console.log(data)
            set({tourist: body.data})
            return{success: true, message: "tourist updated successfully."};
    }
    
    }
    ));