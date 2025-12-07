"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { login, forgotPassword, resetPassword } from "@/features/auth/authSlice";
import { IoEyeOffOutline, IoEyeOff } from "react-icons/io5";

export default function LoginPage() {
    const router = useRouter();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const authStatus = useSelector((state) => state.auth.status);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false); // new state
    const [forgotMode, setForgotMode] = useState(null); // null | "email" | "reset"
    const [forgotEmail, setForgotEmail] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [resetNewPassword, setResetNewPassword] = useState("");
    const [forgotMessage, setForgotMessage] = useState("");
    const [forgotError, setForgotError] = useState("");
    const [forgotLoading, setForgotLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);

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

    const onForgotSubmit = async (e) => {
        e.preventDefault();
        setForgotError("");
        setForgotMessage("");

        const targetEmail = forgotEmail || email;
        if (!targetEmail) {
            setForgotError(t("Please enter your email"));
            return;
        }

        try {
            setForgotLoading(true);
            const action = await dispatch(
                forgotPassword({
                    email: targetEmail,
                })
            );
            if (forgotPassword.rejected.match(action)) {
                const message = action.payload || action.error?.message || t("Failed to send reset instructions");
                setForgotError(message);
                return;
            }
            setForgotMessage(t("If an account exists with this email, we have sent password reset instructions."));
        } catch (err) {
            setForgotError(err?.message || t("Failed to send reset instructions"));
        } finally {
            setForgotLoading(false);
        }
    };

    const onResetSubmit = async (e) => {
        e.preventDefault();
        setForgotError("");
        setForgotMessage("");

        if (!resetToken || !resetNewPassword) {
            setForgotError(t("Please provide token and new password"));
            return;
        }

        try {
            setResetLoading(true);
            const action = await dispatch(resetPassword({ token: resetToken, newPassword: resetNewPassword }));
            if (resetPassword.rejected.match(action)) {
                const message = action.payload || action.error?.message || t("Failed to reset password");
                setForgotError(message);
                return;
            }
            setForgotMessage(t("Your password has been reset. You can now sign in with your new password."));
            setResetToken("");
            setResetNewPassword("");
            setForgotMode(null);
        } catch (err) {
            setForgotError(err?.message || t("Failed to reset password"));
        } finally {
            setResetLoading(false);
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
                            className="mt-1 w-full border rounded px-3 py-2 text-black"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">{t("Password")}</label>
                        <div className="mt-1 relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border rounded px-3 py-2 pr-10 text-black"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer text-black "
                            >
                                {showPassword ? <IoEyeOff size={20} /> : <IoEyeOffOutline size={20}/>}
                            </button>
                        </div>
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
                {/*<div className="mt-4 border-t border-gray-200 pt-3 text-sm text-gray-700">*/}
                {/*    <div className="flex items-center justify-between mb-2">*/}
                {/*        <span>{t("Forgot your password?")}</span>*/}
                {/*        <div className="flex gap-2">*/}
                {/*            <button*/}
                {/*                type="button"*/}
                {/*                onClick={() => setForgotMode("email")}*/}
                {/*                className="text-purple-600 hover:underline"*/}
                {/*            >*/}
                {/*                {t("Send reset link")}*/}
                {/*            </button>*/}
                {/*            <button*/}
                {/*                type="button"*/}
                {/*                onClick={() => setForgotMode("reset")}*/}
                {/*                className="text-purple-600 hover:underline"*/}
                {/*            >*/}
                {/*                {t("Have a token?")}*/}
                {/*            </button>*/}
                {/*        </div>*/}
                {/*    </div>*/}

                {/*    {forgotMode === "email" && (*/}
                {/*        <form onSubmit={onForgotSubmit} className="flex flex-col gap-2 mt-2">*/}
                {/*            <label className="text-xs text-gray-600">{t("Email for reset link")}</label>*/}
                {/*            <input*/}
                {/*                type="email"*/}
                {/*                value={forgotEmail}*/}
                {/*                onChange={(e) => setForgotEmail(e.target.value)}*/}
                {/*                className="w-full border rounded px-3 py-2 text-black"*/}
                {/*                placeholder={t("name@example.com")}*/}
                {/*            />*/}
                {/*            <button*/}
                {/*                type="submit"*/}
                {/*                className="bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-md text-sm cursor-pointer disabled:opacity-60 self-start"*/}
                {/*                disabled={forgotLoading}*/}
                {/*            >*/}
                {/*                {forgotLoading ? t("Sending...") : t("Send instructions")}*/}
                {/*            </button>*/}
                {/*        </form>*/}
                {/*    )}*/}

                {/*    {forgotMode === "reset" && (*/}
                {/*        <form onSubmit={onResetSubmit} className="flex flex-col gap-2 mt-2">*/}
                {/*            <label className="text-xs text-gray-600">{t("Reset token")}</label>*/}
                {/*            <input*/}
                {/*                type="text"*/}
                {/*                value={resetToken}*/}
                {/*                onChange={(e) => setResetToken(e.target.value)}*/}
                {/*                className="w-full border rounded px-3 py-2 text-black"*/}
                {/*                placeholder={t("Paste the token from email")}*/}
                {/*            />*/}
                {/*            <label className="text-xs text-gray-600">{t("New password")}</label>*/}
                {/*            <input*/}
                {/*                type="password"*/}
                {/*                value={resetNewPassword}*/}
                {/*                onChange={(e) => setResetNewPassword(e.target.value)}*/}
                {/*                className="w-full border rounded px-3 py-2 text-black"*/}
                {/*                placeholder={t("Enter new password")}*/}
                {/*            />*/}
                {/*            <button*/}
                {/*                type="submit"*/}
                {/*                className="bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-md text-sm cursor-pointer disabled:opacity-60 self-start"*/}
                {/*                disabled={resetLoading}*/}
                {/*            >*/}
                {/*                {resetLoading ? t("Resetting...") : t("Reset password")}*/}
                {/*            </button>*/}
                {/*        </form>*/}
                {/*    )}*/}

                {/*    {(forgotMessage || forgotError) && (*/}
                {/*        <div*/}
                {/*            className={`mt-3 rounded-md px-3 py-2 text-sm ${*/}
                {/*                forgotError*/}
                {/*                    ? "bg-red-50 border border-red-200 text-red-700"*/}
                {/*                    : "bg-green-50 border border-green-200 text-green-700"*/}
                {/*            }`}*/}
                {/*        >*/}
                {/*            {forgotError || forgotMessage}*/}
                {/*        </div>*/}
                {/*    )}*/}
                {/*</div>*/}
            </div>
        </div>
    );
}