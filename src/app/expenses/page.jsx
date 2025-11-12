"use client";

import React, { useState } from "react";
import DataTable from "@/components/DataTable";
import { useTranslation } from "react-i18next";
import { expensesColumns } from "@/constants";

export default function ExpensesPage() {
    const { t } = useTranslation();

    const [initialData, setInitialData] = useState([
        {
            id: 1,
            dealId: "101",
            salesManager: 500,
            copyWriter: 200,
            designer: 300,
            targeting: 150,
            shooting: 400,
            other: "Video editing",
        },
        {
            id: 2,
            dealId: "102",
            salesManager: 600,
            copyWriter: 250,
            designer: 200,
            targeting: 200,
            shooting: 300,
            other: "Freelancer support",
        },
        {
            id: 3,
            dealId: "103",
            salesManager: 450,
            copyWriter: 300,
            designer: 250,
            targeting: 100,
            shooting: 350,
            other: "Social media assets",
        },
        {
            id: 4,
            dealId: "104",
            salesManager: 700,
            copyWriter: 400,
            designer: 300,
            targeting: 250,
            shooting: 500,
            other: "Campaign setup",
        },
        {
            id: 5,
            dealId: "105",
            salesManager: 550,
            copyWriter: 350,
            designer: 400,
            targeting: 150,
            shooting: 450,
            other: "Photography",
        },
        {
            id: 6,
            dealId: "106",
            salesManager: 480,
            copyWriter: 220,
            designer: 320,
            targeting: 180,
            shooting: 420,
            other: "Content strategy",
        },
        {
            id: 7,
            dealId: "107",
            salesManager: 620,
            copyWriter: 280,
            designer: 350,
            targeting: 220,
            shooting: 380,
            other: "Influencer collaboration",
        },
        {
            id: 8,
            dealId: "108",
            salesManager: 520,
            copyWriter: 320,
            designer: 280,
            targeting: 170,
            shooting: 470,
            other: "Brand guidelines",
        },
        {
            id: 9,
            dealId: "109",
            salesManager: 580,
            copyWriter: 270,
            designer: 330,
            targeting: 190,
            shooting: 410,
            other: "Email marketing",
        },
        {
            id: 10,
            dealId: "110",
            salesManager: 650,
            copyWriter: 380,
            designer: 420,
            targeting: 240,
            shooting: 520,
            other: "Analytics reporting",
        },
    ].map(item => ({
        ...item,
        total:
            (item.salesManager || 0) +
            (item.copyWriter || 0) +
            (item.designer || 0) +
            (item.targeting || 0) +
            (item.shooting || 0),
    })));

    return (
        <div className="p-6">
            <DataTable
                initialData={initialData}
                columns={expensesColumns}
                title={t("Expenses")}
            />
        </div>
    );
}
