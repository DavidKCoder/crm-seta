"use client";

import { useState } from "react";

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
        services: ["5 публикаций в неделю", "Аналитика и отчеты", "Дизайн постов + сторис", "Таргетированная реклама"],
    },
    {
        id: 3,
        title: "Premium SMM",
        price: "$199/мес",
        services: ["Ежедневные публикации", "Полная аналитика и отчеты", "Профессиональный дизайн", "Таргет + продвижение контента", "Стратегия SMM"],
    },
    {
        id: 4,
        title: "Advanced SMM",
        price: "$149/мес",
        services: ["4 публикации в неделю", "Аналитика вовлеченности", "Дизайн постов и сторис", "Таргетированная реклама"],
    },
    {
        id: 5,
        title: "Ultimate SMM",
        price: "$249/мес",
        services: ["Ежедневные публикации", "Полная аналитика", "Профессиональный дизайн", "Продвижение всех соцсетей", "Стратегия + консультации"],
    },
];

export default function PackagesPage() {
    const [packages, setPackages] = useState(initialPackages);

    const addPackage = () => {
        const title = prompt("Название нового пакета:");
        if (!title) return;

        const price = prompt("Цена нового пакета:");
        const servicesStr = prompt("Сервисы через запятую:");
        const newPackage = {
            id: Date.now(),
            title,
            price: price || "",
            services: servicesStr ? servicesStr.split(",").map(s => s.trim()) : [],
        };
        setPackages([newPackage, ...packages]);
    };

    const editPackage = (id) => {
        const pkg = packages.find(p => p.id === id);
        if (!pkg) return;

        const title = prompt("Редактировать название:", pkg.title);
        if (!title) return;

        const price = prompt("Редактировать цену:", pkg.price);
        const servicesStr = prompt("Редактировать сервисы через запятую:", pkg.services.join(", "));

        const updated = packages.map(p =>
            p.id === id ? {
                ...p,
                title,
                price: price || "",
                services: servicesStr ? servicesStr.split(",").map(s => s.trim()) : [],
            } : p,
        );
        setPackages(updated);
    };

    const deletePackage = (id) => {
        if (confirm("Вы уверены, что хотите удалить пакет?")) {
            setPackages(packages.filter(p => p.id !== id));
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Our SMM-packages</h1>
                <button
                    onClick={addPackage}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                    Add Package
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {packages.map(pkg => (
                    <div
                        key={pkg.id}
                        className="bg-white rounded-xl shadow p-4 flex flex-col text-center relative h-full"
                    >
                        <h2 className="text-lg font-semibold mb-1">{pkg.title}</h2>
                        <p className="text-purple-600 font-bold mb-2">{pkg.price}</p>
                        <ul className="text-gray-600 text-sm list-disc list-inside flex-grow my-2">
                            {pkg.services.map((s, i) => (
                                <li key={i} className="text-left">{s}</li>
                            ))}
                        </ul>

                        <div className="flex gap-2 mt-auto justify-center">
                            <button
                                onClick={() => editPackage(pkg.id)}
                                className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 text-xs"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deletePackage(pkg.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
}
