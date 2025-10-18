"use client";
import { createContext, useContext, useState, useCallback } from "react";

const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {

    const [confirmState, setConfirmState] = useState({
        open: false,
        title: "",
        message: "",
        resolve: null,
        data: {}
    });
    // console.log(confirmState)
    const confirm = useCallback((title, message, data) => {
        // console.log(title, message, data)
        return new Promise((resolve) => {
            setConfirmState({ open: true, title, message, resolve, data });
        });
    }, []);

    const handleConfirm = () => {
        confirmState.resolve({ confirm: true, data: confirmState.data });
        setConfirmState((prev) => ({ ...prev, open: false }));
    };

    const handleCancel = () => {
        confirmState.resolve({ confirm: false });
        setConfirmState((prev) => ({ ...prev, open: false }));
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}

            {confirmState.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-sm p-6 text-gray-800">
                        <h2 className="text-lg font-semibold">{confirmState.title}</h2>
                        <p className="mt-2 text-sm text-gray-600">{confirmState.message}</p>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
}

export const useConfirm = () => useContext(ConfirmContext);
