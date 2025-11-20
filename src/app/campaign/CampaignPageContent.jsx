"use client";

import React, { useEffect } from "react";
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

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchCampaigns({ page: 1, limit: 100 }));
        }
    }, [dispatch, status]);

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
        />
    );
}