"use client";

import React, { useEffect, useMemo, useState } from "react";
import DataTable from "@/components/DataTable";
import { getTableColumns } from "@/constants";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaigns } from "@/features/campaigns/campaignsSlice";

export default function CampaignPageContent() {
    const { t } = useTranslation();
    const columns = getTableColumns(t);
    const dispatch = useDispatch();
    const items = useSelector((state) => state.campaigns.items);
    const status = useSelector((state) => state.campaigns.status);
    const error = useSelector((state) => state.campaigns.error);

    const today = useMemo(() => new Date(), []);

    const defaultStart = useMemo(() => {
        return new Date(today.getFullYear(), today.getMonth(), 1)
            .toISOString()
            .split("T")[0];
    }, [today]);

    const defaultEnd = useMemo(() => {
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return lastDay.toISOString().split("T")[0];
    }, [today]);
    const [dateRange, setDateRange] = useState({ startDate: defaultStart, endDate: defaultEnd });

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchCampaigns({
                page: 1,
                limit: 100,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
            }));
        }
    }, [dispatch, status]);

    useEffect(() => {
        if (status === "succeeded" || status === "loading") {
            dispatch(fetchCampaigns({
                page: 1,
                limit: 100,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
            }));
        }
    }, [dispatch, dateRange.startDate, dateRange.endDate]);

    if (status === "loading" && items.length === 0) {
        return <div>{t("Loading campaigns...")}</div>;
    }

    if (error && items.length === 0) {
        return <div className="text-red-600">{error}</div>;
    }

    return (
        <DataTable
            initialData={items}
            columns={columns}
            title="Campaign"
            onDateRangeChange={(range) => setDateRange(range)}
            initialStartDate={dateRange.startDate}
            initialEndDate={dateRange.endDate}
        />
    );
}