import {create} from 'zustand';

export const useSellerStore = create((set) => ({
    sell:{},
    setSeller: (sell) => set({sell}),
    getSeller: async (filter = {}, sort = {}) => {
        const queryString = new URLSearchParams({
            filter: JSON.stringify(filter),
            sort: JSON.stringify(sort),
        }).toString();
        const res = await fetch(`/api/seller?${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        if (!body.success) {
            return body;
        }
        set({ sell: body.data[0] });
        return { success: true, message: "Fetched seller data" };
    },
    deleteSeller: async (name) => {
        const res = await fetch('/api/seller',{
            method : "DELETE",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({name})
        });
        const data = await res.json();
        if(!data.success) return { success : false, message: data.message};
        set({sell: {}})
        return {success: true , message: data.message};
    },
     updateSeller : async (oldSeller,newSeller) => {
        try {
            const response = await fetch('/api/seller' , {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: oldSeller, newSeller }),
            });
            const data = await response.json();
            if (data.success) {
                console.log("Seller profile updated successfully");
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error("Error updating seller profile:", error);
        }
    }

    }
    ));