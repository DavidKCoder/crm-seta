"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { changePassword } from "@/features/auth/authSlice";

export default function ChangePasswordPage() {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError(t("Please fill in all fields"));
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(t("New password and confirmation do not match"));
            return;
        }

        try {
            setLoading(true);
            const action = await dispatch(changePassword({ currentPassword, newPassword }));
            if (changePassword.rejected.match(action)) {
                const message = action.payload || action.error?.message || t("Failed to change password");
                setError(message);
                return;
            }

            setSuccess(t("Your password has been changed successfully."));
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err?.message || t("Failed to change password"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full h-full items-center">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow">
                <h1 className="text-2xl font-semibold text-gray-900 mb-4">{t("Change password")}</h1>
                <form onSubmit={onSubmit} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">{t("Current password")}</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-black"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">{t("New password")}</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-black"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">{t("Confirm new password")}</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-black"
                        />
                    </div>

                    {error && (
                        <div className="mt-1 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mt-1 rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer disabled:opacity-60 self-start"
                        disabled={loading}
                    >
                        {loading ? t("Saving...") : t("Save")}
                    </button>
                </form>
            </div>
        </div>
    );
}
