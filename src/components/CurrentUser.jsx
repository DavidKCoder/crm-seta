"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AiOutlineLogout } from "react-icons/ai";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { DealAvatar } from "@/app/deals/components/DealAvatar";
import { logout } from "@/features/auth/authSlice";

const currentUserBase = { name: "Guest", avatar: "https://i.pravatar.cc/32?img=14" };

export default function CurrentUser() {
    const { t } = useTranslation();
    const authUser = useSelector((state) => state.auth?.user);
    const { role } = useCurrentUserRole();
    const dispatch = useDispatch();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const hasName = authUser?.firstName || authUser?.lastName;
    const fullName = hasName
        ? `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim()
        : null;

    const name = fullName || authUser?.email || currentUserBase.name;

    const primaryRole = Array.isArray(authUser?.roles) && authUser.roles.length > 0
        ? (authUser.roles[0].name || authUser.roles[0])
        : null;

    const displayRole = primaryRole || role || "Guest";
    const avatar = currentUserBase.avatar;

    const currentUser = { name, avatar, role: displayRole };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

    const goToProfile = () => {
        setOpen(false);
        router.push("/admin/info");
    };

    const goToChangePassword = () => {
        setOpen(false);
        router.push("/change-password");
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center h-10 rounded-md border border-transparent text-sm text-white transition-all shadow-sm hover:shadow-lg cursor-pointer"
            >
                <div className="flex items-center gap-2 p-2">
                    <DealAvatar deal={currentUser} />
                    <div className="grid leading-tight text-left">
                        <span className="text-gray-700 font-medium text-[16px]">{currentUser.name}</span>
                        <span className="text-gray-500 text-[14px]">{currentUser.role}</span>
                    </div>
                </div>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 text-sm text-gray-800">
                    <button
                        type="button"
                        onClick={goToProfile}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                        {t("Profile")}
                    </button>
                    <button
                        type="button"
                        onClick={goToChangePassword}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                        {t("Change password")}
                    </button>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 border-t border-gray-100 flex items-center gap-2 cursor-pointer"
                    >
                        <AiOutlineLogout size={16} />
                        <span>{t("Log out")}</span>
                    </button>
                </div>
            )}
        </div>
    );
}