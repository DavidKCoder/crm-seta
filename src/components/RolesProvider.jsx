"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { rolesConfig as defaultRolesConfig } from "@/constants";

const RolesContext = createContext(null);

export function RolesProvider({ children }) {
    const [roles, setRoles] = useState(defaultRolesConfig);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("roles_config");
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === "object") {
                    setRoles((prev) => ({ ...prev, ...parsed }));
                }
            }
        } catch {
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem("roles_config", JSON.stringify(roles));
        } catch {
        }
    }, [roles]);

    const addRole = (name, config = { access: [], restricted: [] }) => {
        const n = String(name || "").trim();
        if (!n || roles[n]) return false;
        setRoles((prev) => ({ ...prev, [n]: config }));
        return true;
    };

    const removeRole = (name) => {
        setRoles((prev) => {
            const copy = { ...prev };
            delete copy[name];
            return copy;
        });
    };

    const setRoleAccess = (name, accessArray) => {
        setRoles((prev) => ({
            ...prev,
            [name]: { ...(prev[name] || {}), access: Array.isArray(accessArray) ? accessArray : [] },
        }));
    };

    const setRoleRestricted = (name, restrictedArray) => {
        setRoles((prev) => ({
            ...prev,
            [name]: { ...(prev[name] || {}), restricted: Array.isArray(restrictedArray) ? restrictedArray : [] },
        }));
    };

    const getRoleConfig = (name) => roles[name] || null;

    const value = useMemo(
        () => ({ roles, addRole, removeRole, setRoleAccess, setRoleRestricted, getRoleConfig }),
        [roles],
    );

    return <RolesContext.Provider value={value}>{children}</RolesContext.Provider>;
}

export function useRoles() {
    const ctx = useContext(RolesContext);
    if (!ctx) throw new Error("useRoles must be used within RolesProvider");
    return ctx;
}
