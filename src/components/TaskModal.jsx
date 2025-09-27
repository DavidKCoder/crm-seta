"use client";

import { useState, useEffect } from "react";

export default function TaskModal({ isOpen, onClose, onSave, task }) {
    const [title, setTitle] = useState("");
    const [users, setUsers] = useState("");
    const [tags, setTags] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (task) {
            setTitle(task.title || "");
            setUsers(task.users ? task.users.join(", ") : "");
            setTags(task.tags ? task.tags.join(", ") : "");
        } else {
            setTitle("");
            setUsers("");
            setTags("");
        }
        setError("");
    }, [task, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!title.trim()) {
            setError("Title is required.");
            return;
        }

        // нормализация users и tags
        const normalizedUsers = users
            ? users.split(",").map((u) => u.trim()).filter(Boolean)
            : [];
        const normalizedTags = tags
            ? tags.split(",").map((t) => t.trim()).filter(Boolean)
            : [];

        onSave({
            title: title.trim(),
            users: normalizedUsers.join(", "),
            tags: normalizedTags.join(", "),
        });

        setError("");
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
                <h2 className="text-lg font-bold mb-4">{task ? "Edit Task" : "Add Task"}</h2>

                <input
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full border rounded px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        error ? "border-red-500" : ""
                    }`}
                />
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <input
                    type="text"
                    placeholder="Users (comma separated)"
                    value={users}
                    onChange={(e) => setUsers(e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
