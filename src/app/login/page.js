"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useRoles } from "@/components/RolesProvider";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/features/auth/authSlice";

export default function LoginPage() {
    const router = useRouter();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const authStatus = useSelector((state) => state.auth.status);
    const authError = useSelector((state) => state.auth.error);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { roles } = useRoles();
    const roleOptions = Object.keys(roles || {});
    const [error, setError] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError(t("Please fill in all fields"));
            return;
        }

        try {
            const action = await dispatch(login({ email, password }));
            if (login.rejected.match(action)) {
                const message = action.payload || action.error?.message || t("Login failed");
                setError(message);
                return;
            }
            router.push("/deals");
        } catch (err) {
            setError(err?.message || t("Login failed"));
        }
    };

    return (
        <div className="flex w-full h-full items-center justify-center">
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-6 shadow">
                <div className="flex flex-col items-center mb-4">
                    <Image src="/seta_logo.PNG" alt="Logo" width={80} height={80} className="mb-2" />
                    <h1 className="text-2xl font-semibold text-gray-900">{t("Log in")}</h1>
                </div>
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
                    {error && (
                        <div className="mt-2 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer disabled:opacity-60"
                        disabled={authStatus === "loading"}
                    >
                        {authStatus === "loading" ? t("Signing in...") : t("Sign in")}
                    </button>
                </form>
            </div>
        </div>
    );
}
