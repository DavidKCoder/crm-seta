"use client";

import { useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

// Пример данных расходов по категориям и месяцам
const allExpenses = [
    { month: "Jan", category: "Sales Manager", value: 5000 },
    { month: "Jan", category: "Copywriter", value: 2000 },
    { month: "Jan", category: "Designer", value: 3000 },
    { month: "Jan", category: "Targeting", value: 1500 },
    { month: "Jan", category: "Shooting", value: 4000 },
    { month: "Jan", category: "Other", value: 500 },
    { month: "Feb", category: "Sales Manager", value: 6000 },
    { month: "Feb", category: "Copywriter", value: 2500 },
    { month: "Feb", category: "Designer", value: 2000 },
    { month: "Feb", category: "Targeting", value: 2000 },
    { month: "Feb", category: "Shooting", value: 3000 },
    { month: "Feb", category: "Other", value: 1000 },
    { month: "Sep", category: "Sales Manager", value: 7000 },
    { month: "Sep", category: "Copywriter", value: 3500 },
    { month: "Sep", category: "Designer", value: 2500 },
    { month: "Sep", category: "Targeting", value: 1000 },
    { month: "Sep", category: "Shooting", value: 3500 },
    { month: "Sep", category: "Other", value: 1200 },
    // ...добавь остальные месяцы
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c", "#d0ed57"];

export function ExpensesPieChart() {
    const { t } = useTranslation();

    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const [startDate, setStartDate] = useState(oneMonthAgo.toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]);

    // Фильтруем данные по диапазону
    const filteredExpenses = allExpenses.filter((item) => {
        const itemDate = new Date(`${item.month} 1, ${today.getFullYear()}`);
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });

    // Агрегируем расходы по категориям
    const expensesByCategory = filteredExpenses.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.value;
        return acc;
    }, {});

    const pieData = Object.entries(expensesByCategory).map(([category, value]) => ({ name: category, value }));

    return (
        <div className="w-full h-64 bg-white rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{t("Expenses by Category")}</h3>
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border rounded-md px-2 py-1 text-sm"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border rounded-md px-2 py-1 text-sm"
                    />
                </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => value.toLocaleString("en-EN") + " ֏"} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
