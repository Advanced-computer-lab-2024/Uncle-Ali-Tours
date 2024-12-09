import React, { useState, useEffect } from 'react';
import { useTagStore } from '../store/tag.js';
import Dialog, { dialog } from '../components/Dialog.jsx';
import TagContainer from '../components/TagContainer.jsx';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

function PreferenceTag() {
  const [curTag, setCurTag] = useState(''); // Holds the current tag to delete
  const [newTag, setNewTag] = useState(''); // Holds the new tag name
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
    if (tags.some((tag) => tag.name.toLowerCase() === newTag.toLowerCase())) {
      toast.error('Tag name already exists!', { className: 'text-white bg-gray-800' });
      return;
    }

    // Proceed with adding the tag if no errors
    addTag({ name: newTag });
    setNewTag(''); // Clear input after adding
  };

  // Handle deleting tag after confirmation
  const confirmDeleteTag = () => {
    handleDeleteTag(curTag);
    setCurTag(''); // Reset current tag after deletion
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(../images/egypt.jpg)' }}>
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-3xl z-10"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Manage Preferences</h2>

        {/* Add New Tag Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Create New Tag</h3>
          <div className="flex items-center gap-4">
            <input
              className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              name="newTag"
              placeholder="New Tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors"
              onClick={handleAddTag}
            >
              Add Tag
            </motion.button>
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
            <p className="text-gray-700">No tags available. Add one to get started!</p>
          )}
        </div>
      </motion.div>

      {/* Dialog for confirming tag deletion */}
      <Dialog
        msg={`Are you sure you want to delete the tag "${curTag}"?`}
        accept={confirmDeleteTag} // Call confirmDeleteTag when confirmed
        reject={() => setCurTag('')} // Reset current tag if canceled
        acceptButtonText="Yes, Delete"
        rejectButtonText="Cancel"
      />

      <footer className="absolute bottom-0 left-0 w-full bg-black text-white text-center py-2 text-sm">
        <p>© {new Date().getFullYear()} U A T. All rights reserved.</p>
      </footer>

      <Toaster position="top-right" />
    </div>
  );
}

export default PreferenceTag;
