import {create} from 'zustand';


export const useTransportationActivityStore = create((set,get) => ({
    transportationActivities: [],
    setTransportationActivities: (activities) => set({activities}),
    
    getTransportationActivities: async (filter = {} , sort = {}) => {
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
        const res = await fetch(`/api/transportaionActivity?${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        if (!body.success){
            return (body)
        }
        set({transportationActivities : body.data})
        return {success: true, message: "fetched transportation activities"};
    },
    createTransportationActivity: async (newTransportationActivity) => {
      //  console.log(newProduct)
        try {
          const res = await fetch('http://localhost:5000/api/transportaionActivity', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTransportationActivity),
          });
          const data = await res.json();
          if (!data.success) {
            return { success: false, message: data.message };
          }
          // Refetch products after creating
       set((state)=>({transportationActivities:[...state.transportationActivities,data.data]}))
          return { success: true, message: 'activities created successfully!' };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
    
    updateTransportationActivity: async (transportationActivityID, newTransportationActivity) => {
        const res = await fetch(`/api/transportaionActivity`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id: transportationActivityID,newTransportationActivity: newTransportationActivity}),
        });
        const body = await res.json();
        if(!body.success){
            return body;
        }

        set((state) => ({transportationActivities: state.transportationActivities.map((transportationActivity) => transportationActivity._id === transportationActivityID ? body.data : transportationActivity)}));
        return {success: true, message: "updated activty"};
    },

    deleteTransportationActivity: async (id) => {
        try {
          const res = await fetch(`/api/transportaionActivity`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({_id: id}),
          });
          const data = await res.json();
          if (!data.success) return { success: false, message: data.message };
          set(state => ({transportationActivities:state.transportationActivities.filter(transportationActivity => transportationActivity._id !== id)}));
          return { success: true, message: 'transportation activity deleted successfully' };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },



}
));