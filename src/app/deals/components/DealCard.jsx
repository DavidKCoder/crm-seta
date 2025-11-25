"use client";

import { useState, useEffect, useRef } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FiMail, FiEdit2, FiTrash, FiPhone, FiUserPlus } from "react-icons/fi";
import { DealAvatar } from "@/app/deals/components/DealAvatar";
import { useTranslation } from "react-i18next";
import { DealDetailsModal } from "@/app/deals/components/DealDetailsModal";
import { useDealStatuses } from "@/components/DealStatusesProvider";
import { TbBuildingStore, TbUserBolt } from "react-icons/tb";
import { PiHandshake } from "react-icons/pi";

export function DealCard({ deal, st, handleEdit, handleDelete }) {
    const { t } = useTranslation();
    const { getStatusStyle } = useDealStatuses();
    const [menuOpen, setMenuOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const menuRef = useRef(null);
    const assignedUsers = Array.isArray(deal?.assignedUsers) && deal.assignedUsers.length > 0
        ? deal.assignedUsers
        : (deal?.assignedTo ? [deal.assignedTo].filter(Boolean) : []);
    const assignedNames = assignedUsers.map((user) => {
        const firstName = user?.firstName || "";
        const lastName = user?.lastName || "";
        const fallback = user?.name || user?.email || "";
        const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
        return fullName || fallback;
    }).filter(Boolean);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    console.log("Deal: ", deal);

    const isCampaign = deal?.entity?.type === "campaign";

    return (
        <>
            <div
                key={deal.id}
                className={`group bg-white rounded-lg shadow p-2 flex flex-col gap-2 hover:bg-gray-50 ${getStatusStyle(st)}`}
            >
                <div className="flex justify-between items-center relative">
                    <div className="flex flex-col space-y-1 w-full">
                        <div className="text-gray-800 font-medium flex items-center justify-between gap-1">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => setDetailsOpen(true)}
                            >
                                <div
                                    className="flex items-center gap-1 bg-purple-100 text-purple-800 font-medium p-1 rounded-sm border border-purple-400"
                                >
                                    <PiHandshake className="text-purple-800" size={18} />
                                    <span>{deal?.name}</span>
                                </div>
                            </div>

                            <div className="relative" ref={menuRef}>
                                <BiDotsVerticalRounded
                                    className="cursor-pointer hover:text-purple-600"
                                    onClick={() => setMenuOpen((prev) => !prev)}
                                />
                                {menuOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-auto bg-white border rounded shadow-lg z-20 cursor-pointer">
                                        <button
                                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-left cursor-pointer"
                                            onClick={() => {
                                                handleEdit(deal);
                                                setMenuOpen(false);
                                            }}
                                        >
                                            <FiEdit2 size={14} /> {t("Edit")}
                                        </button>
                                        <button
                                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-left cursor-pointer"
                                            onClick={() => {
                                                window.open(
                                                    `https://mail.google.com/mail/?view=cm&to=${deal.email}`,
                                                    "_blank",
                                                );
                                                setMenuOpen(false);
                                            }}
                                        >
                                            <FiMail size={14} /> {t("Email")}
                                        </button>
                                        <button
                                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-600 cursor-pointer"
                                            onClick={() => {
                                                handleDelete(deal.id);
                                                setMenuOpen(false);
                                            }}
                                        >
                                            <FiTrash size={14} /> {t("Delete")}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <hr className="border-gray-300 my-1 w-auto" />
                        <div className="flex items-center gap-1 text-gray-400 font-medium text-sm">
                            {isCampaign ? <TbBuildingStore size={15} /> : <TbUserBolt size={15} />} {deal?.entity?.name}
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 font-medium text-sm">
                            <FiPhone size={15} /> {deal.phone}
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 font-medium text-sm">
                            <FiMail size={15} /> {deal.email}
                        </div>
                        <div className="flex items-baseline gap-2 text-gray-500 text-sm">
                            {assignedUsers.length > 0 ? (
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="flex -space-x-2 rtl:space-x-reverse">
                                        {assignedUsers.map((user, index) => (
                                            <div key={user.id || user.email || `assigned-user-${index}`}>
                                                <DealAvatar deal={user} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {assignedNames.join(", ")}
                                    </div>
                                </div>
                            ) : (
                                <span className="text-xs text-gray-400">{t("No assigned users")}</span>
                            )}
                        </div>
                        <div className="text-gray-700 flex items-center gap-1">
                        <span
                            className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm border border-purple-400">
                            #{deal.id.slice(0, 8)}
                        </span>
                            {deal.isFinished && (
                                <span
                                    className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-sm border border-green-400">
                                ✓ {t("Is Finished")}
                            </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {detailsOpen && (
                <DealDetailsModal
                    deal={deal}
                    onClose={() => setDetailsOpen(false)}
                />
            )}
        </>
    );
}
