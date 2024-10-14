import { create } from "zustand";

export const useComplaintStore = create((set) => ({
    createComplaint: async (complaint) => {
        const res = await fetch("/api/complaint", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(complaint),
        });
        const body = await res.json();
        if (!body.success) {
            return body;
        }
        return { success: true, message: "Complaint created successfully" };
    },
}));