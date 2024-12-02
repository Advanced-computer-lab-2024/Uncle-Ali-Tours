import React, { useState } from 'react';
import { MdDelete, MdOutlineDriveFileRenameOutline } from 'react-icons/md';

function TagContainer({ tagName, tagChanger, handleUpdateTag, handleDeleteTag }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTagName, setNewTagName] = useState(tagName); // Set the initial tag name

  const handleUpdateClick = () => {
    setIsEditing(true); // Start editing when the edit button is clicked
    tagChanger(tagName); // Pass tag name to parent to handle state
  };

  const handleSave = async () => {
    if (newTagName.trim() !== tagName) {
      // If the name has changed, send the update request
      await handleUpdateTag(tagName, newTagName);
    }
    setIsEditing(false); // Close the edit mode after saving
  };

  const handleCancel = () => {
    setIsEditing(false); // Cancel editing and reset the name
    setNewTagName(tagName); // Reset the newTagName to original tag name
  };

  const handleDelete = async () => {
    const response = await handleDeleteTag(tagName); // Call deleteTag function from parent
    if (response.success) {
      // Handle success (e.g., show a success toast)
      toast.success(response.message, { className: 'text-white bg-gray-800' });
    } else {
      // Handle error (e.g., show an error toast)
      toast.error(response.message, { className: 'text-white bg-gray-800' });
    }
  };

  return (
    <div className="flex justify-between mb-6 text-black text-left w-[20vw] bg-white mx-auto rounded h-[5vh]">
      <div className="ml-2">
        {isEditing ? (
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)} // Update newTagName when user types
            className="bg-transparent text-black border border-gray-600 rounded-md px-2 py-1"
          />
        ) : (
          <p>{tagName}</p>
        )}
      </div>

      <div className="flex">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="mr-4 transform transition-transform duration-300 hover:scale-125"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="mr-4 transform transition-transform duration-300 hover:scale-125"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleUpdateClick}
              className="mr-4 transform transition-transform duration-300 hover:scale-125"
            >
              <MdOutlineDriveFileRenameOutline size="18" color="black" />
            </button>
            <button
              onClick={handleDelete}
              className="mr-2 transform transition-transform duration-300 hover:scale-125"
            >
              <MdDelete size="18" color="black" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TagContainer;
