"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../../public/seta_logo.PNG";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";

import {
    AiOutlineUser,
    AiOutlineRocket,
    AiOutlineDollarCircle,
    AiOutlineGift,
    AiOutlineBarChart,
} from "react-icons/ai";
import { canAccess } from "@/app/utils/roles";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const USER_ROLE = process.env.NEXT_PUBLIC_CURRENT_USER;

export default function Sidebar() {
    const { t, i18n } = useTranslation();

    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const sidebarWidth = collapsed ? 80 : Math.max(300, windowWidth * 0.15);

    const links = [
        { href: "/clients", label: t("Clients"), icon: <AiOutlineUser size={20} /> },
        { href: "/campaign", label: t("Campaign"), icon: <AiOutlineRocket size={20} /> },
        { href: "/deals", label: t("Deals"), icon: <AiOutlineDollarCircle size={20} /> },
        { href: "/packages", label: t("Packages"), icon: <AiOutlineGift size={20} /> },
        { href: "/statistics", label: t("Statistics"), icon: <AiOutlineBarChart size={20} /> },
    ];

    const visibleLinks = links.filter(link => {
        const resourceKey = link.href.replace("/", ""); // "/deals" -> "deals"
        return canAccess(USER_ROLE, resourceKey);
    });

    return (
        <div
            className="shadow-md min-h-screen rounded-r-2xl flex flex-col transition-all duration-300 relative flex-shrink-0"
            style={{ width: `${sidebarWidth}px` }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                {!collapsed && (
                    <div className="flex items-center gap-1">
                        <Image src={logo} alt="logo" width={80} height={80} className="rounded-full" />
                        <h1 className="text-xl font-bold">CRM</h1>
                    </div>
                )}
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
            </ul>

            {/* Switch language внизу */}
            <LanguageSwitcher collapsed={collapsed} />
        </div>

    );
}
