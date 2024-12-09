import toast from 'react-hot-toast';
import { create } from 'zustand';
import { useUserStore } from './user';
export const useTouristStore = create((set) => ({
    tourist:{},
    wishlistedProducts: [],
    cartProducts:[],
    checkoutList: [],
    errorMessage: "",
    isUpcoming : false,
    isPast : false,

    setIsUpcoming: (isUpcoming) => set({ isUpcoming }),
    setIsPast: (isPast) => set({ isPast }),
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
        if (!body.data[0]){
            set({tourist: {}})
            return
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
       addProductWishlist: async (name, _id) => {
        const res = await fetch('/api/tourist/addProductWishlist', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userName: name, _id })
        });
    
        const data = await res.json();
        console.log("data", data);
    
        if (!data.success) {
            return { success: false, message: data.message };
        }
    
        // Use the updated ProductsWishlist from the response
        set((state) => ({
            tourist: {
                ...state.tourist,
                ProductsWishlist: data.data // Update with the actual updated wishlist from the server
            }
        }));
    
        return { success: true, message: "Added successfully." };
    },
    removeProductWishlist: async(name,_id)=>{
        const res = await fetch('/api/tourist/removeProductWishlist',{
            method : "PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({userName:name, _id})
        });
            const data = await res.json();
            console.log("data remove", data);
            if (!data.success) return {success: false, message: data.message};
          
            set((state) => ({tourist: {...state.tourist,ProductsWishlist:state.tourist.ProductsWishlist?.filter(item => item !==_id)}}))
            return{success: true, message: "Removed successfully."};
    },

      
    getWishlistedProducts: async (userName) => {
        try {
          const response = await fetch(`/api/tourist/getWishlistedProducts/${userName}`);
          console.log("Response", response);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch wishlisted products");
          }
    
          const data = await response.json();
          set({ wishlistedProducts: data.data, errorMessage: "" }); // Update store state with products
        } catch (error) {
          console.error("Error fetching wishlisted products:", error);
          set({ errorMessage: error.message || "Unable to fetch wishlisted products" });
        }
      },
      addProductToCart: async (name, _id, quantity) => {
        const res = await fetch('/api/tourist/addProductToCart', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userName: name, _id, quantity }) // Include quantity in the payload
        });
    
        const data = await res.json();
        console.log("data", data);
    
        if (!data.success) {
            return { success: false, message: data.message };
        }
    
        // Safeguard against undefined ProductsCart
        set((state) => ({
            tourist: {
                ...state.tourist,
                ProductsCart: [
                    ...(state.tourist.ProductsCart || []), // Fallback to an empty array if undefined
                    { productId: _id, quantity: quantity }
                ]
            }
        }));
    
        return { success: true, message: "Added successfully." };
    },
    
    removeProductCart: async (name, productId) => {
        const res = await fetch('/api/tourist/removeProductCart', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userName: name, productId }) // Pass productId, not _id
        });
    
        const data = await res.json();
        console.log("API Response:", data);
    
        if (!data.success) return { success: false, message: data.message };
    
        // Safe check for ProductsCart
        set((state) => ({
            tourist: {
                ...state.tourist,
                ProductsCart: Array.isArray(state.tourist.ProductsCart) // Check if it's an array
                    ? state.tourist.ProductsCart.filter(item => item.productId !== productId)
                    : [] // If not an array, reset to an empty array
            }
        }));
    
        return { success: true, message: "Removed successfully." };
    },

    removeAllProductsCart: async (userName) => {
        const res = await fetch('/api/tourist/removeAllProductsCart', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userName }) // Pass userName
        });

        const data = await res.json();
        console.log("API Response:", data);

        if (!data.success) return { success: false, message: data.message };

        // Safe check for ProductsCart
        set((state) => ({
            tourist: {
                ...state.tourist,
                ProductsCart: [] // Reset to an empty array
            }
        }));

        return { success: true, message: "Removed all products successfully." };
    },
   
    
    getCartProducts: async (userName) => {
        try {
          const response = await fetch(`/api/tourist/getCartProducts/${userName}`);
          console.log("Response", response);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch cart products");
          }
    
          const data = await response.json();
          set({ cartProducts: data.data, errorMessage: "" }); // Update store state with products
          console.log("Cart Products", data.data);
        } catch (error) {
          console.error("Error fetching Cart products:", error);
          set({ errorMessage: error.message || "Unable to fetch Cart products" });
        }
      },
      checkoutProducts: () => {
        set((state) => ({
            checkoutList: [...state.cartProducts], // Move all cart products to checkout
            // cartProducts: [], // Clear the cart
        }));
    },

    // Remove a product from the checkout list
    removeFromCheckout: (_id) => {
        set((state) => ({
            checkoutList: state.checkoutList.filter((product) => product._id !== _id),
        }));
    },


      fetchUpcomingItems: async (userName , type) => {
        try {
            const response = await fetch(`/api/tourist/upcomingItems?userName=${encodeURIComponent(userName)}&type=${encodeURIComponent(type)}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
    
            const data = await response.json();
            console.log("Data", data);
    
            if (data.success) {
                return data.data; // Return the fetched items
            } else {
                toast.error(data.message);
                return []; // Return an empty array if there's an error
            }
        } catch (error) {
            console.error("Error fetching upcoming itineraries:", error.message);
            toast.error("Failed to fetch upcoming itineraries.");
            return []; // Return an empty array on error
        }
    },
    handleUnBook : async (userName, id, quantity) => {
        try {
            const response = await fetch('/api/tourist/handleUnBook', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, id, quantity }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.error("Error unbooking:", error.message);
            toast.error("Failed to unbook.");
            return false;
        }
    },
    
    fetchPastItineraries: async (userName) => {
        try {
            const response = await fetch(`/api/tourist/pastItineraries?userName=${userName}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
    
            const data = await response.json();
    
            if (data.success) {
                return data.data; // Return the fetched itineraries
            } else {
                toast.error(data.message);
                return []; // Return an empty array if there's an error
            }
        } catch (error) {
            console.error("Error fetching past itineraries:", error);
            toast.error("Failed to fetch past itineraries.");
            return []; // Return an empty array on error
        }
    },
    fetchUpcomingActivities: async (userName) => {
        try {
            const response = await fetch(`/api/tourist/upcomingActivities?userName=${userName}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
    
            const data = await response.json();
    
            if (data.success) {
                return data.data; // Return the fetched itineraries
            } else {
                toast.error(data.message);
                return []; // Return an empty array if there's an error
            }
        } catch (error) {
            console.error("Error fetching upcoming activities:", error);
            toast.error("Failed to fetch upcoming activities.");
            return []; // Return an empty array on error
        }
    },
    fetchPastActivities: async (userName) => {
        try {
            const response = await fetch(`/api/tourist/pastActivities?userName=${userName}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
    
            const data = await response.json();
    
            if (data.success) {
                return data.data; // Return the fetched itineraries
            } else {
                toast.error(data.message);
                return []; // Return an empty array if there's an error
            }
        } catch (error) {
            console.error("Error fetching past activities:", error);
            toast.error("Failed to fetch past activities.");
            return []; // Return an empty array on error
        }
    }

    }));