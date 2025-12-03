"use client";

import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { DealAvatar } from "@/app/deals/components/DealAvatar";

const currentUserBase = { name: "Guest", avatar: "https://i.pravatar.cc/32?img=14" };

export default function CurrentUser() {
    const authUser = useSelector((state) => state.auth?.user);
    const { role } = useCurrentUserRole();
    const router = useRouter();

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
    return (
        <div
            className="flex items-center h-10 rounded-md border border-transparent text-sm text-white transition-all shadow-sm hover:shadow-lg cursor-pointer"
            onClick={() => router.push("/admin/info")}
        >
            <div className="flex items-center gap-2 p-2">
                <DealAvatar deal={currentUser} />
                <div className="grid leading-tight">
                    <span className="text-gray-700 font-medium text-[16px]">{currentUser.name}</span>
                    <span className="text-gray-500 text-[14px]">{currentUser.role}</span>
                </div>
            </div>
        </div>
    );
}