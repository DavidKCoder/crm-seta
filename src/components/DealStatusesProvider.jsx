"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRoles } from "@/components/RolesProvider";
import { useDispatch, useSelector } from "react-redux";
import { fetchStatuses } from "@/features/statuses/statusesSlice";

const DealStatusesContext = createContext(null);

export function DealStatusesProvider({ children }) {
    const dispatch = useDispatch();
    const dealStatusesState = useSelector((state) => state.statuses.byEntity.deal);
    const [statuses, setStatuses] = useState([]);
    const DEFAULT_COLOR_MAP = useMemo(() => ({
        "New": "bg-sky-50 text-sky-700 border border-sky-200",
        "Pending": "bg-amber-50 text-amber-900 border border-amber-300",
        "Approved": "bg-emerald-50 text-emerald-900 border border-emerald-300",
        "Copy Writing": "bg-violet-50 text-violet-900 border border-violet-300",
        "Shooting": "bg-fuchsia-50 text-fuchsia-900 border border-fuchsia-300",
        "Design": "bg-indigo-50 text-indigo-900 border border-indigo-300",
        "Targeting": "bg-cyan-50 text-cyan-900 border border-cyan-300",
        "Completed": "bg-green-50 text-green-900 border border-green-300",
        "Lost": "bg-rose-50 text-rose-900 border border-rose-300",
    }), []);
    const [statusColors, setStatusColors] = useState(DEFAULT_COLOR_MAP);

    useEffect(() => {
        if (dealStatusesState.status === "idle") {
            dispatch(fetchStatuses("deal"));
        }
    }, [dispatch, dealStatusesState.status]);

    useEffect(() => {
        if (Array.isArray(dealStatusesState.items) && dealStatusesState.items.length > 0) {
            const names = dealStatusesState.items
                .map((s) => s.name)
                .filter((n) => typeof n === "string" && n.trim().length > 0);
            setStatuses(names);
        }
    }, [dealStatusesState.items]);

    const addStatus = (name) => {
        const n = String(name || "").trim();
        if (!n) return false;
        if (statuses.some((s) => s.toLowerCase() === n.toLowerCase())) return false;
        setStatuses((prev) => [...prev, n]);
        setStatusColors((prev) => ({ ...prev, [n]: "bg-gray-50 text-gray-700 border border-gray-300" }));
        return true;
    };

    const removeStatus = (name) => {
        setStatuses((prev) => prev.filter((s) => s !== name));
        setStatusColors((prev) => {
            const copy = { ...prev };
            delete copy[name];
            return copy;
        });
    };

    const { getRoleConfig } = useRoles();

    const getStatusesForRole = (role) => {
        const roleConfig = getRoleConfig(role);
        if (!roleConfig) return statuses;
        if (roleConfig.access?.includes("all") || roleConfig.access?.includes("deals")) return statuses;
        return statuses.filter((col) => roleConfig.access?.includes(col));
    };

    const getStatusStyle = (status) => statusColors[status] || "bg-gray-50 text-gray-700 border border-gray-300";
    const setStatusStyle = (status, styleClass) => {
        if (!status) return;
        setStatusColors((prev) => ({ ...prev, [status]: styleClass }));
    };

    const value = useMemo(
        () => ({ statuses, addStatus, removeStatus, getStatusesForRole, getStatusStyle, setStatusStyle, statusColors }),
        [statuses, statusColors]
    );

    return (
        <DealStatusesContext.Provider value={value}>{children}</DealStatusesContext.Provider>
    );
}

export function useDealStatuses() {
    const ctx = useContext(DealStatusesContext);
    if (!ctx) throw new Error("useDealStatuses must be used within DealStatusesProvider");
    return ctx;
}
