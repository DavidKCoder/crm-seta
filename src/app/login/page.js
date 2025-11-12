"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useRoles } from "@/components/RolesProvider";

export default function LoginPage() {
    const router = useRouter();
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { roles } = useRoles();
    const roleOptions = Object.keys(roles || {});
    const [selectedRole, setSelectedRole] = useState(
        (typeof window !== "undefined" && localStorage.getItem("auth_role")) || roleOptions[0] || "Admin"
    );
    const [error, setError] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError(t("Please fill in all fields"));
            return;
        }
        try {
            localStorage.setItem("auth_user", JSON.stringify({ email }));
            localStorage.setItem("is_authenticated", "1");
            localStorage.setItem("auth_role", selectedRole);
            document.cookie = `auth=1; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
        } catch {}
        router.push("/deals");
    };

    return (
        <div className="flex w-full h-full items-center justify-center">
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-6 shadow">
                <h1 className="text-2xl font-semibold text-gray-900 mb-4">{t("Log in")}</h1>
                <form onSubmit={onSubmit} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">{t("Email")}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full border rounded px-3 py-2"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">{t("Password")}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full border rounded px-3 py-2"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">{t("Role")}</label>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 bg-white"
                        >
                            {roleOptions.length === 0 && (
                                <option value="Admin">{t("Select role")}: Admin</option>
                            )}
                            {roleOptions.map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>
                    {error && <div className="text-red-600 text-sm">{error}</div>}
                    <button
                        type="submit"
                        className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                    >
                        {t("Sign in")}
                    </button>
                </form>
            </div>
        </div>
    );
}
