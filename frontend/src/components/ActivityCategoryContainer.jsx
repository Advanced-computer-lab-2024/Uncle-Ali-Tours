import React from 'react';
import { MdDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { dialog } from '../components/Dialog.jsx';
import { formdialog } from './FormDialog.jsx';

function ActivityCategoryContainer({ categoryName, categoryChanger }) {
  const { showDialog } = dialog(); // To show the delete confirmation dialog
  const { showFormDialog } = formdialog(); // To show the form dialog for updating category

  // Handle the delete action, opening a confirmation dialog
  const handleDeleteClick = () => {
    categoryChanger(categoryName); // Set the current category for deletion
    showDialog(); // Show confirmation dialog for deletion
  };

  // Handle the update action, opening the form dialog
  const handleUpdateClick = () => {
    categoryChanger(categoryName); // Set the current category for updating
    showFormDialog(); // Show the form dialog for updating the category
  };

  return (
    <div className="flex justify-between items-center bg-gray-800 text-white rounded-lg p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      <p className="text-lg font-medium">{categoryName}</p>

      <div className="flex space-x-4">
        {/* Update Button */}
        <button
          onClick={handleUpdateClick}
          className="transform transition-transform duration-300 hover:scale-110 text-xl"
        >
          <MdOutlineDriveFileRenameOutline size="24" />
        </button>

        {/* Delete Button */}
        <button
          onClick={handleDeleteClick}
          className="transform transition-transform duration-300 hover:scale-110 text-xl"
        >
          <MdDelete size="24" />
        </button>
      </div>
    </div>
  );
}

export default ActivityCategoryContainer;
