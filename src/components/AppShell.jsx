"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import Sidebar from "@/components/Sidebar";
import ThemeSwitch from "@/components/ThemeSwitch";
import { HeadIconButton } from "@/components/HeaderIconButton";
import { IoNotificationsOutline } from "react-icons/io5";
import CurrentUser from "@/components/CurrentUser";
import { me } from "@/features/auth/authSlice";

export default function AppShell({ children }) {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const isAuthPage = pathname?.startsWith("/login");

    if (isAuthPage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                {children}
            </div>
        );
    }

    useEffect(() => {
        // Hydrate current user on non-auth pages if session cookie is present
        dispatch(me());
    }, [dispatch]);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-4 light flex flex-col bg-gray-100">
                <div className="flex justify-end items-center mb-4 rounded-lg bg-purple-50 p-1.5">
                    <div className="flex items-stretch gap-2">
                        <ThemeSwitch />
                        <div className="flex gap-2">
                            <HeadIconButton icon={IoNotificationsOutline} badge={5} />
                        </div>
                        <CurrentUser />
                    </div>
                </div>
                {children}
            </main>
        </div>
    );
}
