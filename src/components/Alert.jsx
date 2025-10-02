"use client";

import { IoMdClose } from "react-icons/io";

const typeStyles = {
    success: "text-green-800 bg-green-50 border border-green-200",
    error: "text-red-800 bg-red-50 border border-red-200",
    warning: "text-yellow-800 bg-yellow-50 border border-yellow-200",
    info: "text-blue-800 bg-blue-50 border border-blue-200",
};

export default function Alert({ type = "info", message, onClose }) {
    return (
        <div
            className={`flex items-center p-4 mb-4 text-sm rounded-lg shadow-lg ${typeStyles[type]}`}
            role="alert"
        >
            <div className="flex-1">{message}</div>
            {onClose && (
                <button
                    type="button"
                    className="ml-4 inline-flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-200"
                    onClick={onClose}
                >
                    <IoMdClose size={18} />
                </button>
            )}
        </div>
    );
}
