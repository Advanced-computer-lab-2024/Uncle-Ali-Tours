import React, { useState, useEffect } from 'react';
import { useTagStore } from '../store/tag.js';
import Dialog, { dialog } from '../components/Dialog.jsx';
import TagContainer from '../components/TagContainer.jsx';
import toast, { Toaster } from 'react-hot-toast';

function PreferenceTag() {
  const [curTag, setCurTag] = useState(""); // Holds the current tag to delete
  const [newTag, setNewTag] = useState(""); // Holds the new tag name
  const { tags, addTag, getTags, deleteTag, updateTag } = useTagStore();

  // Dialog functions
  const { showDialog } = dialog(); // For showing the delete confirmation dialog

  // Fetch tags on component mount
  useEffect(() => {
    getTags();
  }, [getTags]);

  // Handle tag update
  const handleUpdateTag = async (tagName, newTagName) => {
    const { success, message } = await updateTag(tagName, newTagName);
    success
      ? toast.success(message, { className: 'text-white bg-gray-800' })
      : toast.error(message, { className: 'text-white bg-gray-800' });
  };

  // Handle tag deletion
  const handleDeleteTag = async (tagName) => {
    const { success, message } = await deleteTag(tagName);
    if (success) {
      toast.success(message, { className: 'text-white bg-gray-800' });
    } else {
      toast.error(message, { className: 'text-white bg-gray-800' });
    }
    return { success, message };
  };

  // Handle adding a tag
  const handleAddTag = () => {
    // Input validation for empty tag name
    if (!newTag.trim()) {
      toast.error('Tag name cannot be empty!', { className: 'text-white bg-gray-800' });
      return;
    }

    // Check for duplicate tags
    if (tags.some(tag => tag.name.toLowerCase() === newTag.toLowerCase())) {
      toast.error('Tag name already exists!', { className: 'text-white bg-gray-800' });
      return;
    }

    // Proceed with adding the tag if no errors
    addTag({ name: newTag });
    setNewTag("");  // Clear input after adding
  };

  // Handle deleting tag after confirmation
  const confirmDeleteTag = () => {
    handleDeleteTag(curTag);
    setCurTag("");  // Reset current tag after deletion
  };

  return (
    <div className="flex w-full justify-center mt-12">
      <div className="flex flex-col gap-6 justify-start w-full max-w-3xl p-6 backdrop-blur-lg bg-[#161821f0] rounded-lg shadow-lg text-white">
        <h2 className="text-2xl text-center">Manage Preferences</h2>

        {/* Add New Tag Section */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <input
              className="bg-transparent text-white border border-gray-600 rounded-md px-4 py-2 w-[70%]"
              name="newTag"
              placeholder="New Tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <button
              className="bg-black text-white px-4 py-2 rounded"
              onClick={handleAddTag}
            >
              Add
            </button>
          </div>
        </div>

        {/* List of Tags */}
        <div className="space-y-4">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <TagContainer
                key={tag.name}
                tagName={tag.name}
                tagChanger={setCurTag}
                handleUpdateTag={handleUpdateTag}
                handleDeleteTag={() => {
                  setCurTag(tag.name); // Set the current tag for deletion
                  showDialog(); // Show confirmation dialog
                }}
              />
            ))
          ) : (
            <p>No tags available. Add one to get started!</p>
          )}
        </div>
      </div>

      {/* Dialog for confirming tag deletion */}
      <Dialog
        msg={`Are you sure you want to delete the tag "${curTag}"?`}
        accept={confirmDeleteTag}  // Call confirmDeleteTag when confirmed
        reject={() => setCurTag("")}  // Reset current tag if canceled
        acceptButtonText="Yes, Delete"
        rejectButtonText="Cancel"
      />

      
    </div>
  );
}

export default PreferenceTag;
