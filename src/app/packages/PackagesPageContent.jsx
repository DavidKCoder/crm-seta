"use client"

import { useState } from "react";
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";

const initialPackages = [
    {
        id: 1,
        title: "Starter SMM",
        price: "$49/мес",
        services: ["3 публикации в неделю", "Аналитика вовлеченности", "Базовый дизайн постов"],
    },
    {
        id: 2,
        title: "Business SMM",
        price: "$99/мес",
        services: [
            "5 публикаций в неделю",
            "Аналитика и отчеты",
            "Дизайн постов + сторис",
            "Таргетированная реклама",
        ],
    },
    {
        id: 3,
        title: "Premium SMM",
        price: "$199/мес",
        services: [
            "Ежедневные публикации",
            "Полная аналитика и отчеты",
            "Профессиональный дизайн",
            "Таргет + продвижение контента",
            "Стратегия SMM",
        ],
    },
];

export default function PackagesPageContent() {
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
        if (!form.title.trim()) return alert("Введите название пакета");

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
        if (confirm("Вы уверены, что хотите удалить пакет?")) {
            setPackages(packages.filter((p) => p.id !== id));
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen text-gray-800">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Our SMM-packages</h1>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 shadow cursor-pointer"
                >
                    Add Package
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
                        <p className="text-purple-600 font-bold mb-2">{pkg.price}</p>
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
                                <FiEdit2 size={14} /> Edit
                            </button>
                            <button
                                onClick={() => deletePackage(pkg.id)}
                                className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs cursor-pointer"
                            >
                                <FiTrash2 size={14} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
                        {/* Close button */}
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            <FiX size={20} />
                        </button>

                        <h2 className="text-xl font-bold mb-4">
                            {editId ? "Edit Package" : "Add Package"}
                        </h2>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="border rounded p-2 w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Price</label>
                                <input
                                    type="text"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    className="border rounded p-2 w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Services (через запятую)</label>
                                <textarea
                                    rows={3}
                                    value={form.services}
                                    onChange={(e) => setForm({ ...form, services: e.target.value })}
                                    className="border rounded p-2 w-full"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer"
                            >
                                {editId ? "Save" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}