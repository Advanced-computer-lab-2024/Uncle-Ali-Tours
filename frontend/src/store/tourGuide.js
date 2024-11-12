import { create } from 'zustand';
import axios from 'axios';

export const useGuideStore = create((set) => ({
    guide: {},
    setGuide: (guide) => set({ guide }),

    // Fetch a tour guide's data by userName
    getGuide: async ({ userName }) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/tourGuide`, {
                params: { userName },
            });
            const body = res.data;

            if (!body.success) {
                return body;
            }

            if (body.guide) {
                delete body.guide.password;  // Remove sensitive info
                set({ guide: body.guide });
                console.log(body.guide);
                return { success: true, message: "Fetched guide data" };
            } else {
                return { success: false, message: "No guide data found" };
            }
        } catch (error) {
            console.error("Error fetching guide data:", error);
            return { success: false, message: "Error fetching guide data" };
        }
    },

    // Create a new tour guide
    createGuide: async (guideData) => {
        try {
            const res = await axios.post("http://localhost:3000/api/tourGuide", guideData);
            const data = res.data;
            if (data.success) {
                set({ guide: data.data });
                return { success: true, message: "Guide created successfully" };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Error creating guide:", error);
            return { success: false, message: "Error creating guide" };
        }
    },

    // Update guide's information
    updateGuide: async (oldGuide, newGuide) => {
        try {
            const res = await axios.put(`http://localhost:3000/api/tourGuide`, {
                userName: oldGuide,
                newGuide,
            });
            const data = res.data;
            if (data.success) {
                set({ guide: data.data });
                return { success: true, message: "Guide profile updated successfully" };
            } else {
                console.error(data.message);
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Error updating guide profile:", error);
            return { success: false, message: "Error updating guide profile" };
        }
    },

    // Delete a guide by userName
    deleteGuide: async (userName) => {
        try {
            const res = await axios.delete(`http://localhost:3000/api/tourGuide`, {
                data: { userName },
            });
            const data = res.data;
            if (!data.success) return { success: false, message: data.message };
            set({ guide: {} });
            return { success: true, message: data.message };
        } catch (error) {
            console.error("Error deleting guide:", error);
            return { success: false, message: "Error deleting guide" };
        }
    },

    // Upload profile picture for a tour guide
    uploadProfilePicture: async (userName, profilePicture) => {
        const formData = new FormData();
        formData.append("profilePicture", profilePicture);
        formData.append("userName", userName);

        try {
            const response = await axios.put(`http://localhost:3000/api/tourGuide/uploadPicture`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const data = response.data;

            if (data.success && data.profilePicture) {
                const profileImagePath = data.profilePicture;
                set((state) => ({
                    guide: { ...state.guide, profilePicture: profileImagePath },
                }));
                localStorage.setItem("guideProfilePicture", profileImagePath);
                return { success: true, message: "Profile picture uploaded successfully", profilePicture: profileImagePath };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            return { success: false, message: "Error uploading profile picture" };
        }
    }
}));
