"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useRoles } from "@/components/RolesProvider";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { useCanAccess } from "@/hooks/useCanAccess";

export default function AdminDashboardPage() {
    const { t } = useTranslation();
    const { roles, setRoleAccess, getRoleConfig } = useRoles();
    const { role } = useCurrentUserRole();
    const { canAccess } = useCanAccess();

    // Static resources (not hooks) to avoid conditional hook order changes
    const MODULES = ["clients", "campaign", "deals", "expenses", "packages", "statistics"];
    const ADMIN_TOOLS = ["admin.dashboard", "manage.roles", "manage.statuses"];

    // Only users with admin.dashboard permission may view
    if (!canAccess(role, "admin.dashboard")) return null;

    const togglePermission = (roleName, key) => {
        const cfg = getRoleConfig(roleName) || { access: [] };
        const acc = new Set(cfg.access || []);
        if (acc.has("all")) acc.delete("all");
        if (acc.has(key)) acc.delete(key); else acc.add(key);
        setRoleAccess(roleName, Array.from(acc));
    };

    const toggleAllForRole = (roleName) => {
        const cfg = getRoleConfig(roleName) || { access: [] };
        const hasAll = (cfg.access || []).includes("all");
        setRoleAccess(roleName, hasAll ? [] : ["all"]);
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{t("Admin Dashboard")}</h1>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Roles x Modules */}
                <div className="bg-white border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold">{t("Permissions")} — {t("Modules")}</h2>
                    </div>
                    <div className="flex flex-col gap-4">
                        {Object.keys(roles).map((r) => {
                            const acc = roles[r]?.access || [];
                            const hasAll = acc.includes("all");
                            return (
                                <div key={r} className="border rounded p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="font-medium">{r}</div>
                                        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                                            <input type="checkbox" checked={hasAll} onChange={() => toggleAllForRole(r)} />
                                            <span>{t("All")}</span>
                                        </label>
                                    </div>
                                    {!hasAll && (
                                        <div className="flex flex-wrap gap-2">
                                            {MODULES.map((m) => (
                                                <label key={m} className="flex items-center gap-2 text-sm cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={acc.includes(m)}
                                                        onChange={() => togglePermission(r, m)}
                                                    />
                                                    <span className="px-2 py-0.5 rounded bg-white border text-gray-700">{m}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Roles x Admin tools */}
                <div className="bg-white border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold">{t("Permissions")} — {t("Admin tools")}</h2>
                    </div>
                    <div className="flex flex-col gap-4">
                        {Object.keys(roles).map((r) => {
                            const acc = roles[r]?.access || [];
                            const hasAll = acc.includes("all");
                            return (
                                <div key={r} className="border rounded p-3">
                                    <div className="font-medium mb-2">{r}</div>
                                    {hasAll ? (
                                        <div className="text-sm text-gray-500">{t("All")}</div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {ADMIN_TOOLS.map((m) => (
                                                <label key={m} className="flex items-center gap-2 text-sm cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={acc.includes(m)}
                                                        onChange={() => togglePermission(r, m)}
                                                    />
                                                    <span className="px-2 py-0.5 rounded bg-white border text-gray-700">{m}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
