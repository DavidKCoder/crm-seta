import { IoMdClose } from "react-icons/io";
import {
    FiPhone,
    FiMail,
    FiGlobe,
    FiInstagram,
    FiFacebook,
    FiUserPlus,
} from "react-icons/fi";
import { TbCurrencyDram } from "react-icons/tb";
import { useTranslation } from "react-i18next";

export function DealDetailsModal({ deal, onClose }) {
    const { t } = useTranslation();

    if (!deal) return null;

    const assignedUsers =
        Array.isArray(deal?.assignedUsers) && deal.assignedUsers.length > 0
            ? deal.assignedUsers
            : deal?.assignedTo
                ? [deal.assignedTo].filter(Boolean)
                : [];

    const createdBy = deal.createdBy;

    const formatUserName = (user) => {
        if (!user) return "";
        const firstName = user.firstName || "";
        const lastName = user.lastName || "";
        const full = [firstName, lastName].filter(Boolean).join(" ").trim();
        return full || user.name || user.email || "";
    };

    const formatDate = (value) => {
        if (!value) return "";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return "";
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatDateTime = (value) => {
        if (!value) return "";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return "";
        return d.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const amountLabel =
        typeof deal.value === "number"
            ? deal.value.toLocaleString("en-US")
            : String(deal.value || "");

    const currency = deal.currency || "AMD";

    const statusColor =
        deal.status?.colorHex && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(deal.status.colorHex)
            ? deal.status.colorHex
            : "#2563eb";

    return (
        <div className="fixed inset-0 z-50 flex bg-black/50 text-gray-900">
            <div
                className="
          relative
          flex h-full w-full flex-col
          bg-white shadow-lg
          rounded-none
          sm:rounded-lg
          sm:max-w-2xl sm:mx-auto sm:my-8 sm:max-h-[85vh]
          p-4 sm:p-6
        "
            >
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
                    onClick={onClose}
                >
                    <IoMdClose size={25} />
                </button>

                {/* Header */}
                <div className="mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-black truncate">
                        {deal.name}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                        {deal.status?.name && (
                            <span
                                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white"
                                style={{ backgroundColor: statusColor }}
                            >
                {t("Status")}: {deal.status.name}
              </span>
                        )}
                        {deal.entity?.name && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {t("Client")}: {deal.entity.name}
              </span>
                        )}
                    </div>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-6 text-sm text-gray-800">
                    {/* Amount & Dates */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                            <div className="text-xs font-medium text-gray-500 mb-1">
                                {t("Amount")}
                            </div>
                            <div className="flex items-center gap-1 text-base font-semibold">
                                {amountLabel}
                                <span className="text-xs font-normal text-gray-500">
                  {currency}
                </span>
                                <TbCurrencyDram className="text-gray-400" />
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 space-y-1">
                            <div className="flex justify-between gap-2">
                <span className="text-xs font-medium text-gray-500">
                  {t("Joining Date")}
                </span>
                                <span className="text-xs text-gray-800">
                  {formatDate(deal.joiningDate)}
                </span>
                            </div>
                            <div className="flex justify-between gap-2">
                <span className="text-xs font-medium text-gray-500">
                  {t("Start Date")}
                </span>
                                <span className="text-xs text-gray-800">
                  {formatDate(deal.startDate)}
                </span>
                            </div>
                            <div className="flex justify-between gap-2">
                <span className="text-xs font-medium text-gray-500">
                  {t("End Date")}
                </span>
                                <span className="text-xs text-gray-800">
                  {formatDate(deal.endDate)}
                </span>
                            </div>
                        </div>
                    </section>

                    {/* Created / meta info */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                            <div className="text-xs font-medium text-gray-500 mb-1">
                                {t("Created By")}
                            </div>
                            <div className="text-sm">
                                {formatUserName(createdBy) || "—"}
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 space-y-1">
                            <div className="flex justify-between gap-2">
                <span className="text-xs font-medium text-gray-500">
                  {t("Created At")}
                </span>
                                <span className="text-xs text-gray-800">
                  {formatDateTime(deal.createdAt)}
                </span>
                            </div>
                            <div className="flex justify-between gap-2">
                <span className="text-xs font-medium text-gray-500">
                  {t("Updated At")}
                </span>
                                <span className="text-xs text-gray-800">
                  {formatDateTime(deal.updatedAt)}
                </span>
                            </div>
                        </div>
                    </section>

                    {/* Contact & Social */}
                    <section className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900">
                            {t("Contact")}
                        </h3>
                        <div className="space-y-2">
                            {deal.phone && (
                                <div className="flex items-center gap-2">
                                    <FiPhone className="text-gray-500" />
                                    <span>{deal.phone}</span>
                                </div>
                            )}
                            {deal.email && (
                                <div className="flex items-center gap-2">
                                    <FiMail className="text-gray-500" />
                                    <a
                                        href={`mailto:${deal.email}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {deal.email}
                                    </a>
                                </div>
                            )}
                            {deal.website && (
                                <div className="flex items-center gap-2">
                                    <FiGlobe className="text-gray-500" />
                                    <a
                                        href={deal.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 hover:underline truncate"
                                    >
                                        {deal.website}
                                    </a>
                                </div>
                            )}
                            {deal.instagram && (
                                <div className="flex items-center gap-2">
                                    <FiInstagram className="text-pink-500" />
                                    <a
                                        href={deal.instagram}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-pink-600 hover:underline"
                                    >
                                        {deal.instagram.startsWith("@")
                                            ? deal.instagram
                                            : `@${deal.instagram}`}
                                    </a>
                                </div>
                            )}
                            {deal.facebook && (
                                <div className="flex items-center gap-2">
                                    <FiFacebook className="text-blue-600" />
                                    <a
                                        href={deal.facebook}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 hover:underline truncate"
                                    >
                                        {deal.facebook}
                                    </a>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Assigned users */}
                    {assignedUsers.length > 0 && (
                        <section>
                            <div className="flex items-start gap-2">
                                <FiUserPlus className="mt-1 text-gray-500" />
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        {t("Assigned Users")}
                                    </h3>
                                    <ul className="mt-1 list-disc list-inside text-sm text-gray-700">
                                        {assignedUsers.map((user, index) => {
                                            const displayName =
                                                formatUserName(user) || t("Unnamed User");
                                            return (
                                                <li key={user.id || `assigned-user-${index}`}>
                                                    {displayName}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Notes */}
                    {deal.notes && (
                        <section>
                            <h3 className="text-sm font-semibold text-gray-900">
                                {t("Notes")}
                            </h3>
                            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">
                                {deal.notes}
                            </p>
                        </section>
                    )}

                    {/* Attachments */}
                    {Array.isArray(deal.attachments) && deal.attachments.length > 0 && (
                        <section>
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">
                                {t("Attachments")}
                            </h3>
                            <ul className="space-y-1 text-sm text-blue-600">
                                {deal.attachments.map((att) => (
                                    <li key={att.id}>
                                        <a
                                            href={att.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="hover:underline"
                                        >
                                            {att.fileName || t("Attachment")}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}