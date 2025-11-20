"use client";

import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchStatuses } from "@/features/statuses/statusesSlice";
import { createClient, updateClient } from "@/features/clients/clientsSlice";
import { createCampaign, updateCampaign } from "@/features/campaigns/campaignsSlice";

export default function FormModal({ show, title, onClose, onSave, formState, setFormState, editingId }) {
    const { t } = useTranslation();
    const [errors, setErrors] = useState({});
    const [mounted, setMounted] = useState(false);
    const dispatch = useDispatch();

    const entity = title === "Clients" ? "client" : title === "Campaign" ? "campaign" : null;
    const clientStatusesState = useSelector((state) => state.statuses.byEntity.client);
    const campaignStatusesState = useSelector((state) => state.statuses.byEntity.campaign);
    const activeStatusesState = entity === "client" ? clientStatusesState : entity === "campaign" ? campaignStatusesState : null;

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!entity || !activeStatusesState) return;
        if (activeStatusesState.status === "idle") {
            dispatch(fetchStatuses(entity));
        }
    }, [dispatch, entity, activeStatusesState?.status]);

    if (!show || !mounted) return null;

    const validate = () => {
        const newErrors = {};
        if (!formState.name?.trim()) newErrors.name = t("Name is required");
        if (!formState.email?.trim()) newErrors.email = t("Email is required");
        if (!formState.phone?.trim()) newErrors.phone = t("Phone is required");
        if (!formState.status?.trim()) newErrors.status = t("Status is required");
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        if (entity === "client") {
            const statusesItems = clientStatusesState?.items || [];
            const selected = statusesItems.find((s) => s.name === formState.status);
            if (!selected || !selected.id) {
                setErrors((prev) => ({ ...prev, status: t("Status is required") }));
                return;
            }

            const payload = {
                statusId: selected.id,
                name: formState.name,
                email: formState.email || undefined,
                phone: formState.phone || undefined,
                joiningDate: formState.joiningDate || undefined,
                notes: formState.notes || undefined,
                facebook: formState.facebook || undefined,
                instagram: formState.instagram || undefined,
                website: formState.website || undefined,
                ownerUserId: undefined,
            };

            if (editingId) {
                await dispatch(updateClient({ id: editingId, payload }));
            } else {
                await dispatch(createClient(payload));
            }

            onClose();
            return;
        }

        if (entity === "campaign") {
            const statusesItems = campaignStatusesState?.items || [];
            const selected = statusesItems.find((s) => s.name === formState.status);
            if (!selected || !selected.id) {
                setErrors((prev) => ({ ...prev, status: t("Status is required") }));
                return;
            }

            const payload = {
                // clientId and ownerUserId are omitted for now per requirements
                statusId: selected.id,
                name: formState.name,
                email: formState.email || undefined,
                phone: formState.phone || undefined,
                joiningDate: formState.joiningDate || undefined,
                notes: formState.notes || undefined,
                facebook: formState.facebook || undefined,
                instagram: formState.instagram || undefined,
                website: formState.website || undefined,
                source: formState.source || undefined,
            };

            if (editingId) {
                await dispatch(updateCampaign({ id: editingId, payload }));
            } else {
                await dispatch(createCampaign(payload));
            }

            onClose();
            return;
        }

        // Fallback: use provided onSave for non-client entities
        onSave(formState);
    };

    const fields = [
        "name", "email", "phone", "Joining Date", "status",
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

                <h2 className="text-xl font-semibold mb-4">
                    {editingId ? t("Edit") : t("Add")}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fields.map(field => {
                        const isRequired = field === "name" || field === "email" || field === "phone" || field === "status";
                        return (
                            <div key={field} className={`flex flex-col ${field === "notes" ? "sm:col-span-2" : ""}`}>
                                <label className="block text-sm font-medium mb-1">
                                    {t(field[0].toUpperCase() + field.slice(1))}
                                    <span className={`${isRequired ? "text-red-500" : ""}`}>
                                    {`${isRequired ? " *" : ""}`}
                                </span>
                                </label>


                                {field === "Joining Date" ? (
                                    <DatePicker
                                        selected={formState.joiningDate ? new Date(formState.joiningDate) : null}
                                        onChange={(date) =>
                                            setFormState({
                                                ...formState,
                                                joiningDate: date ? date.toISOString().split("T")[0] : "",
                                            })
                                        }
                                        className="border p-2 w-full rounded cursor-pointer"
                                        dateFormat="yyyy-MM-dd"
                                    />
                                ) : field === "status" ? (
                                    <select
                                        className={`border p-2 w-full rounded ${errors.status ? "border-red-500" : ""}`}
                                        value={formState.status || ""}
                                        onChange={e => setFormState({ ...formState, status: e.target.value })}
                                    >
                                        <option value="" disabled hidden>{t("Select status")}</option>
                                        {(activeStatusesState?.items || []).map((s) => (
                                            <option key={s.id} value={s.name}>{t(s.name)}</option>
                                        ))}
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
                        );
                    })}
                </div>

                <button
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSave}
                    disabled={!formState.name || !formState.email || !formState.phone || !formState.status}
                >
                    {editingId ? t("Update") : t("Save")}
                </button>
            </div>
        </div>
    );
}
