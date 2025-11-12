"use client";

import { useRoles } from "@/components/RolesProvider";

// Resource keys examples:
// - modules: clients, campaign, deals, expenses, packages, statistics
// - admin tools: manage.roles, manage.statuses, admin.dashboard
export function useCanAccess() {
    const { getRoleConfig } = useRoles();

    const canAccess = (role, resource) => {
        const cfg = getRoleConfig(role);
        if (!cfg) return false;
        const access = cfg.access || [];
        if (access.includes("all")) return true;
        // deals special-case remains: allow deals or deals.*
        if (resource === "deals") {
            return access.includes("deals") || access.some((r) => r.startsWith("deals."));
        }
        return access.includes(resource);
    };

    return { canAccess };
}
