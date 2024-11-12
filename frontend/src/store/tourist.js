import {create} from 'zustand';
import { badgeLevel, deleteTourist, getTourist, updateTourist } from '../../../backend/controllers/tourist.controller';
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
    },
    badgeLevel: async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.userName) {
            toast.error("User not found.");
            return;
        }
            const queryString = new URLSearchParams({
              userName : user.userName
            }).toString();
        // console.log(user)
        try {
            const response = await fetch(`/api/tourist/badge?${queryString}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify({ userName: user.userName })
            });
            const data = await response.json();
            if (data.success) {
                set((state) => ({
                    tourist: { ...state.tourist, badge: data.data },
                }));
                return { success: true, badge: data.data };
                
            } else {
                toast.error(data.message);
                return { success: false };
            }
        } catch (error) {
            console.error("Error fetching badge level:", error);
            toast.error("Failed to fetch badge level.");
            return { success: false };
        }
    },updateBookings: async(name,_id)=>{
        // console.log(_id)
        const res = await fetch('/api/tourist/updateMyBookings',{
            method : "PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({userName:name, _id})
        });
            const data = await res.json();
            if (!data.success) return {success: false, message: data.message};
            console.log(data)
            set((state) => ({tourist: {...state.tourist,myBookings:[...state.tourist.myBookings, _id]}}))
            return{success: true, message: "booked successfully."};
    },updateRealActivityBookings: async(name,_id)=>{
        // console.log(_id)
        const res = await fetch('/api/tourist/updateRealBookings',{
            method : "PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({userName:name, _id})
        });
            const data = await res.json();
            if (!data.success) return {success: false, message: data.message};
            console.log(data)
            set((state) => ({tourist: {...state.tourist,ActivityBookings:[...state.tourist.ActivityBookings, _id]}}))
            return{success: true, message: "booked successfully."};
    },updateItineraryBookings: async(name,_id)=>{
        // console.log(_id)
        const res = await fetch('/api/tourist/updateItineraryBookings',{
            method : "PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({userName:name, _id})
        });
            const data = await res.json();
            if (!data.success) return {success: false, message: data.message};
            console.log(data)
            set((state) => ({tourist: {...state.tourist,itineraryBookings:[...state.tourist.itineraryBookings, _id]}}))
            return{success: true, message: "booked successfully."};
    },unBook: async(name,_id)=>{
        // console.log(_id)
        const res = await fetch('/api/tourist/unBook',{
            method : "PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({userName:name, _id})
        });
            const data = await res.json();
            if (!data.success) return {success: false, message: data.message};
            // console.log(data)
            set((state) => ({tourist: {...state.tourist,myBookings:state.tourist.myBookings?.filter(item => item !==_id)}}))
            return{success: true, message: "unbooked successfully."};
    },unRealActivityBook: async(name,_id)=>{
        // console.log(_id)
        const res = await fetch('/api/tourist/unRealActivityBook',{
            method : "PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({userName:name, _id})
        });
            const data = await res.json();
            if (!data.success) return {success: false, message: data.message};
            // console.log(data)
            set((state) => ({tourist: {...state.tourist,ActivityBookings:state.tourist.ActivityBookings?.filter(item => item !==_id)}}))
            return{success: true, message: "unbooked successfully."};
    },unItiniraryBook: async(name,_id)=>{
        // console.log(_id)
        const res = await fetch('/api/tourist/unItiniraryBook',{
            method : "PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({userName:name, _id})
        });
            const data = await res.json();
            if (!data.success) return {success: false, message: data.message};
            // console.log(data)
            set((state) => ({tourist: {...state.tourist,itineraryBookings:state.tourist.itineraryBookings?.filter(item => item !==_id)}}))
            return{success: true, message: "unbooked successfully."};
    },
    updateMyPoints: async (userName,amountPaid) => {
        // const { user } = useUserStore.getState(); // Get user from userStore
        if (!userName) {
          toast.error("User not found.");
          return;
        }
      
        try {
          const response = await fetch('/api/tourist/updatePoints', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: userName, amountPaid }),
          });
      
          const data = await response.json();
      
          if (data.success) {
            toast.success(data.message);
            // Update the tourist's points in the local store
            set((state) => ({
              tourist: { ...state.tourist, myPoints: state.tourist.myPoints + data.points }, // Adjust the points based on server response
            }));
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          console.error("Error updating points:", error);
          toast.error("Failed to update points.");
        }
      },
      

    }));