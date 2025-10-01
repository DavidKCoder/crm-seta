"use client";

import { FiLock } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function NotAccess() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-700">
            <FiLock size={48} className="mb-4 text-gray-500" />
            <h1 className="text-2xl font-bold">No Access</h1>
            <p className="text-gray-500 mt-2 mb-6">
                You don’t have permission to view this page.
            </p>
            <button
                onClick={() => router.push("/")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer"
            >
                Go Home
            </button>
        </div>
    );
}
