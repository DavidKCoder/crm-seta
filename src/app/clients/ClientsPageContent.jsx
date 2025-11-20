"use client";

import React, { useEffect } from "react";
import DataTable from "@/components/DataTable";
import { getTableColumns } from "@/constants";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchClients } from "@/features/clients/clientsSlice";

export default function ClientsPageContent() {
    const { t } = useTranslation();
    const columns = getTableColumns(t);
    const dispatch = useDispatch();
    const items = useSelector((state) => state.clients.items);
    const status = useSelector((state) => state.clients.status);
    const error = useSelector((state) => state.clients.error);

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchClients({ page: 1, limit: 100 }));
        }
    }, [dispatch, status]);

    if (status === "loading" && items.length === 0) {
        return <div>{t("Loading clients...")}</div>;
    }

    if (error && items.length === 0) {
        return <div className="text-red-600">{error}</div>;
    }
    
    return (
        <DataTable
            initialData={items}
            columns={columns}
            title="Clients"
        />
    );
}