import { useState } from "react";

export default function PasswordModal({ open, onClose, onSubmit }) {
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-800">
                    Enter Password
                </h2>

                {/* Input */}
                <div className="mt-4">
                    <label className="mb-1 block text-sm font-medium text-gray-600">
                        Password
                    </label>

                    <div className="flex items-center rounded-lg border border-gray-300 px-3 focus-within:ring-2 focus-within:ring-blue-500">
                        <input
                            type={show ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full py-2 outline-none"
                            placeholder="Enter your password"
                        />

                        <button
                            type="button"
                            onClick={() => setShow(!show)}
                            className="text-sm text-blue-600"
                        >
                            {show ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg border px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                            onSubmit(password);
                            setTimeout(() => {
                                setPassword('')
                            }, 1000);
                        }}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
