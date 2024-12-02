    import {create} from 'zustand';



export const useTagStore = create((set) => ({
    tags: [],
    setTags: (tags) => set({tags}),
    addTag: async (newTag) => {
        const res = await fetch("/api/prefrenceTag", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTag),
        });
        const body = await res.json();
        if(!body.success){
            return body;
        }

        set((state) => ({tags: [...state.tags, body.data]}))
        return {success: true, message: "created preference tag"};
    },
    getTags: async () => {
        const res = await fetch("/api/prefrenceTag", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            
        });
        const body = await res.json();
        if (!body.success){
            return (body)
        }
        set({tags: body.data})
        return {success: true, message: "fetched preference tag"};
    },
    deleteTag: async (tagName) => {
        // Make DELETE request to the backend to delete the tag
        const res = await fetch(`/api/prefrenceTag`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: tagName }),
        });
        const body = await res.json();
      
        if (!body.success) {
          return body; // If the delete fails, return the error
        }
      
        // Update the store by removing the tag from the state
        set((state) => ({
          tags: state.tags.filter((tag) => tag.name !== tagName),
        }));
      
        return { success: true, message: "deleted preference tag" };
      },
      
    updateTag: async (tagName, newTag) => {
        const res = await fetch(`/api/prefrenceTag`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: tagName, newTag }),
        });
        const body = await res.json();
        if (!body.success) {
          return body;
        }
    
        set((state) => ({
          tags: state.tags.map((tag) =>
            tag.name === tagName ? { ...tag, name: newTag } : tag
          ),
        }));
        return { success: true, message: "updated preference tag" };
      },
    }));