import { IoMdClose } from "react-icons/io";
import { FiPhone, FiMail, FiGlobe, FiInstagram, FiFacebook, FiUserPlus } from "react-icons/fi";
import { TbCurrencyDram } from "react-icons/tb";
import { useTranslation } from "react-i18next";

export function DealDetailsModal({ deal, onClose }) {
    const { t } = useTranslation();
    const assignedUsers = Array.isArray(deal?.assignedUsers) && deal.assignedUsers.length > 0
        ? deal.assignedUsers
        : (deal?.assignedTo ? [deal.assignedTo].filter(Boolean) : []);

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

                <h2 className="text-xl text-black font-semibold mb-4">{deal.name}</h2>

                <div className="space-y-3 text-gray-800">
                    <div className="flex items-center gap-2">
                        <FiPhone /> {deal.phone}
                    </div>
                    <div className="flex items-center gap-2">
                        <FiMail /> {deal.email}
                    </div>
                    {deal?.website && (
                        <div className="flex items-center gap-2">
                            <FiGlobe /> <a href={deal.website} target="_blank" rel="noreferrer" className="text-blue-600 underline">{deal.website}</a>
                        </div>
                    )}
                    {deal?.instagram && (
                        <div className="flex items-center gap-2">
                            <FiInstagram /> <a href={deal.instagram} target="_blank" rel="noreferrer" className="text-pink-600">@{deal.instagram}</a>
                        </div>
                    )}
                    {deal?.facebook && (
                        <div className="flex items-center gap-2">
                            <FiFacebook /> <a href={deal.facebook} target="_blank" rel="noreferrer" className="text-blue-600">{deal.facebook}</a>
                        </div>
                    )}

                    <div className="flex items-center gap-1">
                        <strong>{t("Amount")}:</strong> {Number(deal.value).toLocaleString("en-US")} <TbCurrencyDram />
                    </div>

                    <div>
                        <strong>{t("Status")}:</strong> {deal.status?.name}
                    </div>

                    {assignedUsers.length > 0 && (
                        <div className="flex items-start gap-2">
                            <FiUserPlus className="mt-1" />
                            <div>
                                <strong>{t("Assigned Users")}:</strong>
                                <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                                    {assignedUsers.map((user, index) => {
                                        const firstName = user?.firstName || "";
                                        const lastName = user?.lastName || "";
                                        const fallback = user?.name || user?.email || "";
                                        const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
                                        const displayName = fullName || fallback || t("Unnamed User");
                                        return <li key={user.id || `assigned-user-${index}`}>{displayName}</li>;
                                    })}
                                </ul>
                            </div>
                        </div>
                    )}

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
