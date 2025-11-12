"use client";

import { dealsData } from "@/constants";
import { useEffect, useState } from "react";
import { TbCurrencyDram } from "react-icons/tb";
import DealModal from "@/app/deals/components/DealModal";
import { StatusDropdown } from "@/app/deals/components/StatusDropdown";
import { useTranslation } from "react-i18next";
import { DealCard } from "@/app/deals/components/DealCard";
import { useDealStatuses } from "@/components/DealStatusesProvider";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { useRouter } from "next/navigation";

export default function DealsPageContent() {
    const { t } = useTranslation();
    const router = useRouter();
    const { getStatusesForRole, getStatusStyle } = useDealStatuses();
    const { role } = useCurrentUserRole();
    const availableStatuses = getStatusesForRole(role);
    const [deals, setDeals] = useState(dealsData);
    const [editingDeal, setEditingDeal] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        value: "",
        status: "New",
        instagram: "",
        facebook: "",
        website: "",
        notes: "",
        pdfFile: "",
        isFinished: false,
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedStatuses, setSelectedStatuses] = useState(availableStatuses);
    

    useEffect(() => {
        setSelectedStatuses(availableStatuses);
    }, [availableStatuses]);

    const handleAddOrUpdate = () => {
        if (editingDeal) {
            setDeals(
                deals.map((d) =>
                    d.id === editingDeal.id ? { ...d, ...formData } : d,
                ),
            );
        } else {
            setDeals([
                ...deals,
                {
                    id: Date.now(),
                    ...formData,
                },
            ]);
        }
        setFormData({
            name: "",
            email: "",
            value: "",
            status: "New",
            instagram: "",
            facebook: "",
            website: "",
            notes: "",
            pdfFile: "",
            isFinished: false,
        });
        setEditingDeal(null);
        setShowModal(false);
    };

    const handleEdit = (deal) => {
        setEditingDeal(deal);
        setFormData({
            name: deal.name,
            email: deal.email,
            value: deal.value,
            status: deal.status,
            instagram: deal.instagram,
            facebook: deal.facebook,
            website: deal.website,
            notes: deal.notes,
            pdfFile: deal.pdfFile,
            isFinished: deal.isFinished || false,
        });
        setShowModal(true);
    };

    const handleDelete = (id) => setDeals(deals.filter((d) => d.id !== id));

    const toggleStatus = (st) => {
        if (selectedStatuses.includes(st)) {
            setSelectedStatuses(selectedStatuses.filter((s) => s !== st));
        } else {
            setSelectedStatuses([...selectedStatuses, st]);
        }
    };

    return (
        <div className="p-0">
            <div className="flex justify-between items-center mb-6">
                <div className="flex justify-between items-center gap-5">
                    <h1 className="text-2xl font-bold text-gray-900">{t("Deals")}</h1>
                    <StatusDropdown
                        statuses={availableStatuses}
                        selectedStatuses={selectedStatuses}
                        toggleStatus={toggleStatus}
                        setSelectedStatuses={setSelectedStatuses}
                    />
                </div>

                <div className="flex gap-4 items-center flex-wrap">
                    {(role === "Admin" || role === "Manager") && (
                        <button
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                            onClick={() => {
                                setFormData({
                                    name: "",
                                    email: "",
                                    value: "",
                                    status: "New",
                                    instagram: "",
                                    facebook: "",
                                    website: "",
                                    notes: "",
                                    pdfFile: "",
                                    isFinished: false,
                                });
                                setShowModal(true);
                            }}
                        >
                            {t("Add")}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto">
                {availableStatuses
                    .filter((st) => selectedStatuses.includes(st))
                    .map((st, i) => {
                        const stageDeals = deals.filter((d) => d.status === st);
                        const totalValue = stageDeals.reduce(
                            (sum, d) => sum + Number(d.value),
                            0,
                        );

                        return (
                            <div
                                key={i}
                                className="min-w-max p-1 flex flex-col gap-3"
                            >
                                <h2 className="p-2 rounded-lg bg-white text-black border border-gray-300 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${getStatusStyle(st)}`}>{" "}</div>
                                        {st}
                                    </div>
                                    {stageDeals.length > 0 &&
                                        <div
                                            className={`text-gray-400 rounded-md px-2 py-0.5 text-xs ${getStatusStyle(st)}`}>
                                            {stageDeals.length} {t("deals")}
                                        </div>
                                    }
                                </h2>

                                {stageDeals.length > 0 && (
                                    <div
                                        className="border border-gray-50 bg-white shadow rounded-xl p-4 flex flex-col gap-3"
                                    >
                                        <div
                                            className="text-left text-sm font-bold flex items-center gap-1 text-gray-900"
                                        >
                                            {t("Total")}
                                            <div className="flex items-center">
                                                {totalValue.toLocaleString("en-US")} <TbCurrencyDram />
                                            </div>
                                            / {stageDeals.length} {t("deals")}
                                        </div>

                                        {stageDeals.map((deal, i) => (
                                            <DealCard
                                                key={i}
                                                deal={deal}
                                                st={st}
                                                handleEdit={handleEdit}
                                                handleDelete={handleDelete}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </div>

            {/* Modal */}
            <DealModal
                show={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingDeal(null);
                }}
                onSave={handleAddOrUpdate}
                formData={formData}
                setFormData={setFormData}
                editingDeal={editingDeal}
            />
        </div>
    );
}