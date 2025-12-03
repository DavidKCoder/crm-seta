"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import Sidebar from "@/components/Sidebar";
import ThemeSwitch from "@/components/ThemeSwitch";
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
        dispatch(me());
    }, [dispatch]);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-4 light flex flex-col">
                <div className="flex justify-end items-center mb-4 rounded-lg bg-gray-100 p-1.5">
                    <div className="flex items-stretch gap-2">
                        <ThemeSwitch />
                        <CurrentUser />
                    </div>
                </div>
                <div className="bg-gray-100 p-2 rounded-md">
                    {children}
                </div>
            </main>
        </div>
    );
}
