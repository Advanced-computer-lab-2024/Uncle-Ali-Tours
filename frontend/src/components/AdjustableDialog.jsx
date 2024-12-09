import React, { useEffect, useState } from 'react';
import { create } from 'zustand';
import { IoClose } from "react-icons/io5";

export const adjustableDialog = create((set) => ({
    show: false,
    state: null,
    showAdjustableDialog: (isActivated) => set({ show: true, state: isActivated }),
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

    useEffect(() => {
        if (state) {
            setDialogMsg(msg2);
            setAcceptAction(() => accept2);
        } else {
            setDialogMsg(msg1);
            setAcceptAction(() => accept1);
        }
    }, [state]);

    const acceptClick = () => {
        acceptAction();
        hideAdjustableDialog();
    };

    const rejectClick = () => {
        if (state) {
            reject2();
        } else {
            reject1();
        }
        hideAdjustableDialog();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0  bg-opacity-10 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center border-b p-4">
                    <h3 className="text-xl font-bold text-gray-900">Confirmation</h3>
                    <button
                        onClick={hideAdjustableDialog}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <IoClose size={24} />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-gray-700 mb-6 text-lg">{dialogMsg}</p>
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={acceptClick}
                            className="px-5 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-all"
                        >
                            {acceptButtonText}
                        </button>
                        <button
                            onClick={rejectClick}
                            className="px-5 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-100 transition-all"
                        >
                            {rejectButtonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdjustableDialog;

