import { create } from 'zustand';

export const useActivityStore = create((set, get) => ({
  currentActivity: {},
  activities: [],
  categories: [],
  tags: [],
  userIsAdmin: false, // To store whether the user is an admin

  // Setters
  setCurrentActivity: (activity) => set({ currentActivity: activity }),
  setUserIsAdmin: (isAdmin) => set({ userIsAdmin: isAdmin }),
  setTags: (tags) => set({ tags }),
  setCategories: (categories) => set({ categories }),
  setActivities: (activities) => set({ activities }),

  // Fetch tags
  getTags: async () => {
    try {
      const res = await fetch("/api/preferencetags", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json();
      if (body.success) {
        set({ tags: body.data });
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  },

  // Fetch categories
  getCategories: async () => {
    try {
      const res = await fetch("/api/activityCategory", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json();
      if (body.success) {
        set({ categories: body.data.map((cat) => cat.name) });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  },

  // Fetch activities, show only appropriate ones unless admin
  getActivities: async (filter = {}, sort = {}) => {
    const userIsAdmin = get().userIsAdmin; // Retrieve admin status
    if (!userIsAdmin) {
      filter.isAppropriate = true; // Apply filter if not an admin
    }
  
    const queryString = new URLSearchParams({
      filter: JSON.stringify(filter),
      sort: JSON.stringify(sort),
    }).toString();
  
    try {
      const res = await fetch(`/api/activity?${queryString}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json();
      if (body.success) {
        set({ activities: body.data });
        return { success: true };
      } else {
        return { success: false, message: body.message };
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      return { success: false, message: "Error fetching activities" };
    }
  },
  
  // Create a new activity
  createActivity: async (newActivity) => {
    try {
      const res = await fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newActivity),
      });
      const data = await res.json();
      if (data.success) {
        set((state) => ({ activities: [...state.activities, data.data] }));
        return { success: true, message: 'Activity created successfully!' };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error creating activity:", error);
      return { success: false, message: error.message };
    }
  },

  // Flag activity as inappropriate (Admin only)
  updateActivityAppropriateness: async (activityID, isAppropriate) => {
    try {
      const res = await fetch(`/api/activity/flag/${activityID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAppropriate }),
      });
      const data = await res.json();
      if (data.success) {
        // Update local state to reflect the change in appropriateness
        set((state) => ({
          activities: state.activities.map((activity) =>
            activity._id === activityID ? { ...activity, isAppropriate } : activity
          ),
        }));
        return { success: true, message: 'Activity appropriateness updated successfully.' };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error updating activity appropriateness:", error);
      return { success: false, message: error.message };
    }
  },

  // Update activity
  updateActivity: async (activityID, newActivity) => {
    try {
      const res = await fetch(`/api/activity`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: activityID, newActivity }),
      });
      const body = await res.json();
      if (body.success) {
        set((state) => ({
          activities: state.activities.map((activity) =>
            activity._id === activityID ? body.data : activity
          ),
        }));
        return { success: true, message: "Activity updated successfully" };
      } else {
        return { success: false, message: body.message };
      }
    } catch (error) {
      console.error("Error updating activity:", error);
      return { success: false, message: error.message };
    }
  },

  // Delete activity
  deleteActivity: async (id) => {
    try {
      const res = await fetch(`/api/activity`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      const data = await res.json();
      if (data.success) {
        set((state) => ({
          activities: state.activities.filter((activity) => activity._id !== id),
        }));
        return { success: true, message: 'Activity deleted successfully' };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
      return { success: false, message: error.message };
    }
  },
}));
