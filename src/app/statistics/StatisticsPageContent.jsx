"use client";

import { useState } from "react";
import { FaUsers, FaBuilding, FaDollarSign, FaChartLine } from "react-icons/fa";
import { MdOutlineLibraryBooks } from "react-icons/md";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as BarTooltip,
    Cell,
    ResponsiveContainer as BarResponsive, ResponsiveContainer, Legend, Tooltip,
} from "recharts";
import {
    AreaChart,
    Area,
    XAxis as AreaXAxis,
    YAxis as AreaYAxis,
    CartesianGrid as AreaGrid,
    Tooltip as AreaTooltip,
    ResponsiveContainer as AreaResponsive,
} from "recharts";
import {
    PieChart,
    Pie,
    Cell as PieCell,
    Tooltip as PieTooltip,
    Legend as PieLegend,
    ResponsiveContainer as PieResponsive,
} from "recharts";
import { useTranslation } from "react-i18next";
import DealsBarChart from "@/app/statistics/DealsBarChart";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c", "#d0ed57"];

// Пример данных
const dealsData = [
    { stage: "Lead", value: 5000 },
    { stage: "Contacted", value: 8000 },
    { stage: "Qualified", value: 3000 },
    { stage: "Proposal", value: 6000 },
];

const monthlyExpenses = [
    { month: "Jan", value: 5000 },
    { month: "Feb", value: 8000 },
    { month: "Mar", value: 12000 },
    { month: "Apr", value: 9000 },
    { month: "May", value: 15000 },
    { month: "Jun", value: 20000 },
];

const pieExpenses = [
    { name: "Sales Manager", value: 12000 },
    { name: "Copywriter", value: 15000 },
    { name: "Designer", value: 14500 },
    { name: "Targeting", value: 8500 },
    { name: "Shooting", value: 20000 },
    { name: "Other", value: 5000 },
];

export default function StatisticsPageContent() {
    const { t } = useTranslation();

    const cards = [
        { value: 250, label: t("dashboardMetrics.allCustomers"), icon: <FaUsers size={35} /> },
        { value: 120, label: t("dashboardMetrics.allCompanies"), icon: <FaBuilding size={35} /> },
        // { value: "$85,000", label: t("dashboardMetrics.totalRevenue"), icon: <FaDollarSign size={35} /> },
        { value: 42, label: t("dashboardMetrics.totalDeals"), icon: <MdOutlineLibraryBooks size={35} /> },
        // { value: "15%", label: t("dashboardMetrics.growthRate"), icon: <FaChartLine size={35} /> },
    ];

    return (
        <div className="space-y-6 p-6 text-gray-900">
            <h1 className="text-2xl font-bold">📊 {t("Statistics")}</h1>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card, idx) => (
                    <div
                        key={idx}
                        className="w-full h-28 flex items-center justify-between shadow-xl border rounded-2xl p-4 bg-white"
                    >
                        <div className="block items-center text-center">
                            <div className="text-3xl font-bold">{card.value}</div>
                            <div className="text-lg">{card.label}</div>
                        </div>
                        <div className="border-2 bg-purple-400 rounded-full p-4 text-white">
                            {card.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* BarChart Deals */}
            <DealsBarChart />

            {/* AreaChart Expenses */}
            <div className="shadow rounded-2xl p-4 border bg-white">
                <h3 className="text-lg font-semibold mb-2">{t("Expenses Over Time")}</h3>
                <AreaResponsive width="100%" height={300}>
                    <AreaChart data={monthlyExpenses} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <AreaXAxis dataKey="month" />
                        <AreaYAxis />
                        <AreaGrid strokeDasharray="3 3" />
                        <AreaTooltip formatter={(value) => value.toLocaleString("en-EN") + " ֏"} />
                        <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorExp)" />
                    </AreaChart>
                </AreaResponsive>
            </div>

            {/* PieChart Expenses */}
            <div className="shadow rounded-2xl p-4 border bg-white w-1/2">
                <h3 className="text-lg font-semibold mb-2">{t("Expenses by Category")}</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieExpenses}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                        >
                            {pieExpenses.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => value.toLocaleString("en-EN") + " ֏"} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
