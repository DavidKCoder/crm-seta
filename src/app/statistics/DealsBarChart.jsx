"use client";

import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { dealsData } from "@/constants";
import { useTranslation } from "react-i18next";
import { useDealStatuses } from "@/components/DealStatusesProvider";

const aggregateDealsByStage = (deals) => {
    const result = {};

    deals.forEach((deal) => {
        const status = deal.status || "Unknown";
        const value = deal.value || 0;

        if (!result[status]) {
            result[status] = { count: 0, value: 0 };
        }

        result[status].count += 1;
        result[status].value += value;
    });

    return Object.entries(result).map(([stage, { count, value }]) => ({
        stage,
        count,
        value,
    }));
};

export default function DealsBarChart() {
    const { t } = useTranslation();
    const { getStatusStyle } = useDealStatuses();

    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const [startDate, setStartDate] = useState(oneMonthAgo.toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]);

    const [mode, setMode] = useState("count");


    const filteredDeals = dealsData.filter((deal) => {
        if (!deal.joiningDate) return true; // если нет даты
        const dealDate = new Date(deal.joiningDate);
        if (startDate && dealDate < new Date(startDate)) return false;
        if (endDate && dealDate > new Date(endDate)) return false;
        return true;
    });

    const dealsByStage = aggregateDealsByStage(filteredDeals);

    return (
        <div className="shadow rounded-2xl p-4 border-1">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{t("dealsByStage")}</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setMode("count")}
                        className={`px-3 py-1 rounded-md text-sm font-medium cursor-pointer ${
                            mode === "count" ? "bg-purple-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        {t("count")}
                    </button>
                    <button
                        onClick={() => setMode("value")}
                        className={`px-3 py-1 rounded-md text-sm font-medium cursor-pointer ${
                            mode === "value" ? "bg-purple-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        {t("value")}
                    </button>
                </div>
            </div>

            {/* Выбор диапазона */}
            <div className="flex gap-4 mb-4">
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

            {/* Сам график */}
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dealsByStage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="stage"
                        tick={({ x, y, payload }) => {
                            const words = payload.value.split(" ");
                            return (
                                <g transform={`translate(${x},${y + 10})`}>
                                    {words.map((word, index) => (
                                        <text
                                            key={index}
                                            x={0}
                                            y={index * 12}
                                            textAnchor="middle"
                                            fontSize={12}
                                        >
                                            {word}
                                        </text>
                                    ))}
                                </g>
                            );
                        }}
                    />
                    <YAxis />
                    <Tooltip
                        formatter={(value) =>
                            mode === "value"
                                ? value.toLocaleString("en-EN") + " ֏"
                                : value
                        }
                    />
                    <Bar dataKey={mode}>
                        {dealsByStage.map((entry, index) => {
                            const colorClass = getStatusStyle(entry.stage);
                            const bgColor = colorClass.split(" ")[0].replace("bg-", "");
                            const COLORS_MAP = {
                                "sky-50": "#0ea5e9",
                                "amber-50": "#d97706",
                                "emerald-50": "#059669",
                                "violet-50": "#7c3aed",
                                "fuchsia-50": "#c026d3",
                                "indigo-50": "#4338ca",
                                "cyan-50": "#06b6d4",
                                "green-50": "#16a34a",
                                "rose-50": "#be123c",
                                "gray-50": "#374151",
                            };
                            return (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS_MAP[bgColor] || "#ccc"}
                                />
                            );
                        })}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
