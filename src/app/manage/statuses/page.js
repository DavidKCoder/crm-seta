"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import DealStatusManager from "@/components/DealStatusManager";
import { dealsData } from "@/constants";

export default function ManageStatusesPage() {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{t("Manage statuses")}</h1>
                <button
                    className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg cursor-pointer"
                    onClick={() => router.back()}
                >
                    {t("Back")}
                </button>
            </div>
            <DealStatusManager show={true} onClose={() => router.back()} deals={dealsData} />
        </div>
    );
}
