import { create } from 'zustand';
import axios from 'axios';

export const useSellerStore = create((set) => ({
    sell: {},
    setSeller: (sell) => set({ sell }),

    // Fetch a seller's data by userName
    getSeller: async ({ userName }) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/seller`, {
                params: { userName },
            });

            const body = res.data;
            if (!body.success) {
                return body;
            }

            if (body.seller) {
                delete body.seller.password;  // Remove sensitive info
                set({ sell: body.seller });
                // console.log(body.seller);
                return { success: true, message: "Fetched seller data" };
            } else {
                return { success: false, message: "No seller data found" };
            }
        } catch (error) {
            console.error("Error fetching seller data:", error);
            return { success: false, message: "Error fetching seller data" };
        }
    },

    // Create a new seller
    createSeller: async (sellerData) => {
        try {
            const res = await axios.post("http://localhost:3000/api/seller", sellerData);
            const data = res.data;
            if (data.success) {
                set({ sell: data.data });
                return { success: true, message: "Seller created successfully" };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Error creating seller:", error);
            return { success: false, message: "Error creating seller" };
        }
    },

    // Update seller's information
    updateSeller: async (oldSeller = "", newSeller = {}) => {
        try {
            const res = await axios.put(`http://localhost:3000/api/seller`, {
                userName: oldSeller,
                newSeller,
            });
            const data = res.data;
            console.log(data.seller);
            if (data.success) {
                set({ sell: data.seller });
                return { success: true, message: "Seller profile updated successfully" };
            } else {
                console.error(data.message);
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Error updating seller profile:", error);
            return { success: false, message: error.response.data.message || "Error updating seller profile" };
        }
    },

    // Delete a seller by userName
    deleteSeller: async (userName) => {
        try {
            const res = await axios.delete(`http://localhost:3000/api/seller`, {
                data: { userName },
            });
            const data = res.data;
            if (!data.success) return { success: false, message: data.message };
            set({ sell: {} });
            return { success: true, message: data.message };
        } catch (error) {
            console.error("Error deleting seller:", error);
            return { success: false, message: "Error deleting seller" };
        }
    },

// Upload profile picture for a seller
uploadProfilePicture: async (userName, profilePicture) => {
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);
    formData.append("userName", userName);

    try {
        const response = await axios.put(`http://localhost:3000/api/seller/uploadPicture`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Check and log the response from the server
        console.log("Upload response:", response.data);

        const data = response.data;
        if (data.success && data.profilePicture) {
            const profileImagePath = data.profilePicture;

            // Ensure the state updates only if profilePicture exists in the response
            set((state) => ({
                sell: { ...state.sell, profilePicture: profileImagePath },
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

uploadDocuments: async (userName, documents) => {
        const formData = new FormData();
        // Append multiple documents to the FormData
        for (let docKey in documents) {
            formData.append(docKey, documents[docKey]);
        }
        formData.append("userName", userName);

        try {
            const response = await axios.post(`http://localhost:3000/api/seller/uploadDocuments`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Check and log the response from the server
            console.log("Upload response:", response.data);

            const data = response.data;
            if (data.success) {
                const uploadedDocs = {
                    profilePicture: data.profilePicture,
                    sellerID: data.sellerID,
                    taxationRegistryCard: data.taxationRegistryCard,
                };

                // Update the seller state with the new document paths
                set((state) => ({
                    sell: { ...state.sell, ...uploadedDocs },
                }));

                return { success: true, message: "Documents uploaded successfully", uploadedDocs };
            } else {
                console.warn("No documents returned in response:", data);
                return { success: false, message: data.message || "No document paths returned" };
            }
        } catch (error) {
            console.error("Error uploading documents:", error);
            return { success: false, message: "Error uploading documents" };
        }
    },
}));
