"use client";

import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { useDispatch, useSelector } from "react-redux";
import { fetchStatuses, createStatus, updateStatus, deleteStatus } from "@/features/statuses/statusesSlice";
import Alert from "@/components/Alert";

export default function DealStatusManager({ show, onClose, deals = [], inline = false }) {
    const [newStatus, setNewStatus] = useState("");
    const [newColor, setNewColor] = useState("#2563eb");
    const [alert, setAlert] = useState({ show: false, type: "success", message: "" });
    const { t } = useTranslation();
    const { role } = useCurrentUserRole();
    const dispatch = useDispatch();
    const globalStatuses = useSelector((state) => state.statuses?.items || []);

    if (!show) return null;
    if (role !== "Admin") return null;

    const handleAdd = async () => {
        const name = newStatus.trim();
        if (!name) return;

        try {
            await dispatch(
                createStatus({
                    name,
                    colorHex: newColor || "#2563eb",
                    isFinished: false,
                    isDefault: false,
                })
            ).unwrap();
            await dispatch(fetchStatuses(""));
            setNewStatus("");
        } catch {
        }
    };

    const handleRemove = async (status) => {
        try {
            await dispatch(deleteStatus({ id: status.id })).unwrap();
        } catch (err) {
            setAlert({ show: true, type: "error", message: `${status?.name} ${err}`  });
            setTimeout(() => setAlert({ ...alert, show: false }), 2000);
        }
    };

    // Map palette classes to representative hex colors for backend colorHex
    const NEW_STATUS_PALETTE = [
        { cls: "bg-sky-50 text-sky-700 border border-sky-200", hex: "#0ea5e9" },
        { cls: "bg-amber-50 text-amber-900 border border-amber-300", hex: "#f97316" },
        { cls: "bg-emerald-50 text-emerald-900 border border-emerald-300", hex: "#22c55e" },
        { cls: "bg-violet-50 text-violet-900 border border-violet-300", hex: "#8b5cf6" },
        { cls: "bg-fuchsia-50 text-fuchsia-900 border border-fuchsia-300", hex: "#e879f9" },
        { cls: "bg-indigo-50 text-indigo-900 border border-indigo-300", hex: "#4f46e5" },
        { cls: "bg-cyan-50 text-cyan-900 border border-cyan-300", hex: "#06b6d4" },
        { cls: "bg-rose-50 text-rose-900 border border-rose-300", hex: "#e11d48" },
        { cls: "bg-gray-50 text-gray-700 border border-gray-300", hex: "#6b7280" },
    ];

    const content = (
        <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
            {!inline && (
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <IoMdClose size={24} />
                </button>
            )}

            <h2 className="text-xl font-semibold mb-4 text-black">{t("Manage Deal Statuses")}</h2>

            <div className="space-y-2 mb-4 max-h-96 overflow-auto pr-1">
                {globalStatuses.length === 0 && (
                    <div className="text-sm text-gray-500">{t("No statuses")}</div>
                )}
                {globalStatuses.map((st) => (
                    <div key={st.id} className="flex flex-col gap-2 border rounded px-3 py-2 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-800">{st.name}</span>
                            <button
                                className="text-red-600 hover:text-red-700 text-sm font-medium cursor-pointer"
                                onClick={() => handleRemove(st)}
                            >
                                {t("Remove")}
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{t("Choose color")}</span>
                            <div className="flex gap-1">
                                {NEW_STATUS_PALETTE.map(({ cls, hex }) => (
                                    <button
                                        key={cls}
                                        type="button"
                                        className={`w-6 h-6 rounded-lg border cursor-pointer ${cls} ${
                                            st.colorHex === hex ? "ring-2 ring-purple-500" : ""
                                        }`}
                                        onClick={() =>
                                            dispatch(
                                                updateStatus({
                                                    id: st.id,
                                                    body: { colorHex: hex },
                                                })
                                            )
                                        }
                                        title={hex}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder={t("New status name")}
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="border p-2 rounded flex-1 text-black"
                    />
                    <input
                        type="text"
                        placeholder="#2563eb"
                        value={newColor}
                        disabled
                        onChange={(e) => setNewColor(e.target.value)}
                        className="border p-2 rounded w-28 text bg-gray-200 text-gray-500"
                    />
                    <button
                        onClick={handleAdd}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
                        disabled={!newStatus.trim()}
                    >
                        {t("Add")}
                    </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>{t("Pick color")}:</span>
                    <div className="flex gap-1">
                        {NEW_STATUS_PALETTE.map(({ cls, hex }) => (
                            <button
                                key={cls}
                                type="button"
                                className={`w-6 h-6 rounded-lg border cursor-pointer ${cls} ${
                                    newColor === hex ? "ring-2 ring-purple-500" : ""
                                }`}
                                onClick={() => setNewColor(hex)}
                                title={hex}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {alert.show && (
                <div className="absolute top-0 right-0">
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert({ ...alert, show: false })}
                    />
                </div>
            )}
        </div>
    );

    if (inline) {
        return content;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 text-gray-800">
            {content}
        </div>
    );
}
