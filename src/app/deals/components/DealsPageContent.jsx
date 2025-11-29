"use client";

import { useEffect, useMemo, useState } from "react";
import { apiGet } from "@/lib/apiClient";
import { TbCurrencyDram } from "react-icons/tb";
import DealModal from "@/app/deals/components/DealModal";
import { StatusDropdown } from "@/app/deals/components/StatusDropdown";
import { useTranslation } from "react-i18next";
import { DealCard } from "@/app/deals/components/DealCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeals, fetchDealById, createDeal, updateDeal, deleteDeal } from "@/features/deals/dealsSlice";
import { fetchClients } from "@/features/clients/clientsSlice";
import { fetchCampaigns } from "@/features/campaigns/campaignsSlice";
import { fetchStatuses } from "@/features/statuses/statusesSlice";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export default function DealsPageContent() {
    const { t } = useTranslation();
    const { isAdmin } = useIsAdmin();
    const dispatch = useDispatch();
    const deals = useSelector((state) => state.deals.items);
    const dealsStatus = useSelector((state) => state.deals.status);
    const dealsError = useSelector((state) => state.deals.error);
    const clients = useSelector((state) => state.clients.items);
    const clientsStatus = useSelector((state) => state.clients.status);
    const campaigns = useSelector((state) => state.campaigns.items);
    const campaignsStatus = useSelector((state) => state.campaigns.status);
    const authUser = useSelector((state) => state.auth.user);
    const dealStatusesState = useSelector((state) => state.statuses);
    const statusesItems = dealStatusesState?.items || [];
    const [selectedStatuses, setSelectedStatuses] = useState(statusesItems.map((s) => s.id));

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
        assignedToUserId: "",
        assignedToUserIds: [],
    });

    const [roles, setRoles] = useState([]);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        setSelectedStatuses(statusesItems.map((s) => s.id));
    }, [statusesItems]);

    useEffect(() => {
        if (dealStatusesState.status === "idle") {
            dispatch(fetchStatuses());
        }
    }, [dispatch, dealStatusesState.status]);

    const today = useMemo(() => new Date(), []);
    const defaultStart = useMemo(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        return d.toISOString().split("T")[0];
    }, []);
    const defaultEnd = useMemo(() => today.toISOString().split("T")[0], [today]);
    const [dateRange, setDateRange] = useState({ startDate: defaultStart, endDate: defaultEnd });

    useEffect(() => {
        dispatch(fetchDeals({
            page: 1,
            limit: 100,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
        }));
    }, [dispatch, dateRange.startDate, dateRange.endDate]);

    // Fetch roles for assignment
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await apiGet("/api/roles");
                if (response && Array.isArray(response.data)) {
                    setRoles(response.data);
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        fetchRoles();
    }, []);

    useEffect(() => {
        if (clientsStatus === "idle") {
            dispatch(fetchClients({ page: 1, limit: 100 }));
        }
    }, [dispatch, clientsStatus]);

    useEffect(() => {
        if (campaignsStatus === "idle") {
            dispatch(fetchCampaigns({ page: 1, limit: 100 }));
        }
    }, [dispatch, campaignsStatus]);

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
            assignedToUserId: "",
            assignedToUserIds: [],
        });
        setEditingDeal(null);
    };

    const handleOpenAdd = () => {
        resetForm();

        // Set default values
        const defaultValues = {
            entityType: "client",
            currency: "AMD",
            entityId: "", // No default entity selected
            assignedToUserId: "", // Initialize with empty string
            assignedToUserIds: [],
        };

        // If statuses are available, select the first one
        if (statusesItems && statusesItems.length > 0) {
            defaultValues.statusId = statusesItems[0].id;
        }

        setFormData(prev => ({
            ...prev,
            ...defaultValues,
        }));

        setShowModal(true);
    };

    const handleEdit = async (deal) => {
        try {
            // First set the editing deal to show loading state if needed
            setEditingDeal(deal);

            // Fetch the latest deal data
            const result = await dispatch(fetchDealById(deal.id)).unwrap();

            // Extract data from the nested structure
            const entityType = result.entity?.type || "client";
            const entityId = result.entity?.id || "";
            const statusId = result.status?.id || "";

            // Format the joining date
            const formatDate = (dateString) => {
                if (!dateString) return "";
                try {
                    // Ensure consistent date format for both server and client
                    const date = new Date(dateString);
                    if (isNaN(date.getTime())) return "";
                    return date.toISOString().split("T")[0];
                } catch (e) {
                    console.error("Error formatting date:", e);
                    return "";
                }
            };

            // Helper function to safely extract string values
            const safeString = (value, defaultValue = "") => {
                if (value === null || value === undefined) return defaultValue;
                if (typeof value === "object") return JSON.stringify(value);
                return String(value);
            };

            const assignedUsersArray = Array.isArray(result?.assignedUsers)
                ? result.assignedUsers
                : [];
            const assignedUserIdsFromUsers = assignedUsersArray
                .map(user => safeString(user?.id))
                .filter(Boolean);
            const assignedUserIdsFromResponse = Array.isArray(result?.assignedToUserIds)
                ? result.assignedToUserIds.map(id => safeString(id)).filter(Boolean)
                : [];
            const resolvedAssignedIds = assignedUserIdsFromResponse.length > 0
                ? assignedUserIdsFromResponse
                : (assignedUserIdsFromUsers.length > 0
                    ? assignedUserIdsFromUsers
                    : (result?.assignedTo?.id ? [safeString(result.assignedTo.id)] : []));

            // Create a clean form data object with only the fields we need
            const cleanFormData = {
                // Basic fields
                id: safeString(result?.id),
                name: safeString(result?.name),
                email: safeString(result?.email),
                phone: safeString(result?.phone),
                value: safeString(result?.value, "0"),
                currency: safeString(result?.currency, "USD"),
                notes: safeString(result?.notes),
                facebook: safeString(result?.facebook),
                instagram: safeString(result?.instagram),
                website: safeString(result?.website),
                isFinished: Boolean(result?.isFinished),

                // Processed fields - ensure they're always strings
                entityType: safeString(entityType),
                entityId: safeString(entityId),
                statusId: safeString(statusId),
                assignedToUserId: resolvedAssignedIds[0] || "",
                assignedToUserIds: resolvedAssignedIds,
                joiningDate: formatDate(result?.joiningDate) || "",

                // Reset file input
                pdfFile: null,

                // Clear any previous errors
                errors: {},
            };

            console.log("Processed form data:", cleanFormData);

            // Set form data and show modal
            setFormData(prev => ({
                ...prev,
                ...cleanFormData,
            }));
            setShowModal(true);
        } catch (error) {
            console.error("Error loading deal details:", error);
            // Optionally show an error message to the user
        }
    };

    const handleDelete = (id) => {
        if (!id) return;
        dispatch(deleteDeal(id));
    };

    const handleSave = async () => {
        const statusesItems = dealStatusesState?.items || [];
        const selectedStatus = statusesItems.find((s) => s.id === formData.statusId);
        if (!selectedStatus || !selectedStatus.id) {
            return;
        }

        // Reset success state
        setShowSuccessAlert(false);
        setSuccessMessage("");

        // Get entity type and ID from form data
        const entityType = formData.entityType || "client";
        const entityId = formData.entityId;

        if (!entityId) {
            console.error("No entity ID provided");
            return;
        }

        const multipleAssignedIds = Array.isArray(formData.assignedToUserIds)
            ? formData.assignedToUserIds.filter(Boolean)
            : [];
        const primaryAssignedId = multipleAssignedIds.length > 0
            ? multipleAssignedIds[0]
            : (formData.assignedToUserId || null);

        const payload = {
            entityType,
            entityId,
            statusId: selectedStatus.id,
            value: Number(formData.value) || 0,
            currency: formData.currency || "AMD",
            name: formData.name?.trim() || "",
            email: formData.email?.trim() || "",
            phone: formData.phone?.trim() || "",
            joiningDate: formData.joiningDate || new Date().toISOString().split("T")[0],
            notes: formData.notes?.trim() || "",
            facebook: formData.facebook?.trim() || undefined,
            instagram: formData.instagram?.trim() || undefined,
            website: formData.website?.trim() || undefined,
            assignedToUserId: primaryAssignedId,
            assignedToUserIds: multipleAssignedIds.length > 0
                ? multipleAssignedIds
                : (primaryAssignedId ? [primaryAssignedId] : []),
            isFinished: Boolean(formData.isFinished) || false,
        };

        try {
            if (editingDeal && editingDeal.id) {
                // Handle update
                const result = await dispatch(updateDeal({ id: editingDeal.id, payload }));
                if (updateDeal.rejected.match(result)) {
                    const error = result.payload || result.error;
                    if (error?.errors) {
                        const fieldErrors = {};
                        error.errors.forEach(err => {
                            fieldErrors[err.path] = err.message;
                        });
                        setFormData(prev => ({
                            ...prev,
                            errors: fieldErrors,
                        }));
                    }
                    return;
                }
                setSuccessMessage("Deal updated successfully!");
            } else {
                // Handle create
                const result = await dispatch(createDeal(payload));
                if (createDeal.rejected.match(result)) {
                    const error = result.payload || result.error;
                    if (error?.errors) {
                        const fieldErrors = {};
                        error.errors.forEach(err => {
                            fieldErrors[err.path] = err.message;
                        });
                        setFormData(prev => ({
                            ...prev,
                            errors: fieldErrors,
                        }));
                    }
                    return;
                }
                setSuccessMessage("Deal created successfully!");
            }

            // Show success and reset form if we get here (no errors)
            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 1000);
            setShowModal(false);
            resetForm();
        } catch (error) {
            setFormData(prev => ({
                ...prev,
                errors: { _form: error.message || "An unexpected error occurred" },
            }));
        }
    };

    const toggleStatus = (statusId) => {
        if (selectedStatuses.includes(statusId)) {
            setSelectedStatuses(selectedStatuses.filter((s) => s !== statusId));
        } else {
            setSelectedStatuses([...selectedStatuses, statusId]);
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
            {showSuccessAlert && (
                <div
                    className="flex items-start sm:items-center p-4 mb-4 text-sm text-green-800 rounded-base bg-green-200 border border-green-500 rounded-lg z-50"
                    role="alert">
                    <svg className="w-4 h-4 me-2 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <p><span className="font-medium me-1">Success!</span> {successMessage}</p>
                </div>
            )}
            <div className="flex justify-between items-center mb-6">
                <div className="flex justify-between items-center gap-5">
                    <h1 className="text-2xl font-bold text-gray-900">{t("Deals")}</h1>
                    <StatusDropdown
                        statuses={statusesItems}
                        selectedStatuses={selectedStatuses}
                        toggleStatus={toggleStatus}
                        setSelectedStatuses={setSelectedStatuses}
                    />
                    <div className="flex flex-wrap items-center justify-between max-w-sm gap-x-2">
                        <div className="flex items-center gap-2 text-black">
                            <span className="text-sm">{t("From")}:</span>
                            <input
                                type="date"
                                value={dateRange.startDate}
                                max={dateRange.endDate || undefined}
                                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                className="border rounded-md px-2 py-1 text-sm cursor-pointer"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-black">
                            <span className="text-sm text-gray-700">{t("To")}:</span>
                            <input
                                type="date"
                                value={dateRange.endDate}
                                min={dateRange.startDate || undefined}
                                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                className="border rounded-md px-2 py-1 text-sm cursor-pointer"
                            />
                        </div>
                    </div>
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
                {statusesItems
                    .filter((st) => selectedStatuses.includes(st.id))
                    .map((st, i) => {
                        const stageDeals = deals.filter((d) => {
                            const dealStatusId = d.status?.id || d.statusId;
                            const dealStatusName = d.status?.name || d.status;
                            return dealStatusId === st.id || dealStatusName === st.name;
                        });
                        const totalValue = stageDeals.reduce(
                            (sum, d) => sum + Number(d.value),
                            0,
                        );

                        const colorHex = st.colorHex;

                        return (
                            <div
                                key={i}
                                className="min-w-max p-1 flex flex-col gap-3"
                            >
                                <h2 className="p-2 rounded-lg bg-white text-black border border-gray-300 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: colorHex || "#9ca3af" }}
                                        >
                                            {" "}
                                        </div>
                                        {st.name}
                                    </div>
                                    {stageDeals.length > 0 &&
                                        <div
                                            className="text-gray-400 rounded-md px-2 py-0.5 text-xs border"
                                            style={{ borderColor: colorHex, color: colorHex }}>
                                            {stageDeals.length} {t("deals")}
                                        </div>
                                    }
                                </h2>

                                {stageDeals.length > 0 && (
                                    <div
                                        className="border border-gray-50 bg-white shadow rounded-xl p-4 flex flex-col gap-3"
                                    >
                                        {isAdmin && <div
                                            className="text-left text-sm font-bold flex items-center gap-1 text-gray-900"
                                        >
                                            {t("Total")}
                                            <div className="flex items-center">
                                                {totalValue.toLocaleString("en-US")} <TbCurrencyDram />
                                            </div>
                                            / {stageDeals.length} {t("deals")}
                                        </div>}

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
                clients={clients}
                campaigns={campaigns}
                currentUser={authUser}
                statuses={dealStatusesState?.items || []}
                roles={roles}
            />
        </div>
    );
}