import React from 'react';
import './Modal.css'; // Import shared modal styles

const DeleteModal = ({ tag, onDelete, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Are you sure you want to delete this tag?</h3>
        <p>{tag.name}</p>
        <div className="modal-actions">
          <button onClick={onDelete} className="delete-button">Delete</button>
          <button onClick={onCancel} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
