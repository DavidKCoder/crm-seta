"use client";

import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { TbCurrencyDram } from "react-icons/tb";
import PackageModal from "@/app/packages/PackageModal";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/apiClient";

const defaultForm = {
    name: "",
    description: "",
    price: "",
    currency: "AMD",
};

export default function PackagesPageContent() {
    const { t } = useTranslation();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [form, setForm] = useState(defaultForm);

    const currencyOptions = useMemo(() => ["AMD", "USD", "EUR", "RUB"], []);

    const fetchPackages = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await apiGet("/api/packages");
            if (response?.data && Array.isArray(response.data)) {
                setPackages(response.data);
            } else {
                setPackages([]);
            }
        } catch (err) {
            console.error("Error fetching packages:", err);
            setError(t("Failed to load packages"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const openModal = (pkg = null) => {
        if (pkg) {
            setEditingPackage(pkg);
            setForm({
                name: pkg.name || "",
                description: pkg.description || "",
                price: pkg.price ?? "",
                currency: pkg.currency || "AMD",
            });
        } else {
            setEditingPackage(null);
            setForm(defaultForm);
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setForm(defaultForm);
        setEditingPackage(null);
    };

    const handleSubmit = async () => {
        if (!form.name.trim()) {
            alert(t("EnterPackageName"));
            return;
        }

        const payload = {
            name: form.name.trim(),
            description: form.description?.trim() || "",
            price: Number(form.price) || 0,
            currency: form.currency || "AMD",
        };

        setIsSaving(true);
        try {
            if (editingPackage?.id) {
                await apiPut(`/api/packages/${editingPackage.id}`, payload);
            } else {
                await apiPost("/api/packages", payload);
            }
            await fetchPackages();
            closeModal();
        } catch (err) {
            console.error("Error saving package:", err);
            alert(t("Failed to save package"));
        } finally {
            setIsSaving(false);
        }
    };

    const deletePackage = async (pkg) => {
        if (!pkg?.id) return;
        if (!confirm(t("DeleteConfirm"))) return;

        try {
            await apiDelete(`/api/packages/${pkg.id}`);
            setPackages(prev => prev.filter(item => item.id !== pkg.id));
        } catch (err) {
            console.error("Error deleting package:", err);
            alert(t("Failed to delete package"));
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen text-gray-800">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{t("Packages")}</h1>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 shadow cursor-pointer"
                >
                    {t("AddPackage")}
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">{t("Loading...")}</div>
            ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
            ) : packages.length === 0 ? (
                <div className="text-center py-10 text-gray-500">{t("No data available")}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className="bg-white rounded-xl shadow p-4 flex flex-col text-center relative h-full"
                        >
                            <h2 className="text-lg font-semibold mb-1 text-gray-900">{pkg.name}</h2>
                            <p className="text-purple-600 font-bold mb-2 flex items-center justify-center">
                                {(Number(pkg.price) || 0).toLocaleString("en-US")} <TbCurrencyDram />
                                <span className="text-xs text-gray-500 ml-2">{pkg.currency || "AMD"}</span>
                            </p>
                            <p className="text-gray-600 text-sm flex-grow">{pkg.description || t("No description")}</p>

                            <div className="flex gap-2 mt-4 justify-center">
                                <button
                                    onClick={() => openModal(pkg)}
                                    className="flex items-center gap-1 bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 text-xs cursor-pointer"
                                >
                                    <FiEdit2 size={14} /> {t("Edit")}
                                </button>
                                <button
                                    onClick={() => deletePackage(pkg)}
                                    className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs cursor-pointer"
                                >
                                    <FiTrash2 size={14} /> {t("Delete")}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <PackageModal
                t={t}
                modalOpen={modalOpen}
                setModalOpen={closeModal}
                editId={editingPackage?.id}
                form={form}
                setForm={setForm}
                handleSubmit={handleSubmit}
                isSaving={isSaving}
                currencyOptions={currencyOptions}
            />
        </div>
    );
}
