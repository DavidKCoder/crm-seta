"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { useCanAccess } from "@/hooks/useCanAccess";

export function useIsManager() {
    const authUser = useSelector((state) => state.auth.user);
    const { role } = useCurrentUserRole();
    const { canAccess } = useCanAccess();

    const isManager = useMemo(() => {
        if (!authUser) {
            return false
        }
        if (authUser && Array.isArray(authUser.roles) && authUser.roles.length > 0) {
            return authUser.roles.some((r) => {
                const name = String(r?.name || "").trim();
                if (!name) return false;
                if (name.toLowerCase() !== "manager") return false;

                return canAccess(name, "");
            });
        }

        return String(role || "").trim().toLowerCase() === "manager";
    }, [authUser, role, canAccess]);

    return { isManager };
}
