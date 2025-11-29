"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { useCanAccess } from "@/hooks/useCanAccess";

/**
 * useIsAdmin
 *
 * Centralized check for whether the current user should be treated as "Admin".
 *
 * Rules:
 * - Prefer backend roles from auth.user.roles (array of role objects)
 *   - User is admin if any role has name "Admin" (case-insensitive)
 *   - AND roles_config for that role (via useCanAccess) grants "admin.dashboard" (or "all")
 * - If auth.user.roles is missing/empty, fall back to the single role string
 *   from useCurrentUserRole (e.g. stored in localStorage as auth_role).
 */
export function useIsAdmin() {
    const authUser = useSelector((state) => state.auth.user);
    const { role } = useCurrentUserRole();
    const { canAccess } = useCanAccess();

    const isAdmin = useMemo(() => {
        // Prefer backend roles array if present
        if (authUser && Array.isArray(authUser.roles) && authUser.roles.length > 0) {
            return authUser.roles.some((r) => {
                const name = String(r?.name || "").trim();
                if (!name) return false;
                if (name.toLowerCase() !== "admin") return false;

                // Also require that roles_config grants admin.dashboard (or all)
                return canAccess(name, "admin.dashboard");
            });
        }

        // Fallback to single role string (e.g., from auth_role)
        return String(role || "").trim().toLowerCase() === "admin";
    }, [authUser, role, canAccess]);

    return { isAdmin };
}
