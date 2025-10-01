"use client";

import { useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FiMail, FiEdit2, FiTrash, FiPhone } from "react-icons/fi";
import { getStatusColor } from "@/constants/colors/statusColors";
import { TbCurrencyDram } from "react-icons/tb";
import { DealAvatar } from "@/app/deals/components/DealAvatar";

export function DealActions({ deal, st, handleEdit, handleDelete }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div
            key={deal.id}
            className={`group bg-white rounded-lg shadow p-2 flex flex-col gap-2 hover:bg-gray-50 cursor-pointer ${getStatusColor(st)}`}
        >
            <div className="flex justify-between items-center relative">
                <div className="flex flex-col space-y-1 w-full">
                    <div className="text-gray-800 font-medium flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1">
                            <DealAvatar deal={deal} />
                            <span className="truncate max-w-[200px]">{deal.name}</span>
                        </div>
                        <div className="relative">
                            <BiDotsVerticalRounded
                                className="cursor-pointer hover:text-purple-600"
                                onClick={() => setMenuOpen((prev) => !prev)}
                            />
                            {menuOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-20 cursor-pointer">
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
                                        <FiMail size={14} /> Email
                                    </button>
                                    <button
                                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-left cursor-pointer"
                                        onClick={() => {
                                            handleEdit(deal);
                                            setMenuOpen(false);
                                        }}
                                    >
                                        <FiEdit2 size={14} /> Edit
                                    </button>
                                    <button
                                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-600 cursor-pointer"
                                        onClick={() => {
                                            handleDelete(deal.id);
                                            setMenuOpen(false);
                                        }}
                                    >
                                        <FiTrash size={14} /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <hr className="border-gray-300 my-1 w-auto" />
                    <div className="flex items-center gap-1 text-gray-400 font-medium text-sm">
                        <FiPhone size={14} /> {deal.phone}
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 font-medium text-sm">
                        <FiMail size={14} /> {deal.email}
                    </div>
                    <span className="text-gray-700 text-sm flex items-center gap-1">
                        {Number(deal.value).toLocaleString("en-IN")} <TbCurrencyDram />
                    </span>
                </div>
            </div>
        </div>
    );
}
