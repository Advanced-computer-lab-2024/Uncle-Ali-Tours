import { create } from 'zustand';
import axios from 'axios';

export const useGuideStore = create((set,get) => ({
    guide: {},
    setGuide: (guide) => set({ guide }),
    allGuides: [],
    // Fetch a tour guide's data by userName
    getGuide: async ({ userName }) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/tourGuide`, {
                params: { userName },
            });
            const body = res.data;
            console.log(body)
            if (!body.success) {
                return body;
            }


            if (!!body) {
                delete body.password;  // Remove sensitive info
                set({ guide: body.data[0] });
                return { success: true, message: "Fetched guide data" };
            } else {
                set({ guide: {} });
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
    },
    checkBookings: async (userName) => {
        const res = await fetch(`/api/tourGuide/checkBookings/${userName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
    
        if (!data.success) {
          return { success: false, message: data.message || "Failed to check bookings" };
        }
    
        return { success: true, message: data.message };
    },


    createTourGuideReview: async (tourguideName, rating, comment, user) => {
        
        console.log("Request Payload:", { rating, comment, user });
        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return { success: false, message: 'Rating must be a number between 1 and 5.' };
        }

        if (typeof comment !== 'string' || comment.trim() === '') {
            return { success: false, message: 'Comment cannot be empty.' };
        }

        const { userName: name } = user;
        console.log('User received in function:', name);
        // Check if user is defined, else return an error
        if (!user || !name) {
            return { success: false, message: 'User information is required.' };
        }

        console.log('Before fetch call');
        const res = await fetch(`/api/tourGuide/${tourguideName}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ rating, comment, name }),
        });
        console.log("Raw Response:", res);
        console.log("Response Status:", res.status, res.statusText);
        if (!res.ok) {
            const errorText = await res.text(); 
            console.error(`HTTP Error: ${res.status} ${res.statusText}. Response: ${errorText}`);
            return { success: false, message: `HTTP Error: ${res.status} ${res.statusText}` };
        }
        console.log('After fetch call');
        console.log("Raw Response:", res);
        const data = await res.json();
        console.log("Response Data:", data);
        if (data.success && data.review) {
            const guide = get().guide || { reviews: [], numReviews: 0, rating: 0 };

            const updatedTourGuide = {
                ...guide,
                reviews: [...guide.reviews, data.review],
                numReviews: data.numReviews,
                rating: data.rating,
            };
            console.log("Updated Tour Guide:", updatedTourGuide);
            set({ guide: updatedTourGuide });
            return { success: true, message: data.message };
        } else {
            console.error('Error from API:', data.message);
            return { success: false, message: data.message || 'Could not add review' };
        }
    
},

fetchAllGuides: async () => {
    try {
        const response = await fetch('/api/tourGuide/all'); // Adjust the URL if needed
        if (!response.ok) {
            throw new Error('Failed to fetch tour guides');
        }
        const guides = await response.json(); // Parse the response
        set({ allGuides: guides }); // Update the store with fetched guides
    } catch (error) {
        console.error('Error fetching tour guides:', error);
        set({ allGuides: [] }); // Reset to empty if there's an error
    }
},

}));
