"use client"

import React from "react";
import DataTable from "@/components/DataTable";
import { clientsData, tableColumns } from "@/constants";

export default function ClientsPageContent() {
    return (
        <DataTable
            initialData={clientsData}
            columns={tableColumns}
            title="Client"
        />
    )
}