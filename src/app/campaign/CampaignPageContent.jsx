"use client";

import React from "react";
import DataTable from "@/components/DataTable";
import { campaignData, getTableColumns } from "@/constants";
import { useTranslation } from "react-i18next";

export default function CampaignPageContent() {
    const { t } = useTranslation();
    const columns = getTableColumns(t);

    return (
        <DataTable
            initialData={campaignData}
            columns={columns}
            title="Campaign"
        />
    );
}