"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { apiPut } from "@/lib/apiClient";

export default function AdminInfoPage() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const authUser = useSelector((state) => state.auth?.user);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (authUser) {
            setFirstName(authUser.firstName || "");
            setLastName(authUser.lastName || "");
        }
    }, [authUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!authUser?.id) {
            setError(t("User not loaded"));
            return;
        }
        if (!firstName.trim() || !lastName.trim()) {
            setError(t("First and last name are required"));
            return;
        }
        try {
            setSubmitting(true);
            setError("");
            setSuccess("");

            await apiPut(`/api/users/${authUser.id}`, {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
            });

            setSuccess(t("Profile updated successfully"));

            try {
                dispatch({
                    type: "auth/updateUserProfileNames",
                    payload: { firstName: firstName.trim(), lastName: lastName.trim() },
                });
            } catch (e) {
            }
        } catch (err) {
            console.error("Error updating profile", err);
            setError(err?.message || t("Failed to update profile"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl bg-white rounded-lg shadow p-6 text-black">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">{t("My Info")}</h1>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("First Name")} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("Last Name")} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className={`px-4 py-2 rounded-md text-white ${
                        submitting ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer`}
                >
                    {submitting ? t("Saving...") : t("Save Changes")}
                </button>
            </form>
        </div>
    );
}
