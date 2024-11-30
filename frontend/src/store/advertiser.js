import { create } from 'zustand';
import axios from 'axios';

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
        });
        const body = await res.json();
        if (!body.success) {
            return body;
        }
        delete body.data[0].password;
        set({ advertiser: body.data[0] });
        console.log(body.data[0])
        console.log("Updated advertiser in state:", body.data[0]); // Confirm profilePicture is included

        return { success: true, message: "Fetched advertiser data" };
    },

    // Fetch an advertiser's data by userName
    getAdvertiser: async ({ userName }) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/advertiser/${userName}`);
            const body = res.data;
            if (!body.success) {
                return body;
            }

            if (body.advertiser) {
                delete body.advertiser.password;  // Remove sensitive info
                set({ advertiser: body.advertiser });
                // console.log(body.advertiser);
                return { success: true, message: "Fetched advertiser data" };
            } else {
                return { success: false, message: "No advertiser data found" };
            }
        } catch (error) {
            console.error("Error fetching advertiser data:", error);
            return { success: false, message: "Error fetching advertiser data" };
        }
    },

    // Create a new advertiser
    createAdvertiser: async (advertiserData) => {
        try {
            const res = await axios.post("http://localhost:3000/api/advertiser", advertiserData);
            const data = res.data;
            if (data.success) {
                set({ advertiser: data.data });
                return { success: true, message: "Advertiser created successfully" };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Error creating advertiser:", error);
            return { success: false, message: "Error creating advertiser" };
        }
    },

    // Update advertiser's information
    updateAdvertiser: async (oldAdvertiser, newAdvertiser) => {
        try {
            const res = await axios.put(`http://localhost:3000/api/advertiser`, {
                userName: oldAdvertiser,
                newAdvertiser,
            });
            const data = res.data;
            if (data.success) {
                set({ advertiser: data.data });
                return { success: true, message: "Advertiser profile updated successfully" };
            } else {
                console.error(data.message);
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Error updating advertiser profile:", error);
            return { success: false, message: "Error updating advertiser profile" };
        }
    },

    // Delete an advertiser by userName
    deleteAdvertiser: async (userName) => {
        try {
            const res = await axios.delete(`http://localhost:3000/api/advertiser`, {
                data: { userName },
            });
            const data = res.data;
            if (!data.success) return { success: false, message: data.message };
            set({ advertiser: {} });
            return { success: true, message: data.message };
        } catch (error) {
            console.error("Error deleting advertiser:", error);
            return { success: false, message: "Error deleting advertiser" };
        }
    },

    // Upload profile picture for an advertiser
    uploadProfilePicture: async (userName, profilePicture) => {
        const formData = new FormData();
        formData.append("profilePicture", profilePicture);
        formData.append("userName", userName);

        try {
            const response = await axios.put(`http://localhost:3000/api/advertiser/uploadPicture`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Check and log the response from the server
            console.log("Upload response:", response.data);

            const data = response.data;
            if (data.success && data.profilePicture) {
                const profileImagePath = data.profilePicture;

                // Ensure the state updates only if profilePicture exists in the response
                set((state) => ({
                    advertiser: { ...state.advertiser, profilePicture: profileImagePath },
                }));

                return { success: true, message: "Profile picture uploaded successfully", profilePicture: profileImagePath };
            } else {
                console.warn("No profilePicture returned in response:", data);
                return { success: false, message: data.message || "No profile picture path returned" };
            }
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            return { success: false, message: "Error uploading profile picture" };
        }
    },

}));
