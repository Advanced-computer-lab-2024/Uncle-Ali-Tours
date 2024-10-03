import React, { useState } from 'react';
import './Modal.css'; // Import shared modal styles

const UpdateModal = ({ tag, onSave, onCancel }) => {
  const [newTagName, setNewTagName] = useState(tag.name); // Set initial name

  const handleSave = () => {
    onSave(newTagName); // Call the save function and pass the new name
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Update Tag</h3>
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="Enter new tag name"
        />
        <div className="modal-actions">
          <button onClick={handleSave} className="save-button">Save</button>
          <button onClick={onCancel} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
