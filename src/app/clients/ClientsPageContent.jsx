"use client";

import React, { useEffect, useMemo, useState } from "react";
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

    const today = useMemo(() => new Date(), []);
    const defaultStart = useMemo(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        return d.toISOString().split("T")[0];
    }, []);
    const defaultEnd = useMemo(() => today.toISOString().split("T")[0], [today]);
    const [dateRange, setDateRange] = useState({ startDate: defaultStart, endDate: defaultEnd });

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchClients({
                page: 1,
                limit: 100,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
            }));
        }
    }, [dispatch, status]);

    useEffect(() => {
        if (status === "succeeded" || status === "loading") {
            dispatch(fetchClients({
                page: 1,
                limit: 100,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
            }));
        }
    }, [dispatch, dateRange.startDate, dateRange.endDate]);

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
            title="Client"
            onDateRangeChange={(range) => setDateRange(range)}
            initialStartDate={dateRange.startDate}
            initialEndDate={dateRange.endDate}
        />
    );
}