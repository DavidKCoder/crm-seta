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
    PieChart, Pie, Cell, Legend,
} from "recharts";

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
    return (
        <div className="space-y-6 p-6 text-gray-900">
            <h1 className="text-2xl font-bold">📊 Statistics</h1>

            {/* Верхний ряд: LineChart + BarChart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* LineChart */}
                <Card className="shadow rounded-2xl">
                    <CardContent className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Revenue by month</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* BarChart  */}
                <Card className="shadow rounded-2xl">
                    <CardContent className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Revenue Distribution</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={revenuePieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label
                                >
                                    {revenuePieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Средний ряд: LineChart один */}
            <Card className="shadow rounded-2xl">
                <CardContent className="p-4">
                    <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
                    <p className="mb-4">Total revenue: ${totalRevenue.toLocaleString()}</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Нижний ряд: PieChart */}
            <Card className="shadow rounded-2xl">
                <CardContent className="p-4">
                    <h2 className="text-lg font-semibold mb-4">Deals by stage</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dealsByStage}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="stage" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
