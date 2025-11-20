"use client";

import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { TbCurrencyDram } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { useDealStatuses } from "@/components/DealStatusesProvider";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";

export default function DealModal({ show, onClose, onSave, formData, setFormData, editingDeal }) {
    const { t } = useTranslation();
    const { getStatusesForRole } = useDealStatuses();
    const { role } = useCurrentUserRole();
    const AVAILABLE_STATUSES = getStatusesForRole(role);
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
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
                    onClick={onClose}
                >
                    <IoMdClose size={25} />
                </button>

                <h2 className="text-xl font-semibold mb-6">
                    {editingDeal ? t("Edit Deal") : t("Add Deal")}
                </h2>

                <div className="grid grid-cols-2 gap-4">
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
                        <span className="absolute left-2 top-9 text-gray-400">
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
                            onChange={(e) => setFormData({ ...formData, status: e.target.value, isFinished: false })}
                            className={`border p-2 w-full rounded ${errors.status ? "border-red-500" : ""}`}
                        >
                            <option value="" className="italic text-gray-400" disabled>{t("Select status")}</option>
                            {AVAILABLE_STATUSES.map((s) => (
                                <option key={s} value={s}>{t(s)}</option>
                            ))}
                        </select>
                        {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                    </div>

                    {/* Role (optional free-text) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">{t("Role")}</label>
                        <input
                            type="text"
                            placeholder={t("Role")}
                            value={formData.role || ""}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="border p-2 w-full rounded"
                        />
                    </div>

                    {/* Instagram */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Instagram</label>
                        <input
                            type="text"
                            placeholder="@username"
                            value={formData.instagram || ""}
                            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                            className="border p-2 w-full rounded"
                        />
                    </div>

                    {/* Facebook */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Facebook</label>
                        <input
                            type="text"
                            placeholder="@username"
                            value={formData.facebook || ""}
                            onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                            className="border p-2 w-full rounded"
                        />
                    </div>

                    {/* Website */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Website</label>
                        <input
                            type="text"
                            placeholder="https://..."
                            value={formData.website || ""}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className="border p-2 w-full rounded"
                        />
                    </div>

                    {/* Joining Date */}
                    <div>
                        <label className="block text-sm font-medium mb-1">{t("Joining Date")}</label>
                        <input
                            type="date"
                            value={formData.joiningDate || ""}
                            onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                            className="border p-2 w-full rounded"
                        />
                    </div>

                    {/* Notes */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">{t("Notes")}</label>
                        <textarea
                            placeholder={t("Notes")}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="border p-2 w-full rounded"
                        />
                    </div>

                    {/* PDF File Upload */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">{t("Attach PDF")}</label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setFormData({ ...formData, pdfFile: file });
                                }
                            }}
                            className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3
                               file:rounded file:border-0 file:text-sm file:font-semibold
                               file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
                        />
                        {formData.pdfFile && (
                            <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                                <span className="text-sm truncate max-w-[70%]">{formData.pdfFile.name}</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, pdfFile: null })}
                                    className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer"
                                >
                                    {t("Remove")}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Is Finished Checkbox */}
                    <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isFinished"
                                checked={formData.isFinished || false}
                                onChange={(e) => setFormData({ ...formData, isFinished: e.target.checked })}
                                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                            />
                            <label htmlFor="isFinished" className="text-sm font-medium text-gray-700 cursor-pointer">
                                {t("Is Finished")}
                            </label>
                        </div>
                    </div>
                    
                    {/* Button */}
                    <div className="col-span-2">
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
        </div>
    );
}
