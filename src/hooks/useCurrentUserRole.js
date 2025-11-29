"use client";

import { useEffect, useState } from "react";

export function useCurrentUserRole() {
    const [role, setRole] = useState(undefined);


    useEffect(() => {
        try {
            const storedRole = typeof window !== "undefined" ? localStorage.getItem("auth_role") : null;
            if (storedRole) {
                const normalized = String(storedRole).trim();
                setRole(normalized || "Guest");
                return;
            }
            const rawUser = typeof window !== "undefined" ? localStorage.getItem("auth_user") : null;

            if (rawUser) {
                const parsed = JSON.parse(rawUser);
                if (parsed?.role) {
                    const normalized = String(parsed.role).trim();
                    setRole(normalized || "Guest");
                    return;
                }
            }
            const envRole = process.env.NEXT_PUBLIC_CURRENT_USER;
            const normalizedEnv = String(envRole || "Guest").trim();
            setRole(normalizedEnv || "Guest");
        } catch {
            const fallback = String(process.env.NEXT_PUBLIC_CURRENT_USER || "Guest").trim();
            setRole(fallback || "Guest");
        }
    }, []);

    const updateRole = (newRole) => {
        try {
            const normalized = String(newRole || "").trim();
            localStorage.setItem("auth_role", normalized);
            setRole(normalized || "Guest");
        } catch {}
    };

    return { role, setRole: updateRole };
}
