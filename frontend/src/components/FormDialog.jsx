import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { create } from 'zustand';

export const formdialog = create((set) => ({
  show: false,
  msg: '',
  type: '', // Type can be "form" or "confirmation"
  accept: () => {}, // Accept action
  reject: () => {}, // Reject action
  inputs: [], // Inputs for the form
  setShow: (show) => set({ show }),
  showFormDialog: (msg, inputs, accept, reject) =>
    set({
      show: true,
      msg,
      type: 'form',
      inputs,
      accept,
      reject,
    }),
  showConfirmationDialog: (msg, accept, reject) =>
    set({
      show: true,
      msg,
      type: 'confirmation',
      accept,
      reject,
      inputs: [],
    }),
  hideFormDialog: () => set({ show: false }),
}));

function FormDialog({
  msg,
  accept,
  reject,
  acceptButtonText = 'Accept',
  rejectButtonText = 'Reject',
  inputs = [],
}) {
  const { show, hideFormDialog } = formdialog();
  const [data, setData] = useState({});

  const acceptClick = () => {
    accept(data);
    hideFormDialog();
    setData({});
  };

  const rejectClick = () => {
    reject();
    hideFormDialog();
  };

  return (
    show && (
      <div className="bg-gray-700 h-fit text-center text-black p-4 w-[23vw] rounded-xl absolute right-0 left-0 top-[20vh] mx-auto">
        <button
          onClick={hideFormDialog}
          className="absolute right-3 h-fit rounded-full"
        >
          <IoClose size={20} />
        </button>
        <p className="my-2">{msg}</p>
        {inputs.length > 0 &&
          inputs.map((input, index) => (
            <input
              name={input}
              key={index}
              placeholder={input}
              onChange={(e) =>
                setData({ ...data, [input]: e.target.value })
              }
              className="mb-2 w-[14vw]"
            />
          ))}
        <div className="mt-2">
          <button
            onClick={acceptClick}
            className="bg-[#dc5809] m-2 py-2 px-6 rounded"
          >
            {acceptButtonText}
          </button>
          <button
            onClick={rejectClick}
            className="bg-[#dc5809] m-2 py-2 px-6 rounded"
          >
            {rejectButtonText}
          </button>
        </div>
      </div>
    )
  );
}

export default FormDialog;
