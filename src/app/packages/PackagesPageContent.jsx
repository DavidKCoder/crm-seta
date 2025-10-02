"use client";

import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import PackageModal from "@/app/packages/PackageModal";
import { TbCurrencyDram } from "react-icons/tb";

const initialPackages = [
    {
        id: 1,
        title: "Սկզբնական SMM",
        price: 9900,
        services: [
            "Շաբաթական 3 հրապարակում",
            "Ներգրավվածության վերլուծություն",
            "Հիմնական դիզայն հրապարակումների համար",
        ],
    },
    {
        id: 2,
        title: "Բիզնես SMM",
        price: 14800,
        services: [
            "Շաբաթական 5 հրապարակում",
            "Վերլուծություն և հաշվետվություններ",
            "Հրապարակումների և պատմությունների դիզայն",
            "Թիրախավորված գովազդ",
        ],
    },
    {
        id: 3,
        title: "Պրեմիում SMM",
        price: 35000,
        services: [
            "Ամենօրյա հրապարակումներ",
            "Լիարժեք վերլուծություն և հաշվետվություններ",
            "Պրոֆեսիոնալ դիզայն",
            "Թիրախավորում + բովանդակության առաջխաղացում",
            "SMM ռազմավարություն",
        ],
    },
];


export default function PackagesPageContent() {
    const { t } = useTranslation();
    const [packages, setPackages] = useState(initialPackages);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ title: "", price: "", services: "" });

    const openModal = (pkg = null) => {
        if (pkg) {
            setEditId(pkg.id);
            setForm({
                title: pkg.title,
                price: pkg.price,
                services: pkg.services.join(", "),
            });
        } else {
            setEditId(null);
            setForm({ title: "", price: "", services: "" });
        }
        setModalOpen(true);
    };

    const handleSubmit = () => {
        if (!form.title.trim()) return alert(t("EnterPackageName"));

        const newPkg = {
            id: editId || Date.now(),
            title: form.title,
            price: form.price,
            services: form.services.split(",").map((s) => s.trim()).filter(Boolean),
        };

        if (editId) {
            setPackages(packages.map((p) => (p.id === editId ? newPkg : p)));
        } else {
            setPackages([newPkg, ...packages]);
        }

        setModalOpen(false);
    };

    const deletePackage = (id) => {
        if (confirm(t("DeleteConfirm"))) {
            setPackages(packages.filter((p) => p.id !== id));
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen text-gray-800">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{t("Packages")}</h1>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 shadow cursor-pointer"
                >
                    {t("AddPackage")}
                </button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {packages.map((pkg) => (
                    <div
                        key={pkg.id}
                        className="bg-white rounded-xl shadow p-4 flex flex-col text-center relative h-full"
                    >
                        <h2 className="text-lg font-semibold mb-1 text-gray-900">{pkg.title}</h2>
                        <p className="text-purple-600 font-bold mb-2 flex items-center justify-center">{pkg.price.toLocaleString("en-US")} <TbCurrencyDram /></p>
                        <ul className="text-gray-600 text-sm list-disc list-inside flex-grow my-2">
                            {pkg.services.map((s, i) => (
                                <li key={i} className="text-left">
                                    {s}
                                </li>
                            ))}
                        </ul>

                        <div className="flex gap-2 mt-auto justify-center">
                            <button
                                onClick={() => openModal(pkg)}
                                className="flex items-center gap-1 bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 text-xs cursor-pointer"
                            >
                                <FiEdit2 size={14} /> {t("Edit")}
                            </button>
                            <button
                                onClick={() => deletePackage(pkg.id)}
                                className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs cursor-pointer"
                            >
                                <FiTrash2 size={14} /> {t("Delete")}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <PackageModal
                t={t}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                editId={editId}
                form={form}
                setForm={setForm}
                handleSubmit={handleSubmit}
            />
        </div>
    );
}
