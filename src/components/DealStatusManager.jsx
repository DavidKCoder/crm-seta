"use client";

import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDealStatuses } from "@/components/DealStatusesProvider";
import { useTranslation } from "react-i18next";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { useDispatch } from "react-redux";
import { apiPost } from "@/lib/apiClient";
import { fetchStatuses } from "@/features/statuses/statusesSlice";

export default function DealStatusManager({ show, onClose, deals = [] }) {
    const { statuses, addStatus, removeStatus, setStatusStyle, getStatusStyle } = useDealStatuses();
    const [newStatus, setNewStatus] = useState("");
    const { t } = useTranslation();
    const { role } = useCurrentUserRole();
    const dispatch = useDispatch();

    if (!show) return null;
    if (role !== "Admin") return null;

    const handleAdd = async () => {
        const name = newStatus.trim();
        if (!name) return;

        try {
            // Create status in backend for "deal" entity. Use a default color; UI color mapping is handled separately.
            await apiPost("/api/statuses", {
                entity: "deal",
                name,
                colorHex: "#2563eb",
                isFinished: false,
                isDefault: false,
            });

            // Refresh statuses from backend so DealStatusesProvider and forms stay in sync
            await dispatch(fetchStatuses("deal"));
            setNewStatus("");
        } catch {
        }
    };

    const handleRemove = (st) => {
        const usedCount = deals.filter((d) => d.status === st).length;
        if (usedCount > 0) {
            // confirm with i18n
            const confirmed = window.confirm(t("StatusInUseConfirm", { count: usedCount }));
            if (!confirmed) return;
        }
        removeStatus(st);
    };

    const PALETTE = [
        "bg-sky-50 text-sky-700 border border-sky-200",
        "bg-amber-50 text-amber-900 border border-amber-300",
        "bg-emerald-50 text-emerald-900 border border-emerald-300",
        "bg-violet-50 text-violet-900 border border-violet-300",
        "bg-fuchsia-50 text-fuchsia-900 border border-fuchsia-300",
        "bg-indigo-50 text-indigo-900 border border-indigo-300",
        "bg-cyan-50 text-cyan-900 border border-cyan-300",
        "bg-green-50 text-green-900 border border-green-300",
        "bg-rose-50 text-rose-900 border border-rose-300",
        "bg-gray-50 text-gray-700 border border-gray-300",
    ];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 text-gray-800">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <IoMdClose size={24} />
                </button>

                <h2 className="text-xl font-semibold mb-4">{t("Manage Deal Statuses")}</h2>

                <div className="space-y-2 mb-4 max-h-60 overflow-auto pr-1">
                    {statuses.length === 0 && (
                        <div className="text-sm text-gray-500">{t("No statuses")}</div>
                    )}
                    {statuses.map((st) => (
                        <div key={st} className="flex flex-col gap-2 border rounded px-3 py-2 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-800">{st}</span>
                                <button
                                    className="text-red-600 hover:text-red-700 text-sm font-medium cursor-pointer"
                                    onClick={() => handleRemove(st)}
                                >
                                    {t("Remove")}
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">{t("Choose color")}</span>
                                <div className="flex flex-wrap gap-2">
                                    {PALETTE.map((cls) => {
                                        const selected = getStatusStyle(st) === cls;
                                        return (
                                            <button
                                                key={cls}
                                                type="button"
                                                className={`w-6 h-6 rounded border cursor-pointer ${cls} ${selected ? "ring-2 ring-purple-500" : ""}`}
                                                onClick={() => setStatusStyle(st, cls)}
                                                title={cls}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder={t("New status name")}
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="border p-2 rounded flex-1"
                    />
                    <button
                        onClick={handleAdd}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
                        disabled={!newStatus.trim()}
                    >
                        {t("Add")}
                    </button>
                </div>
            </div>
        </div>
    );
}
