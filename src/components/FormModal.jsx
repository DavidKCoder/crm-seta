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

    const entity = title === "Client" ? "client" : title === "Campaign" ? "campaign" : null;
    const clientStatusesState = useSelector((state) => state.statuses);
    const campaignStatusesState = useSelector((state) => state.statuses);
    const activeStatusesState = entity === "client" ? clientStatusesState : entity === "campaign" ? campaignStatusesState : null;

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!show) return;
        if (!formState) return;

        const hasFirst = !!formState.firstName;
        const hasLast = !!formState.lastName;
        const rawName = typeof formState.name === "string" ? formState.name.trim() : "";

        if (!hasFirst && !hasLast && rawName) {
            const parts = rawName.split(" ");
            const firstName = parts.shift() || "";
            const lastName = parts.join(" ");
            setFormState(prev => ({
                ...prev,
                firstName,
                lastName,
            }));
        }
    }, [show, formState?.name]);

    useEffect(() => {
        if (!entity || !activeStatusesState) return;
        if (activeStatusesState.status === "idle") {
            dispatch(fetchStatuses(entity));
        }
    }, [dispatch, entity, activeStatusesState?.status]);

    if (!show || !mounted) return null;

    const getStatusName = (status) => {
        if (!status) return "";
        return typeof status === "string" ? status : status.name || "";
    };

    const validate = () => {
        const newErrors = {};

        // First name validation (last name is optional)
        if (!formState.firstName?.trim()) newErrors.firstName = t("First name is required");

        // Email validation
        if (formState.email?.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formState.email.trim())) {
                newErrors.email = t("Please enter a valid email address");
            }
        }

        // Phone validation
        if (!formState.phone?.trim()) newErrors.phone = t("Phone is required");

        // Status validation
        const statusName = getStatusName(formState.status);
        if (!statusName.trim()) newErrors.status = t("Status is required");

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const clearFieldError = (fieldName) => {
        setErrors(prev => ({
            ...prev,
            [fieldName]: undefined,
        }));
    };

    const handleSave = async () => {
        if (!validate()) return;

        const statusName = getStatusName(formState.status);

        // Merge first and last names into a single name field for saving
        const mergedName = [formState.firstName, formState.lastName]
            .filter(part => part && part.trim())
            .join(" ")
            .trim();

        try {
            if (entity === "client") {
                const statusesItems = clientStatusesState?.items || [];
                const selected = statusesItems.find((s) => s.name === statusName);
                if (!selected || !selected.id) {
                    setErrors((prev) => ({ ...prev, status: t("Status is required") }));
                    return;
                }

                const payload = {
                    statusId: selected.id,
                    name: mergedName,
                    email: formState.email || undefined,
                    phone: formState.phone || undefined,
                    joiningDate: formState.joiningDate || undefined,
                    notes: formState.notes || undefined,
                    facebook: formState.facebook || undefined,
                    instagram: formState.instagram || undefined,
                    website: formState.website || undefined,
                    ownerUserId: undefined,
                };

                const resultAction = editingId
                    ? await dispatch(updateClient({ id: editingId, payload }))
                    : await dispatch(createClient(payload));

                if (updateClient.fulfilled.match(resultAction) || createClient.fulfilled.match(resultAction)) {
                    onClose();
                } else if (updateClient.rejected.match(resultAction) || createClient.rejected.match(resultAction)) {
                    const error = resultAction.error || resultAction.payload;
                    if (error?.errors) {
                        // Handle API validation errors
                        const apiErrors = {};
                        error.errors.forEach(err => {
                            apiErrors[err.path] = err.message;
                        });
                        setErrors(prev => ({ ...prev, ...apiErrors }));
                    }
                }
                return;
            }

            if (entity === "campaign") {
                const statusesItems = campaignStatusesState?.items || [];
                const selected = statusesItems.find((s) => s.name === statusName);
                if (!selected || !selected.id) {
                    setErrors((prev) => ({ ...prev, status: t("Status is required") }));
                    return;
                }

                const payload = {
                    statusId: selected.id,
                    name: mergedName,
                    email: formState.email || undefined,
                    phone: formState.phone || undefined,
                    joiningDate: formState.joiningDate || undefined,
                    notes: formState.notes || undefined,
                    facebook: formState.facebook || undefined,
                    instagram: formState.instagram || undefined,
                    website: formState.website || undefined,
                    source: formState.source || undefined,
                };

                const resultAction = editingId
                    ? await dispatch(updateCampaign({ id: editingId, payload }))
                    : await dispatch(createCampaign(payload));

                if (updateCampaign.fulfilled.match(resultAction) || createCampaign.fulfilled.match(resultAction)) {
                    onClose();
                } else if (updateCampaign.rejected.match(resultAction) || createCampaign.rejected.match(resultAction)) {
                    const apiErrors = {};

                    // Handle different error formats
                    if (resultAction.payload?.errors) {
                        // Handle array of validation errors
                        if (Array.isArray(resultAction.payload.errors)) {
                            resultAction.payload.errors.forEach(err => {
                                if (err.path && err.message) {
                                    apiErrors[err.path] = err.message;
                                } else if (err.message) {
                                    apiErrors._form = (apiErrors._form ? apiErrors._form + " " : "") + err.message;
                                }
                            });
                        }
                    }

                    // If we have a message but no field-specific errors
                    if (resultAction.payload?.message && Object.keys(apiErrors).length === 0) {
                        apiErrors._form = resultAction.payload.message;
                    }

                    // Fallback to error message from error object
                    if (resultAction.error?.message && Object.keys(apiErrors).length === 0) {
                        apiErrors._form = resultAction.error.message;
                    }

                    // Final fallback for unknown errors
                    if (Object.keys(apiErrors).length === 0) {
                        apiErrors._form = "An unknown error occurred. Please try again.";
                    }

                    // Update errors state
                    setErrors(prev => ({
                        ...prev,
                        ...apiErrors,
                    }));

                    // Scroll to the first error
                    setTimeout(() => {
                        const firstErrorField = Object.keys(apiErrors).find(key => key !== "_form");
                        if (firstErrorField) {
                            const element = document.querySelector(`[name="${firstErrorField}"]`);
                            if (element) {
                                element.scrollIntoView({ behavior: "smooth", block: "center" });
                                element.focus();
                            }
                        } else if (apiErrors._form) {
                            // If we only have a general error, scroll to the top of the form
                            const formElement = document.querySelector(".bg-white.rounded-lg");
                            if (formElement) {
                                formElement.scrollIntoView({ behavior: "smooth", block: "start" });
                            }
                        }
                    }, 100);
                }
                return;
            }

            // Fallback: use provided onSave for non-client entities,
            // but ensure name is populated from first/last
            onSave({
                ...formState,
                name: mergedName,
            });
        } catch (error) {
            console.error("Error saving data:", error);
            setErrors(prev => ({
                ...prev,
                _error: error.message || "An unexpected error occurred",
            }));
        }
    };

    const fields = [
        "firstName", "lastName", "email", "phone", "Joining Date", "status",
        "facebook", "instagram", "website", "notes",
    ];

    const renderField = (field) => {
        const isRequired = field === "firstName" || field === "phone" || field === "status";
        const fieldKey = field === "Joining Date" ? "joiningDate" : field;
        const fieldError = errors[fieldKey];

        return (
            <div key={field} className={`flex flex-col ${field === "notes" ? "sm:col-span-2" : ""}`}>
                <label className="block text-sm font-medium mb-1">
                    {t(field[0].toUpperCase() + field.slice(1))}
                    <span className={`${isRequired ? "text-red-500" : ""}`}>
                        {`${isRequired ? " *" : ""}`}
                    </span>
                </label>

                {field === "Joining Date" ? (
                    <div className="flex flex-col">
                        <DatePicker
                            selected={formState.joiningDate ? new Date(formState.joiningDate) : null}
                            onChange={(date) => {
                                setFormState({
                                    ...formState,
                                    joiningDate: date ? date.toISOString().split("T")[0] : "",
                                });
                                clearFieldError("joiningDate");
                            }}
                            className={`border p-2 w-full rounded cursor-pointer ${fieldError ? "border-red-500" : ""}`}
                            dateFormat="yyyy-MM-dd"
                        />
                        {fieldError && (
                            <p className="text-red-500 text-xs mt-1">{fieldError}</p>
                        )}
                    </div>
                ) : field === "status" ? (
                    <div className="flex flex-col">
                        <select
                            className={`border p-2 w-full rounded ${fieldError ? "border-red-500" : ""}`}
                            value={getStatusName(formState.status)}
                            onChange={e => {
                                setFormState({ ...formState, status: e.target.value });
                                clearFieldError("status");
                            }}
                        >
                            <option value="" disabled hidden>{t("Select status")}</option>
                            {(activeStatusesState?.items || []).map((s) => (
                                <option key={s.id} value={s.name}>{t(s.name)}</option>
                            ))}
                        </select>
                        {fieldError && (
                            <p className="text-red-500 text-xs mt-1">{fieldError}</p>
                        )}
                    </div>
                ) : field === "notes" ? (
                    <div className="flex flex-col">
                        <textarea
                            className={`border p-2 w-full rounded min-h-[100px] ${fieldError ? "border-red-500" : ""}`}
                            value={formState[field] || ""}
                            onChange={e => {
                                setFormState({ ...formState, [field]: e.target.value });
                                clearFieldError(field);
                            }}
                        />
                        {fieldError && (
                            <p className="text-red-500 text-xs mt-1">{fieldError}</p>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <input
                            type={field === "email" ? "email" : "text"}
                            className={`border p-2 w-full rounded ${fieldError ? "border-red-500" : ""}`}
                            value={formState[fieldKey] || ""}
                            onChange={e => {
                                setFormState({ ...formState, [fieldKey]: e.target.value });
                                clearFieldError(fieldKey);
                            }}
                        />
                        {fieldError && (
                            <p className="text-red-500 text-xs mt-1">{fieldError}</p>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex bg-black/50 text-gray-900">
            <div
                className="
                relative
                flex h-full w-full flex-col
                bg-white shadow-lg
                rounded-none
                sm:rounded-lg
                sm:max-w-md sm:mx-auto sm:my-8 sm:max-h-[85vh]
                p-4 sm:p-6
            "
            >
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
                    onClick={onClose}
                >
                    <IoMdClose size={25} />
                </button>

                <h2 className="text-lg sm:text-xl font-semibold mb-4">
                    {editingId ? t(`edit.${title.toLowerCase()}`): t(`add.${title.toLowerCase()}`)}
                </h2>

                <div className="flex-1 overflow-y-auto pr-1">
                    {/* General form error */}
                    {(errors._form || errors._error) && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {errors._form || errors._error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {fields.map(renderField)}
                    </div>
                </div>

                <button
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSave}
                    disabled={!formState.firstName || !formState.phone || !formState.status}
                >
                    {editingId ? t("Update") : t("Save")}
                </button>
            </div>
        </div>
    );
}