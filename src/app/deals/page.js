"use client";

import { useState } from "react";
import { FiMail, FiEdit2, FiTrash } from "react-icons/fi";

const dealsData = [
    {
        id: 201,
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        stage: "New",
        value: "$5,000",
        package: "Starter",
        avatar: "https://i.pravatar.cc/32?img=1",
    },
    {
        id: 202,
        name: "Bob Smith",
        email: "bob.smith@example.com",
        stage: "In Progress",
        value: "$12,000",
        package: "Pro",
        avatar: "https://i.pravatar.cc/32?img=2",
    },
    {
        id: 203,
        name: "Carol Davis",
        email: "carol.davis@example.com",
        stage: "In Progress",
        value: "$8,000",
        package: "Enterprise",
        avatar: "https://i.pravatar.cc/32?img=3",
    },
    {
        id: 204,
        name: "David Brown",
        email: "david.brown@example.com",
        stage: "New",
        value: "$8,000",
        package: "Enterprise",
        avatar: "https://i.pravatar.cc/32?img=4",
    },
];

const getStageColor = (status) => {
    switch (status) {
        case "New":
            return "border-green-600 border text-white bg-purple-800";
        case "Pending":
            return "border-yellow-600 border text-white bg-purple-800";
        case "In Progress":
            return "border-blue-600 border text-white bg-purple-800";
        case "Completed":
            return "border-purple-600 border text-white bg-purple-800";
        case "Lost":
            return "border-red-600 border text-white bg-purple-800";
        default:
            return "border-gray-600 border text-white bg-purple-800";
    }
};

export default function DealsPage() {
    const [deals, setDeals] = useState(dealsData);
    const [editingDeal, setEditingDeal] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        value: "",
        stage: "New",
        package: "Starter", // значение по умолчанию
    });

    const stages = ["New", "Pending", "In Progress", "Completed", "Lost"];
    const packages = ["Starter", "Pro", "Enterprise"];

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAddOrUpdate = () => {
        if (!formData.name || !formData.email) return;
        if (editingDeal) {
            setDeals(
                deals.map((d) =>
                    d.id === editingDeal.id ? { ...d, ...formData } : d,
                ),
            );
            setEditingDeal(null);
        } else {
            setDeals([
                ...deals,
                {
                    id: Date.now(),
                    ...formData,
                    avatar: `https://i.pravatar.cc/32?img=${Math.floor(
                        Math.random() * 70,
                    )}`,
                },
            ]);
        }
        setFormData({
            name: "",
            email: "",
            value: "",
            stage: "New",
            package: "Starter",
        });
    };

    const handleEdit = (deal) => {
        setEditingDeal(deal);
        setFormData({
            name: deal.name,
            email: deal.email,
            value: deal.value,
            stage: deal.stage,
            package: deal.package || "Starter",
        });
    };

    const handleDelete = (id) => setDeals(deals.filter((d) => d.id !== id));

    return (
        <div className="p-0">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Deals</h1>
            </div>

            {/* Форма добавления / редактирования */}
            <div className="mb-6 flex flex-wrap gap-2 bg-gray-50 p-4 rounded-lg">
                <input
                    type="text"
                    name="name"
                    placeholder="Имя"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-2 rounded w-40"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border p-2 rounded w-48"
                />
                <input
                    type="text"
                    name="value"
                    placeholder="Amount"
                    value={formData.value}
                    onChange={handleChange}
                    className="border p-2 rounded w-32"
                />
                <select
                    name="package"
                    value={formData.package}
                    onChange={handleChange}
                    className="border p-2 rounded w-32"
                >
                    {packages.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>
                <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange}
                    className="border p-2 rounded w-36"
                >
                    {stages.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleAddOrUpdate}
                    className={`px-4 py-2 rounded cursor-pointer ${
                        editingDeal
                            ? "bg-yellow-400 hover:bg-yellow-500 text-white"
                            : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                >
                    {editingDeal ? "Update Deal" : "Add Deal"}
                </button>
            </div>

            {/* Канбан доска */}
            <div className="flex gap-4 overflow-x-auto">
                {stages.map((stage) => {
                    const stageDeals = deals.filter((d) => d.stage === stage);
                    const totalValue = stageDeals.reduce((sum, d) => {
                        const valueNum = Number(d.value.replace(/[\$,]/g, ""));
                        return sum + valueNum;
                    }, 0);

                    return (
                        <div
                            key={stage}
                            className="min-w-[250px] p-1 flex flex-col gap-3"
                        >
                            <h2

                                className={`p-2 rounded-lg bg-gray-50 text-black border-l-12 ${getStageColor(stage)}`}>
                                {stage}
                            </h2>

                            {stageDeals.length > 0 &&
                                <div className="border border-gray-50 shadow rounded-xl p-4 flex flex-col gap-3">
                                    <div className="text-left text-sm font-bold">
                                        Total: ${totalValue.toLocaleString()} /{" "}
                                        {stageDeals.length} deals
                                    </div>

                                    {stageDeals.map((deal) => (
                                        <div
                                            key={deal.id}
                                            className="group bg-white rounded-lg shadow p-2 flex flex-col gap-2 hover:bg-purple-400 cursor-pointer hover:text-white"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {deal.name}
                                                </span>
                                                    <span className="text-gray-500 text-sm group-hover:text-white">
                                                    {deal.value} • {deal.package}
                                                </span>
                                                </div>
                                                <img
                                                    src={deal.avatar}
                                                    alt={deal.name}
                                                    className="w-6 h-6 rounded-full"
                                                />
                                            </div>
                                            <div className="flex gap-2 mt-2 text-gray-300">
                                                <FiMail
                                                    size={14}
                                                    className="cursor-pointer hover:text-purple-600"
                                                    onClick={() =>
                                                        window.open(
                                                            `https://mail.google.com/mail/?view=cm&to=${deal.email}`,
                                                            "_blank",
                                                        )
                                                    }
                                                />
                                                <FiEdit2
                                                    size={14}
                                                    className="cursor-pointer hover:text-blue-600"
                                                    onClick={() => handleEdit(deal)}
                                                />
                                                <FiTrash
                                                    size={14}
                                                    className="cursor-pointer hover:text-red-600"
                                                    onClick={() =>
                                                        handleDelete(deal.id)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
