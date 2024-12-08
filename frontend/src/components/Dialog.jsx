import React from 'react';
import { create } from 'zustand';
import { IoClose } from "react-icons/io5";

export const dialog = create((set) => ({
  show: false,
  setShow: (show) => set({ show }),
  showDialog: () => set({ show: true }),
  hideDialog: () => set({ show: false }),
}));

function Dialog({ msg, accept, reject, acceptButtonText = "Accept", rejectButtonText = "Reject" }) {
  const { show, hideDialog } = dialog();

  const acceptClick = () => {
    accept();
    hideDialog();
  };

  const rejectClick = () => {
    reject();
    hideDialog();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-bold text-gray-900">Confirmation</h3>
          <button
            onClick={hideDialog}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-6 text-lg">{msg}</p>
          <div className="flex justify-between mt-4">
            <button
              onClick={acceptClick}
              className="px-5 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-all ml-4"
            >
              {acceptButtonText}
            </button>
            <button
              onClick={rejectClick}
              className="px-5 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-100 transition-all mr-4"
            >
              {rejectButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dialog;
