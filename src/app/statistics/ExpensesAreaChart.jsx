"use client";

import { useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

const allExpenses = [
    { month: "Jan", value: 5000 },
    { month: "Feb", value: 8000 },
    { month: "Mar", value: 12000 },
    { month: "Apr", value: 9000 },
    { month: "May", value: 15000 },
    { month: "Jun", value: 20000 },
];

export function ExpensesAreaChart() {
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

    return (
        <div className="shadow rounded-2xl p-4 border-1">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t("Expenses Over Time")}</h3>
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
                <AreaChart data={filteredExpenses} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip formatter={(value) => value.toLocaleString("en-EN") + " ֏"} />
                    <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorExp)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
