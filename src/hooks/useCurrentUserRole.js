"use client";

import { useEffect, useState } from "react";

export function useCurrentUserRole() {
    const [role, setRole] = useState(undefined);

    useEffect(() => {
        try {
            const storedRole = typeof window !== "undefined" ? localStorage.getItem("auth_role") : null;
            if (storedRole) {
                setRole(storedRole);
                return;
            }
            const rawUser = typeof window !== "undefined" ? localStorage.getItem("auth_user") : null;
            if (rawUser) {
                const parsed = JSON.parse(rawUser);
                if (parsed?.role) {
                    setRole(parsed.role);
                    return;
                }
            }
            const envRole = process.env.NEXT_PUBLIC_CURRENT_USER;
            setRole(envRole || "Guest");
        } catch {
            setRole(process.env.NEXT_PUBLIC_CURRENT_USER || "Guest");
        }
    }, []);

    const updateRole = (newRole) => {
        try {
            localStorage.setItem("auth_role", newRole);
            setRole(newRole);
        } catch {}
    };

    return { role, setRole: updateRole };
}
