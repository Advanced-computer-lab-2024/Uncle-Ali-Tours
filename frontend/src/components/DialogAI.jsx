import React from 'react';

const Dialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
        <div>{children}</div>
        <span className="absolute top-0 right-0 p-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </span>
      </div>
    </div>
  );
};

const DialogContent = ({ children }) => <div className="mt-4">{children}</div>;

const DialogHeader = ({ children }) => <div className="text-lg font-medium">{children}</div>;

const DialogTitle = ({ children }) => <h3 className="text-xl font-semibold">{children}</h3>;

export { Dialog, DialogContent, DialogHeader, DialogTitle };

