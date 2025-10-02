"use client";

import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { TbCurrencyDram } from "react-icons/tb";
import { getDealsColumnsForRole } from "@/constants";
import { useTranslation } from "react-i18next";

const USER_ROLE = process.env.NEXT_PUBLIC_CURRENT_USER;
const AVAILABLE_STATUSES = getDealsColumnsForRole(USER_ROLE);

export default function DealModal({ show, onClose, onSave, formData, setFormData, editingDeal }) {
    const { t } = useTranslation();
    const [errors, setErrors] = useState({});

    useEffect(() => setErrors({}), [show]);

    if (!show) return null;

    const validate = () => {
        const newErrors = {};
        if (!formData.name?.trim()) newErrors.name = t("Name is required");
        if (!formData.email?.trim()) newErrors.email = t("Email is required");
        if (!formData.value) newErrors.value = t("Amount is required");
        if (!formData.status?.trim()) newErrors.status = t("Status is required");

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        onSave();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 text-gray-800">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
                    onClick={onClose}
                >
                    <IoMdClose size={25} />
                </button>

                <h2 className="text-xl font-semibold mb-4">
                    {editingDeal ? t("Edit Deal") : t("Add Deal")}
                </h2>

                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">{t("Name")}</label>
                        <input
                            type="text"
                            placeholder={t("Name")}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`border p-2 w-full rounded ${errors.name ? "border-red-500" : ""}`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1">{t("Email")}</label>
                        <input
                            type="email"
                            placeholder={t("Email")}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`border p-2 w-full rounded ${errors.email ? "border-red-500" : ""}`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Amount */}
                    <div className="relative">
                        <label className="block text-sm font-medium mb-1">{t("Amount")}</label>
                        <span className="absolute left-2 top-1/2 translate-y-1 text-gray-400">
                            <TbCurrencyDram />
                        </span>
                        <input
                            type="text"
                            placeholder={t("Amount")}
                            value={formData.value}
                            onChange={(e) => {
                                const digitsOnly = e.target.value.replace(/\D/g, "");
                                setFormData({ ...formData, value: digitsOnly });
                            }}
                            className={`border p-2 pl-7 w-full rounded ${errors.value ? "border-red-500" : ""}`}
                        />
                        {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-1">{t("Status")}</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className={`border p-2 w-full rounded ${errors.status ? "border-red-500" : ""}`}
                        >
                            <option value="" className="italic text-gray-400" disabled>{t("Select status")}</option>
                            {AVAILABLE_STATUSES.map((s) => (
                                <option key={s} value={s}>{t(s)}</option>
                            ))}
                        </select>
                        {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium mb-1">{t("Notes")}</label>
                        <textarea
                            placeholder={t("Notes")}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="border p-2 w-full rounded"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        className="bg-purple-400 hover:bg-purple-500 text-white px-4 py-2 rounded w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!formData.name || !formData.email || !formData.value}
                    >
                        {editingDeal ? t("Update Deal") : t("Add Deal")}
                    </button>
                </div>
            </div>
        </div>
    );
}
