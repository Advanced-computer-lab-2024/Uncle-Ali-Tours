import React, { useEffect, useState } from 'react';
import { create } from 'zustand';
import { IoClose } from "react-icons/io5";
export const adjustableDialog = create((set) => ({
    show: false,
    state: null,  // Track the activation state
    showAdjustableDialog: (isActivated) => set({ show: true, state: isActivated }),  // Pass `isActivated` to store
    hideAdjustableDialog: () => set({ show: false }),
}));


function AdjustableDialog({
    state,
    msg1,
    msg2,
    accept1,
    accept2,
    reject1,
    reject2,
    acceptButtonText = "Accept",
    rejectButtonText = "Reject"
}) {
    const { show, hideAdjustableDialog } = adjustableDialog();
    const [dialogMsg, setDialogMsg] = useState('');
    const [acceptAction, setAcceptAction] = useState(() => () => {});
    
// Inside `AdjustableDialog.jsx`, modify the useEffect dependency array to include `state` only:
useEffect(() => {
    if (state) {
        setDialogMsg(msg2);
        setAcceptAction(() => accept2);
    } else {
        setDialogMsg(msg1);
        setAcceptAction(() => accept1);
    }
}, [state]); // Only `state` here, so `msg1`, `msg2`, `accept1`, `accept2` react to state change


    const acceptClick = () => {
        acceptAction();  // Use the updated action based on the current `state`
        hideAdjustableDialog();
    };

    const rejectClick = () => {
        if (state) {
            reject2();  // Deactivate itinerary
        } else {
            reject1();  // Activate itinerary
        }
        hideAdjustableDialog();
    };

    return (
        show && (
            <div className="bg-gray-700 h-fit text-center p-4 w-[23vw] rounded-xl absolute right-0 left-0 top-[20vh] mx-auto">
                <button onClick={hideAdjustableDialog} className="absolute right-3 h-fit rounded-full">
                    <IoClose size={20} />
                </button>
                <p className="my-2">{dialogMsg}</p>
                <button onClick={acceptClick} className="bg-[#dc5809] m-2 py-2 px-6 rounded">
                    {acceptButtonText}
                </button>
                <button onClick={rejectClick} className="bg-[#dc5809] m-2 py-2 px-6 rounded">
                    {rejectButtonText}
                </button>
            </div>
        )
    );
}

export default AdjustableDialog;
