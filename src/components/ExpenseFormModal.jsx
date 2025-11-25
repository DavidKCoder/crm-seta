// src/components/ExpenseFormModal.jsx
"use client";

import React, { useState, useEffect } from "react";
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
                                             roles = [],
                                             users = [],
                                         }) {
    const { t } = useTranslation();
    const [error, setError] = useState("");
    const createEmptyItem = () => ({ userId: "", roleId: "", amount: "" });
    const [items, setItems] = useState([createEmptyItem()]);

    // Initialize form with existing data when editing
    useEffect(() => {
        if (!show) return;

        if (formState.items && formState.items.length > 0) {
            setItems(
                formState.items.map(item => ({
                    userId: item.userId || item.user?.id || "",
                    roleId: item.roleId || item.statusId || "",
                    amount: item.amount ?? "",
                })),
            );
        } else {
            const resetItems = [createEmptyItem()];
            setItems(resetItems);
            setFormState(prev => ({
                ...prev,
                items: resetItems,
            }));
        }
    }, [show, formState.items]);

    const handleItemChange = (index, field, value) => {
        setItems(prevItems => {
            const newItems = prevItems.map((item, i) =>
                i === index ? { ...item, [field]: value } : item,
            );
            setFormState(prev => ({
                ...prev,
                items: newItems,
            }));
            return newItems;
        });
    };

    const addItem = () => {
        setItems(prevItems => {
            const newItems = [...prevItems, createEmptyItem()];
            setFormState(prev => ({
                ...prev,
                items: newItems,
            }));
            return newItems;
        });
    };

    const removeItem = (index) => {
        if (items.length > 1) {
            setItems(prevItems => {
                const newItems = prevItems.filter((_, i) => i !== index);
                setFormState(prev => ({
                    ...prev,
                    items: newItems,
                }));
                return newItems;
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // Validate form
        if (!formState.dealId) {
            setError(t("Please select a deal"));
            return;
        }

        const validItems = items.filter(
            (item) => item.userId && item.roleId && !isNaN(parseFloat(item.amount)),
        );

        if (validItems.length === 0) {
            setError(t("Please add at least one valid expense item with user and role"));
            return;
        }

        const assignedToUserIds = Array.from(new Set(validItems.map(item => item.userId))).filter(Boolean);

        if (assignedToUserIds.length === 0) {
            setError(t("Please select at least one user"));
            return;
        }

        // Prepare the data for submission
        const expenseData = {
            dealId: formState.dealId,
            items: validItems.map((item) => ({
                roleId: item.roleId,
                amount: parseFloat(item.amount),
            })),
            notes: formState.notes || "",
            assignedToUserIds,
        };

        onSave(expenseData);
    };

    const deriveRoleIdFromUser = (user) => {
        if (!user) return "";
        const userRoles = Array.isArray(user.roles) ? user.roles : [];
        if (userRoles.length === 0) return "";
        const primaryRole = userRoles[0];
        if (typeof primaryRole === "string") return primaryRole;
        if (primaryRole && typeof primaryRole === "object") {
            return primaryRole.id || primaryRole.roleId || "";
        }
        return "";
    };

    const handleUserSelect = (index, userId) => {
        const selectedUser = users.find((user) => String(user?.id) === String(userId));
        const derivedRoleId = deriveRoleIdFromUser(selectedUser);

        handleItemChange(index, "userId", userId);
        if (derivedRoleId) {
            handleItemChange(index, "roleId", derivedRoleId);
        }
    };

    const getRoleNameById = (roleId) => {
        if (!roleId) return "";
        const role = roles.find(role => String(role.id) === String(roleId) || String(role.roleId) === String(roleId));
        return role?.name || "";
    };

    const getUserDisplayName = (user) => {
        if (!user) return "";
        const firstName = user.firstName || "";
        const lastName = user.lastName || "";
        const email = user.email || "";
        const displayName = [firstName, lastName].filter(Boolean).join(" ").trim();
        return displayName || email || t("Unnamed User");
    };

    if (!show) return null;

    console.log("items", items);

    return (
        <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50 p-4 text-black">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <IoMdClose size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    {error && <div className="mb-4 text-red-500">{error}</div>}

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            {t("Deal")} <span className="text-red-500">*</span>
                        </label>
                        <DealDropdown
                            dealsList={dealsList}
                            formState={formState}
                            setFormState={setFormState}
                        />
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium">
                                {t("Expense Items")} <span className="text-red-500">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={addItem}
                                className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                {t("Add Item")}
                            </button>
                        </div>

                        {items.map((item, index) => (
                            <div key={index} className="flex flex-col gap-2 mb-4">
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <select
                                            value={item.userId}
                                            onChange={(e) => handleUserSelect(index, e.target.value)}
                                            className="border rounded px-3 py-2 w-full"
                                            required
                                        >
                                            <option value="">{t("Select user")}</option>
                                            {users.map((user) => {
                                                const inferredRoleId = deriveRoleIdFromUser(user);
                                                const roleName = getRoleNameById(inferredRoleId);
                                                return (
                                                    <option key={user.id} value={user.id}>
                                                        {getUserDisplayName(user)}{roleName ? ` (${roleName})` : ""}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <select
                                            value={item.roleId}
                                            onChange={(e) => handleItemChange(index, "roleId", e.target.value)}
                                            className="border rounded px-3 py-2 w-full text-gray-400"
                                            required
                                            disabled
                                        >
                                            <option value="">{t("Select role")}</option>
                                            {roles.map((role) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name} #{item.roleId}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="relative flex-1">
                                    <input
                                        type="number"
                                        value={item.amount}
                                        onChange={(e) =>
                                            handleItemChange(index, "amount", e.target.value)
                                        }
                                        placeholder={t("Amount")}
                                        className="border rounded px-3 py-2 w-full"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                    <TbCurrencyDram className="absolute right-3 top-3 text-gray-400" />
                                </div>
                                {items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="px-3 py-2 bg-red-500 text-white rounded self-start"
                                    >
                                        {t("Remove")}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            {t("Notes")}
                        </label>
                        <textarea
                            name="notes"
                            value={formState.notes || ""}
                            onChange={(e) =>
                                setFormState({ ...formState, notes: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded cursor-pointer"
                        >
                            {t("Cancel")}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
                        >
                            {t("Save")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}