"use client";

import { useEffect, useState } from "react";
import { TbCurrencyDram } from "react-icons/tb";
import DealModal from "@/app/deals/components/DealModal";
import { StatusDropdown } from "@/app/deals/components/StatusDropdown";
import { useTranslation } from "react-i18next";
import { DealCard } from "@/app/deals/components/DealCard";
import { useDealStatuses } from "@/components/DealStatusesProvider";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeals, createDeal, updateDeal, deleteDeal } from "@/features/deals/dealsSlice";
import { fetchClients } from "@/features/clients/clientsSlice";

export default function DealsPageContent() {
    const { t } = useTranslation();
    const router = useRouter();
    const { getStatusesForRole, getStatusStyle } = useDealStatuses();
    const { role } = useCurrentUserRole();
    const availableStatuses = getStatusesForRole(role);
    const dispatch = useDispatch();
    const deals = useSelector((state) => state.deals.items);
    const dealsStatus = useSelector((state) => state.deals.status);
    const dealsError = useSelector((state) => state.deals.error);
    const clients = useSelector((state) => state.clients.items);
    const clientsStatus = useSelector((state) => state.clients.status);
    const authUser = useSelector((state) => state.auth.user);
    const dealStatusesState = useSelector((state) => state.statuses.byEntity.deal);
    const [selectedStatuses, setSelectedStatuses] = useState(availableStatuses);

    const [showModal, setShowModal] = useState(false);
    const [editingDeal, setEditingDeal] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        value: "",
        status: "",
        role: "",
        instagram: "",
        facebook: "",
        website: "",
        notes: "",
        joiningDate: "",
        isFinished: false,
        pdfFile: null,
    });

    useEffect(() => {
        setSelectedStatuses(availableStatuses);
    }, [availableStatuses]);

    useEffect(() => {
        if (dealsStatus === "idle") {
            dispatch(fetchDeals({ page: 1, limit: 100 }));
        }
    }, [dispatch, dealsStatus]);

    useEffect(() => {
        if (clientsStatus === "idle") {
            dispatch(fetchClients({ page: 1, limit: 100 }));
        }
    }, [dispatch, clientsStatus]);

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            value: "",
            status: "",
            role: "",
            instagram: "",
            facebook: "",
            website: "",
            notes: "",
            joiningDate: "",
            isFinished: false,
            pdfFile: null,
        });
        setEditingDeal(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        if (availableStatuses && availableStatuses.length > 0) {
            setFormData((prev) => ({ ...prev, status: availableStatuses[0] }));
        }
        setShowModal(true);
    };

    const handleEdit = (deal) => {
        setEditingDeal(deal);
        setFormData({
            name: deal.name || "",
            email: deal.email || "",
            value: deal.value != null ? String(deal.value) : "",
            status: deal.status?.name || deal.status || "",
            role: deal.role || "",
            instagram: deal.instagram || "",
            facebook: deal.facebook || "",
            website: deal.website || "",
            notes: deal.notes || "",
            joiningDate: deal.joiningDate ? String(deal.joiningDate).split("T")[0] : "",
            isFinished: !!deal.isFinished,
            pdfFile: null,
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (!id) return;
        dispatch(deleteDeal(id));
    };

    const handleSave = async () => {
        const statusesItems = dealStatusesState?.items || [];
        const selected = statusesItems.find((s) => s.name === formData.status);
        if (!selected || !selected.id) {
            return;
        }

        const clientId = clients && clients.length > 0 ? clients[0].id : null;
        if (!clientId) {
            // No valid client available yet; do not send request
            return;
        }
        const payload = {
            entityType: "client",
            entityId: clientId,
            statusId: selected.id,
            value: Number(formData.value) || 0,
            currency: "AMD",
            joiningDate: formData.joiningDate || undefined,
            notes: formData.notes || undefined,
            facebook: formData.facebook || undefined,
            instagram: formData.instagram || undefined,
            website: formData.website || undefined,
            assignedToUserId: authUser?.id,
        };

        if (editingDeal && editingDeal.id) {
            await dispatch(updateDeal({ id: editingDeal.id, payload }));
        } else {
            await dispatch(createDeal(payload));
        }

        setShowModal(false);
        resetForm();
    };

    const toggleStatus = (st) => {
        if (selectedStatuses.includes(st)) {
            setSelectedStatuses(selectedStatuses.filter((s) => s !== st));
        } else {
            setSelectedStatuses([...selectedStatuses, st]);
        }
    };

    if (dealsStatus === "loading" && deals.length === 0) {
        return <div>{t("Loading deals...")}</div>;
    }

    if (dealsError && deals.length === 0) {
        return <div className="text-red-600">{dealsError}</div>;
    }

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
                    <button
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded cursor-pointer text-sm"
                        onClick={handleOpenAdd}
                    >
                        {t("Add Deal")}
                    </button>
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto">
                {availableStatuses
                    .filter((st) => selectedStatuses.includes(st))
                    .map((st, i) => {
                        const stageDeals = deals.filter((d) => (d.status?.name || d.status) === st);
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
                    resetForm();
                }}
                onSave={handleSave}
                formData={formData}
                setFormData={setFormData}
                editingDeal={editingDeal}
            />
        </div>
    );
}