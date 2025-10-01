"use client";

import React from "react";
import DataTable from "@/components/DataTable";
import { campaignData, tableColumns } from "@/constants";

export default function CampaignPageContent() {
    return (
        <DataTable
            initialData={campaignData}
            columns={tableColumns}
            title="Campaign"
        />
    );
}