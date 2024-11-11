import {create} from 'zustand';
import { deleteTourist, getTourist, updateTourist } from '../../../backend/controllers/tourist.controller';
import { useUserStore } from './user';
import toast, { Toaster } from 'react-hot-toast';
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
        delete body.data[0].password;
        set({tourist: body.data[0]})
        return {success: true, message: "fetched attractions"};
        },

    deleteTourist: async (name) => {
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
            set((state) => ({tourist: {...state.tourist,newTourist}}))
            return{success: true, message: "tourist updated successfully."};
    },
    redeemPoints: async () => {
        const { user } = useUserStore.getState(); // get user from userStore
        if (!user || !user.userName) {
            toast.error("User not found.");
            return;
        }

        try {
            const response = await fetch('/api/tourist/redeemPoints', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName: user.userName })
            });
            
            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                // Update the tourist's points and wallet balance in the local store
                set({ tourist: data.data }); // Update state with returned data
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error redeeming points:", error);
            toast.error("Failed to redeem points.");
        }
    }
    
    }
    ));