"use client";

import { IoMdClose } from "react-icons/io";
import { FiPhone, FiMail, FiGlobe, FiInstagram, FiFacebook } from "react-icons/fi";
import { TbCurrencyDram } from "react-icons/tb";
import { useTranslation } from "react-i18next";

export function DealDetailsModal({ deal, onClose }) {
    const { t } = useTranslation();

    if (!deal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
                    onClick={onClose}
                >
                    <IoMdClose size={25} />
                </button>

                <h2 className="text-xl font-semibold mb-4">{deal.name}</h2>

                <div className="space-y-3 text-gray-800">
                    <div className="flex items-center gap-2">
                        <FiPhone /> {deal.phone}
                    </div>
                    <div className="flex items-center gap-2">
                        <FiMail /> {deal.email}
                    </div>
                    {deal.website && (
                        <div className="flex items-center gap-2">
                            <FiGlobe /> <a href={deal.website} target="_blank" className="text-blue-600 underline">{deal.website}</a>
                        </div>
                    )}
                    {deal.instagram && (
                        <div className="flex items-center gap-2">
                            <FiInstagram /> <a href={deal.instagram} target="_blank" className="text-pink-600">@{deal.instagram}</a>
                        </div>
                    )}
                    {deal.facebook && (
                        <div className="flex items-center gap-2">
                            <FiFacebook /> <a href={deal.facebook} target="_blank" className="text-blue-600">{deal.facebook}</a>
                        </div>
                    )}

                    <div className="flex items-center gap-1">
                        <strong>{t("Amount")}:</strong> {Number(deal.value).toLocaleString("en-US")} <TbCurrencyDram />
                    </div>

                    <div>
                        <strong>{t("Status")}:</strong> {deal.status}
                    </div>

                    {deal.notes && (
                        <div>
                            <strong>{t("Notes")}:</strong> {deal.notes}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
