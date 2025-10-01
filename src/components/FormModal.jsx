"use client";

import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

const statuses = ["New", "Pending", "Approved", "Copy Writing", "Shooting", "Design", "Targeting", "Completed", "Lost"];

export default function FormModal({ show, title, onClose, onSave, formState, setFormState, editingId }) {
    const [errors, setErrors] = useState({});
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!show || !mounted) return null;

    const validate = () => {
        const newErrors = {};
        if (!formState.name?.trim()) newErrors.name = "Name is required";
        if (!formState.email?.trim()) newErrors.email = "Email is required";
        if (!formState.phone?.trim()) newErrors.phone = "Phone is required";
        if (!formState.status?.trim()) newErrors.status = "Status is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        onSave(formState);
    };

    const fields = [
        "name", "email", "phone", "joiningDate", "status",
        "facebook", "instagram", "website", "notes",
    ];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 text-gray-900">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
                    onClick={onClose}
                >
                    <IoMdClose size={25} />
                </button>

                <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit" : "Add"} {title}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fields.map(field => (
                        <div
                            key={field}
                            className={`flex flex-col ${field === "notes" ? "sm:col-span-2" : ""}`}
                        >
                            <label className="block text-sm font-medium mb-1">
                                {field[0].toUpperCase() + field.slice(1)}
                            </label>

                            {field === "status" ? (
                                <select
                                    className={`border p-2 w-full rounded ${errors.status ? "border-red-500" : ""}`}
                                    value={formState.status || ""}
                                    onChange={e => setFormState({ ...formState, status: e.target.value })}
                                >
                                    <option value="" disabled hidden>Select status</option>
                                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            ) : field === "joiningDate" ? (
                                <input
                                    type="date"
                                    className="border p-2 w-full rounded"
                                    value={formState.joiningDate || ""}
                                    onChange={e => setFormState({ ...formState, joiningDate: e.target.value })}
                                />
                            ) : field === "notes" ? (
                                <textarea
                                    className={`border p-2 w-full rounded min-h-[100px] resize-y ${errors.notes ? "border-red-500" : ""}`}
                                    value={formState.notes || ""}
                                    onChange={e => setFormState({ ...formState, notes: e.target.value })}
                                />
                            ) : (
                                <input
                                    type="text"
                                    className={`border p-2 w-full rounded ${errors[field] ? "border-red-500" : ""}`}
                                    value={formState[field] || ""}
                                    onChange={e => setFormState({ ...formState, [field]: e.target.value })}
                                />
                            )}

                            {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                        </div>
                    ))}
                </div>

                <button
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSave}
                    disabled={!formState.name || !formState.email || !formState.phone || !formState.status}
                >
                    {editingId ? "Update" : "Save"}
                </button>


            </div>
        </div>
    );
}
