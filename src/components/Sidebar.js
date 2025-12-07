"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../../public/seta_logo.png";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { TbUserDollar } from "react-icons/tb";
import {
    AiOutlineUser,
    AiOutlineRocket,
    AiOutlineDollarCircle,
    AiOutlineGift,
    AiOutlineBarChart,
    AiOutlineDashboard,
    AiOutlineLogout,
} from "react-icons/ai";
import { useCanAccess } from "@/hooks/useCanAccess";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";

export default function Sidebar() {
    const { t, i18n } = useTranslation();
    const { role } = useCurrentUserRole();
    const { canAccess } = useCanAccess();

    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const sidebarWidth = collapsed ? 80 : Math.max(300, windowWidth * 0.15);

    const handleLogout = async () => {
        try {
            await dispatch(logout());
        } catch {
        }

        try {
            if (typeof window !== "undefined") {
                localStorage.removeItem("auth_role");
                localStorage.removeItem("auth_user");
            }
        } catch {
        }

        try {
            router.push("/login");
        } catch {
        }
    };

    const links = [
        { href: "/clients", label: t("Clients"), icon: <AiOutlineUser size={20} /> },
        { href: "/campaign", label: t("Campaign"), icon: <AiOutlineRocket size={20} /> },
        { href: "/deals", label: t("Deals"), icon: <AiOutlineDollarCircle size={20} /> },
        { href: "/expenses", label: t("Expenses"), icon: <TbUserDollar size={20} /> },
        { href: "/packages", label: t("Packages"), icon: <AiOutlineGift size={20} /> },
        { href: "/statistics", label: t("Statistics"), icon: <AiOutlineBarChart size={20} /> },
    ];

    const visibleLinks = links.filter(link => {
        const resourceKey = link.href.replace("/", ""); // "/deals" -> "deals"
        return canAccess(role, resourceKey);
    });

    return (
        <div
            className="shadow-md min-h-screen rounded-r-2xl flex flex-col transition-all duration-300 relative flex-shrink-0"
            style={{ width: `${sidebarWidth}px` }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                {!collapsed && (
                    <div className="flex items-center gap-1 bg-white rounded-md">
                        <Image src={logo} alt="logo" width={80} height={80} className="rounded-full" />
                    </div>
                )}
                <h1 className="text-2xl font-bold">CRM</h1>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="cursor-pointer"
                >
                    {collapsed ? <IoIosArrowDropright size={20} /> : <IoIosArrowDropleft size={20} />}
                </button>
            </div>

            {/* Links */}
            <ul className="mt-4 flex flex-col gap-3">
                {visibleLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <li key={link.href} className="relative group">
                            <Link
                                href={link.href}
                                className={`flex items-center gap-3 p-3 rounded-md transition-colors duration-200 font-bold ${
                                    isActive ? "bg-purple-400 text-white" : "hover:bg-purple-400 hover:text-white"
                                }`}
                            >
                                {link.icon}
                                {!collapsed && <span>{link.label}</span>}
                            </Link>
                            {collapsed && (
                                <span
                                    className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50"
                                >
                          {link.label}
                        </span>
                            )}
                        </li>
                    );
                })}
                {/* Manage links removed from navbar by request */}
                {canAccess(role, "admin.dashboard") && (
                    <li className="relative group">
                        <Link
                            href="/admin"
                            className={`flex items-center gap-3 p-3 rounded-md transition-colors duration-200 font-bold ${
                                pathname === "/admin" ? "bg-purple-400 text-white" : "hover:bg-purple-400 hover:text-white"
                            }`}
                        >
                            <AiOutlineDashboard size={20} />
                            {!collapsed && <span>{t("Admin Dashboard")}</span>}
                        </Link>
                    </li>
                )}
            </ul>

            <div className="mt-auto p-4 flex flex-col gap-3">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-md transition-colors duration-200 font-bold hover:bg-purple-400 hover:text-white cursor-pointer"
                >
                    <AiOutlineLogout size={20} />
                    {!collapsed && <span>{t("Log out")}</span>}
                </button>

                {/* Switch language внизу */}
                <LanguageSwitcher collapsed={collapsed} />
            </div>
        </div>

    );
}
