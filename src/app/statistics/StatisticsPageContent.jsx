"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import DealsBarChart from "@/app/statistics/DealsBarChart";
import { useTranslation } from "react-i18next";

const revenueData = [
    { month: "Jan", revenue: 5000 },
    { month: "Feb", revenue: 8000 },
    { month: "Mar", revenue: 12000 },
    { month: "Apr", revenue: 9000 },
    { month: "May", revenue: 15000 },
    { month: "Jun", revenue: 20000 },
];

const dealsByStage = [
    { stage: "Lead", count: 5 },
    { stage: "Contacted", count: 8 },
    { stage: "Qualified", count: 3 },
    { stage: "Proposal", count: 6 },
];

const revenuePieData = [
    { name: "Jan", value: 5000 },
    { name: "Feb", value: 8000 },
    { name: "Mar", value: 12000 },
    { name: "Apr", value: 9000 },
    { name: "May", value: 15000 },
    { name: "Jun", value: 20000 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c", "#d0ed57"];

const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);

export default function StatisticsPageContent() {
    const { t } = useTranslation();

    return (
        <div className="space-y-6 p-6 text-gray-900">
            <h1 className="text-2xl font-bold">📊 {t("Statistics")}</h1>

            {/* Верхний ряд: LineChart + BarChart */}
            <div className="">
                {/* LineChart */}
                {/*<Card className="shadow rounded-2xl">*/}
                {/*    <CardContent className="p-4">*/}
                {/*        <h2 className="text-lg font-semibold mb-4">Revenue by month</h2>*/}
                {/*        <ResponsiveContainer width="100%" height={300}>*/}
                {/*            <LineChart data={revenueData}>*/}
                {/*                <CartesianGrid strokeDasharray="3 3" />*/}
                {/*                <XAxis dataKey="month" />*/}
                {/*                <YAxis />*/}
                {/*                <Tooltip />*/}
                {/*                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} />*/}
                {/*            </LineChart>*/}
                {/*        </ResponsiveContainer>*/}
                {/*    </CardContent>*/}
                {/*</Card>*/}
                <DealsBarChart />
            </div>

            {/* Средний ряд: LineChart один */}
            {/*<Card className="shadow rounded-2xl">*/}
            {/*    <CardContent className="p-4">*/}
            {/*        <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>*/}
            {/*        <p className="mb-4">Total revenue: ${totalRevenue.toLocaleString()}</p>*/}
            {/*        <ResponsiveContainer width="100%" height={300}>*/}
            {/*            <LineChart data={revenueData}>*/}
            {/*                <CartesianGrid strokeDasharray="3 3" />*/}
            {/*                <XAxis dataKey="month" />*/}
            {/*                <YAxis />*/}
            {/*                <Tooltip />*/}
            {/*                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />*/}
            {/*            </LineChart>*/}
            {/*        </ResponsiveContainer>*/}
            {/*    </CardContent>*/}
            {/*</Card>*/}
        </div>
    );
}
