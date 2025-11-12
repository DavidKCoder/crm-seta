"use client";

import React, { useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import DealDropdown from "@/components/DealDropdown";
import { useTranslation } from "react-i18next";
import { TbCurrencyDram } from "react-icons/tb";

export default function ExpenseFormModal({
                                             show,
                                             title,
                                             onClose,
                                             onSave,
                                             formState,
                                             setFormState,
                                             dealsList = [],
                                         }) {
    const { t } = useTranslation();

    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formState.dealId) {
            setError(t("Please select a deal"));
            return; // останавливаем сабмит
        }

        setError(""); // сброс ошибки
        onSave();
    };

    if (!show) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: name === "other" || name === "dealId" ? value : Number(value) || 0,
        }));
    };

    const total = useMemo(() => {
        return (
            (formState.salesManager || 0) +
            (formState.copyWriter || 0) +
            (formState.designer || 0) +
            (formState.targeting || 0) +
            (formState.shooting || 0)
        );
    }, [formState]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative text-gray-900">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 cursor-pointer"
                    onClick={onClose}
                >
                    <IoMdClose size={24} />
                </button>

                <h2 className="text-xl font-semibold mb-4">{t(title)}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">{t("Deal")} ID</label>
                        <DealDropdown
                            dealsList={dealsList.sort((a, b) => a.id - b.id)}
                            formState={formState}
                            setFormState={setFormState}
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">{t("Sales Manager / PM")}</label>
                            <input
                                type="number"
                                name="salesManager"
                                value={formState.salesManager || ""}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">{t("Copywriter")}</label>
                            <input
                                type="number"
                                name="copyWriter"
                                value={formState.copyWriter || ""}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">{t("Designer")}</label>
                            <input
                                type="number"
                                name="designer"
                                value={formState.designer || ""}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">{t("Targeting")}</label>
                            <input
                                type="number"
                                name="targeting"
                                value={formState.targeting || ""}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">{t("Shooting")}</label>
                            <input
                                type="number"
                                name="shooting"
                                value={formState.shooting || ""}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1">{t("Other / Notes")}</label>
                        <textarea
                            name="other"
                            value={formState.other || ""}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            rows={3}
                            placeholder={t("Enter additional notes here…")}
                        />
                    </div>

                    <div className="text-right font-semibold flex items-center justify-end gap-1">
                        {t("Total")}
                        <div className="flex items-center">{total.toLocaleString("en-EN")} <TbCurrencyDram /></div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        >
                            {t("Cancel")}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
                        >
                            {t("Save")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
