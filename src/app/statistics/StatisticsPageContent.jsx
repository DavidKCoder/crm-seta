"use client";

import { useEffect, useMemo, useState } from "react";
import { FaUsers, FaBuilding, FaDollarSign, FaChartLine } from "react-icons/fa";
import { MdOutlineLibraryBooks } from "react-icons/md";
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
import { apiGet } from "@/lib/apiClient";

const PIE_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c", "#d0ed57"];

export default function StatisticsPageContent() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [stats, setStats] = useState({
        clientsTotal: 0,
        campaignsTotal: 0,
        dealsTotal: 0,
        packagesTotal: 0,
        expensesTotal: 0,
        expensesAmount: 0,
        pipelineTotalValue: 0,
    });
    const [monthlyExpenses, setMonthlyExpenses] = useState([]);
    const [roleExpenses, setRoleExpenses] = useState([]);
    const [expensesRaw, setExpensesRaw] = useState([]);

    const today = useMemo(() => new Date(), []);
    const defaultStart = useMemo(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        return d.toISOString().split("T")[0];
    }, []);
    const defaultEnd = useMemo(() => today.toISOString().split("T")[0], [today]);

    const [startDate, setStartDate] = useState(defaultStart);
    const [endDate, setEndDate] = useState(defaultEnd);

    useEffect(() => {
        const fetchStatistics = async () => {
            setLoading(true);
            setError("");
            try {
                const [
                    clientsRes,
                    campaignsRes,
                    dealsRes,
                    packagesRes,
                    expensesRes,
                    pipelineRes,
                ] = await Promise.all([
                    apiGet("/api/clients", {
                        page: 1,
                        limit: 1,
                        startDate: startDate || undefined,
                        endDate: endDate || undefined,
                    }),
                    apiGet("/api/campaigns", {
                        page: 1,
                        limit: 1,
                        startDate: startDate || undefined,
                        endDate: endDate || undefined,
                    }),
                    apiGet("/api/deals", {
                        page: 1,
                        limit: 1,
                        startDate: startDate || undefined,
                        endDate: endDate || undefined,
                    }),
                    apiGet("/api/packages", { page: 1, limit: 1 }),
                    apiGet("/api/expenses", {
                        page: 1,
                        limit: 100,
                        startDate: startDate || undefined,
                        endDate: endDate || undefined,
                    }),
                    apiGet("/api/deals/pipeline", {
                        startDate: startDate || undefined,
                        endDate: endDate || undefined,
                    }),
                ]);

                const clientsTotal = clientsRes?.meta?.total ?? (clientsRes?.data?.length || 0);
                const campaignsTotal = campaignsRes?.meta?.total ?? (campaignsRes?.data?.length || 0);
                const dealsTotal = dealsRes?.meta?.total ?? (dealsRes?.data?.length || 0);
                const packagesTotal = packagesRes?.meta?.total ?? (packagesRes?.data?.length || 0);

                const expenses = expensesRes?.data || [];
                setExpensesRaw(expenses);
                const expensesTotal = expenses.length;
                const expensesAmount = expenses.reduce(
                    (sum, e) => sum + (Number(e.total) || 0),
                    0,
                );

                const pipeline = pipelineRes?.data || [];
                const pipelineTotalValue = pipeline.reduce(
                    (sum, item) => sum + (Number(item?.totals?.value) || 0),
                    0,
                );

                setStats({
                    clientsTotal,
                    campaignsTotal,
                    dealsTotal,
                    packagesTotal,
                    expensesTotal,
                    expensesAmount,
                    pipelineTotalValue,
                });
            } catch (err) {
                console.error("Failed to load statistics:", err);
                setError(t("Failed to load statistics"));
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [startDate, endDate, t]);

    // Local date ranges for individual charts
    const [expensesStart, setExpensesStart] = useState(defaultStart);
    const [expensesEnd, setExpensesEnd] = useState(defaultEnd);
    const [rolesStart, setRolesStart] = useState(defaultStart);
    const [rolesEnd, setRolesEnd] = useState(defaultEnd);

    // Recompute daily expenses when raw expenses or local range changes
    useEffect(() => {
        const dailyMap = {};
        expensesRaw.forEach(expense => {
            if (!expense.createdAt) return;
            const created = new Date(expense.createdAt);
            if (expensesStart && created < new Date(expensesStart)) return;
            if (expensesEnd && created > new Date(expensesEnd)) return;
            const dateKey = created.toISOString().slice(0, 10); // YYYY-MM-DD
            dailyMap[dateKey] = (dailyMap[dateKey] || 0) + (Number(expense.total) || 0);
        });
        const dailyData = Object.entries(dailyMap)
            .map(([date, value]) => ({ date, value }))
            .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
        setMonthlyExpenses(dailyData);
    }, [expensesRaw, expensesStart, expensesEnd]);

    // Recompute role expenses when raw expenses or local range changes
    useEffect(() => {
        const roleMap = {};
        expensesRaw.forEach(expense => {
            if (!expense.createdAt) return;
            const created = new Date(expense.createdAt);
            if (rolesStart && created < new Date(rolesStart)) return;
            if (rolesEnd && created > new Date(rolesEnd)) return;
            (expense.items || []).forEach(item => {
                const roleName = item?.role?.name || t("Unknown role");
                const amount = Number(item.amount) || 0;
                roleMap[roleName] = (roleMap[roleName] || 0) + amount;
            });
        });
        const roleData = Object.entries(roleMap).map(([name, value]) => ({
            name,
            value,
        }));
        setRoleExpenses(roleData);
    }, [expensesRaw, rolesStart, rolesEnd, t]);

    const cards = [
        { value: stats.clientsTotal, label: t("dashboardMetrics.allCustomers"), icon: <FaUsers size={35} /> },
        { value: stats.campaignsTotal, label: t("dashboardMetrics.allCompanies"), icon: <FaBuilding size={35} /> },
        { value: stats.dealsTotal, label: t("dashboardMetrics.totalDeals"), icon: <MdOutlineLibraryBooks size={35} /> },
        {
            value: stats.expensesAmount.toLocaleString("en-US"),
            label: t("Total Expenses Amount"),
            icon: <FaDollarSign size={35} />,
        },
        {
            value: stats.pipelineTotalValue.toLocaleString("en-US"),
            label: t("Deals Total Price"),
            icon: <FaChartLine size={35} />,
        },
    ];

    return (
        <div className="space-y-6 p-6 text-gray-900">
            <h1 className="text-2xl font-bold">📊 {t("Statistics")}</h1>

            {/* Global date range filter */}
            <div className="flex flex-wrap gap-4 items-center mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">{t("From")}:</span>
                    <input
                        type="date"
                        value={startDate}
                        max={endDate || undefined}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border rounded-md px-2 py-1 text-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">{t("To")}:</span>
                    <input
                        type="date"
                        value={endDate}
                        min={startDate || undefined}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border rounded-md px-2 py-1 text-sm"
                    />
                </div>
            </div>

            {loading && <div className="text-gray-500">{t("Loading...")}</div>}
            {error && !loading && <div className="text-red-500">{error}</div>}

            {!loading && !error && (
                <>
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

                    {/* Deals by stage (pipeline) */}
                    <DealsBarChart />

                    {/* AreaChart Expenses with own date range */}
                    <div className="shadow rounded-2xl p-4 border bg-white">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">{t("Expenses Over Time")}</h3>
                            <div className="flex gap-3 items-center text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                    <span>{t("From")}:</span>
                                    <input
                                        type="date"
                                        value={expensesStart}
                                        max={expensesEnd || undefined}
                                        onChange={(e) => setExpensesStart(e.target.value)}
                                        className="border rounded-md px-2 py-1 text-xs"
                                    />
                                </div>
                                <div className="flex items-center gap-1">
                                    <span>{t("To")}:</span>
                                    <input
                                        type="date"
                                        value={expensesEnd}
                                        min={expensesStart || undefined}
                                        onChange={(e) => setExpensesEnd(e.target.value)}
                                        className="border rounded-md px-2 py-1 text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                        <AreaResponsive width="100%" height={300}>
                            <AreaChart
                                data={monthlyExpenses}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <AreaXAxis dataKey="date" />
                                <AreaYAxis />
                                <AreaGrid strokeDasharray="3 3" />
                                <AreaTooltip
                                    formatter={(value) =>
                                        Number(value).toLocaleString("en-EN") + " ֏"
                                    }
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#8884d8"
                                    fillOpacity={1}
                                    fill="url(#colorExp)"
                                />
                            </AreaChart>
                        </AreaResponsive>
                    </div>

                    {/* PieChart Expenses by Role with own date range */}
                    <div className="shadow rounded-2xl p-4 border bg-white w-full lg:w-1/2">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">{t("Expenses by Role")}</h3>
                            <div className="flex gap-3 items-center text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                    <span>{t("From")}:</span>
                                    <input
                                        type="date"
                                        value={rolesStart}
                                        max={rolesEnd || undefined}
                                        onChange={(e) => setRolesStart(e.target.value)}
                                        className="border rounded-md px-2 py-1 text-xs"
                                    />
                                </div>
                                <div className="flex items-center gap-1">
                                    <span>{t("To")}:</span>
                                    <input
                                        type="date"
                                        value={rolesEnd}
                                        min={rolesStart || undefined}
                                        onChange={(e) => setRolesEnd(e.target.value)}
                                        className="border rounded-md px-2 py-1 text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                        <PieResponsive width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={roleExpenses}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {roleExpenses.map((entry, index) => (
                                        <PieCell
                                            key={`cell-${index}`}
                                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <PieTooltip
                                    formatter={(value) =>
                                        Number(value).toLocaleString("en-EN") + " ֏"
                                    }
                                />
                                <PieLegend />
                            </PieChart>
                        </PieResponsive>
                    </div>
                </>
            )}
        </div>
    );
}
