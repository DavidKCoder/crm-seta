"use client";

import { useEffect, useState } from "react";
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
import { useTranslation } from "react-i18next";
import { apiGet } from "@/lib/apiClient";
import { useSelector } from "react-redux";

export default function DealsBarChart() {
    const { t } = useTranslation();
    const statusesItems = useSelector((state) => state.statuses?.items || []);

    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const [startDate, setStartDate] = useState(oneMonthAgo.toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]);

    const [mode, setMode] = useState("count");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPipeline = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await apiGet("/api/deals/pipeline", {
                    startDate: startDate || undefined,
                    endDate: endDate || undefined,
                });
                const raw = res?.data || [];
                const mapped = raw.map(item => ({
                    stage: item?.status?.name || t("Unknown"),
                    count: item?.totals?.count || 0,
                    value: item?.totals?.value || 0,
                }));
                setData(mapped);
            } catch (err) {
                console.error("Failed to load deals pipeline:", err);
                setError(t("Failed to load deals statistics"));
            } finally {
                setLoading(false);
            }
        };

        fetchPipeline();
    }, [startDate, endDate, t]);

    return (
        <div className="shadow rounded-2xl p-4 border-1 bg-white">
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

            {/* Date range for deals chart */}
            <div className="flex gap-4 mb-4">
                <input
                    type="date"
                    value={startDate}
                    max={endDate || undefined}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm"
                />
                <input
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm"
                />
            </div>

            {loading && <div className="text-gray-500 text-sm mb-2">{t("Loading...")}</div>}
            {error && !loading && <div className="text-red-500 text-sm mb-2">{error}</div>}

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="stage"
                        tick={({ x, y, payload }) => {
                            const words = String(payload.value || "").split(" ");
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
                                ? Number(value).toLocaleString("en-EN") + " ֏"
                                : value
                        }
                    />
                    <Bar dataKey={mode}>
                        {data.map((entry, index) => {
                            const status = statusesItems.find((s) => s.name === entry.stage);
                            const fill = status?.colorHex || "#6366f1";
                            return (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={fill}
                                />
                            );
                        })}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
