"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useRoles } from "@/components/RolesProvider";
import { useTranslation } from "react-i18next";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { apiGet, apiPost, apiDelete } from "@/lib/apiClient";
import { useDispatch, useSelector } from "react-redux";
import { fetchStatuses } from "@/features/statuses/statusesSlice";

export default function RolesManager({ show, onClose }) {
    const { t } = useTranslation();
    const { roles, addRole, removeRole, setRoleAccess, getRoleConfig } = useRoles();
    const dispatch = useDispatch();
    const statusesItems = useSelector((state) => state.statuses?.items || []);
    const statuses = useMemo(() => statusesItems.map((s) => s.name), [statusesItems]);
    const [newRole, setNewRole] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [backendRoles, setBackendRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const { role } = useCurrentUserRole();

    const MODULES = useMemo(() => ["clients", "campaign", "deals", "packages", "statistics"], []);

    useEffect(() => {
        if (!show) return;
        let isMounted = true;
        const loadRoles = async () => {
            setLoading(true);
            try {
                const data = await apiGet("/api/roles");
                const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
                if (!isMounted) return;
                const withNames = list.filter((r) => r && typeof r.name === "string" && r.name.trim().length > 0);
                setBackendRoles(withNames);

                // Ensure each backend role has a local config entry for access flags
                withNames.forEach((r) => {
                    if (!roles[r.name]) {
                        addRole(r.name, { access: [], restricted: [] });
                    }
                });
            } catch {
                if (!isMounted) return;
                setBackendRoles([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadRoles();
        if (show) {
            dispatch(fetchStatuses());
        }
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, dispatch]);

    if (!show) return null;
    if (role !== "Admin") return null;

    const handleAddRole = async () => {
        const name = newRole.trim();
        if (!name) return;
        try {
            const created = await apiPost("/api/roles", { name, description: newDescription || null });
            const roleData = created?.data || created;
            // Update backend roles list
            setBackendRoles((prev) => {
                const exists = prev.some((r) => r.id === roleData.id);
                return exists ? prev : [...prev, roleData];
            });
            // Ensure local access config exists
            addRole(roleData.name, { access: [], restricted: [] });
            setNewRole("");
            setNewDescription("");
        } catch {
        }
    };

    const toggleAccess = (roleName, key) => {
        const cfg = getRoleConfig(roleName) || { access: [] };
        const acc = new Set(cfg.access || []);
        if (acc.has("all")) acc.delete("all");
        if (acc.has(key)) acc.delete(key); else acc.add(key);
        setRoleAccess(roleName, Array.from(acc));
    };

    const toggleAllAccess = (roleName) => {
        const cfg = getRoleConfig(roleName) || { access: [] };
        const hasAll = (cfg.access || []).includes("all");
        setRoleAccess(roleName, hasAll ? [] : ["all"]);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 text-gray-800">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <IoMdClose size={24} />
                </button>

                <h2 className="text-xl font-semibold mb-4">{t("Manage roles")}</h2>

                {/* Add role */}
                <div className="flex flex-col gap-2 mb-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder={t("Role name")}
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="border p-2 rounded flex-1"
                        />
                        <input
                            type="text"
                            placeholder={t("Description")}
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            className="border p-2 rounded flex-1"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={handleAddRole}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
                            disabled={!newRole.trim()}
                        >
                            {t("Add")}
                        </button>
                    </div>
                </div>

                {/* Roles list from backend */}
                <div className="flex flex-col gap-3 max-h-[60vh] overflow-auto pr-1">
                    {loading && backendRoles.length === 0 && (
                        <div className="text-sm text-gray-500">{t("Loading roles...")}</div>
                    )}
                    {backendRoles.map((r) => {
                        const roleName = r.name;
                        const cfg = roles[roleName] || {};
                        const acc = cfg?.access || [];
                        const allAccess = acc.includes("all");
                        return (
                            <div key={roleName} className="border rounded p-3 bg-gray-50 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium text-gray-900">{roleName}</div>
                                    {roleName !== "Admin" && (
                                        <button
                                            className="text-red-600 hover:text-red-700 text-sm font-medium cursor-pointer"
                                            onClick={async () => {
                                                try {
                                                    await apiDelete(`/api/roles/${r.id}`);
                                                    setBackendRoles((prev) => prev.filter((br) => br.id !== r.id));
                                                    removeRole(roleName);
                                                } catch {
                                                }
                                            }}
                                        >
                                            {t("Remove")}
                                        </button>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    {/* All access toggle */}
                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={allAccess}
                                            onChange={() => toggleAllAccess(roleName)}
                                        />
                                        <span className="text-sm text-gray-800">{t("All")}</span>
                                    </label>

                                    {/* Modules */}
                                    {!allAccess && (
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">{t("Modules")}</div>
                                            <div className="flex flex-wrap gap-2">
                                                {MODULES.map((m) => (
                                                    <label key={m} className="flex items-center gap-2 text-sm cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={acc.includes(m)}
                                                            onChange={() => toggleAccess(roleName, m)}
                                                        />
                                                        <span className="px-2 py-0.5 rounded bg-white border text-gray-700">{m}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Deal statuses */}
                                    {!allAccess && (
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">{t("Deal statuses")}</div>
                                            <div className="flex flex-wrap gap-2">
                                                {statuses.map((st) => (
                                                    <label key={st} className="flex items-center gap-2 text-sm cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={acc.includes(st)}
                                                            onChange={() => toggleAccess(roleName, st)}
                                                        />
                                                        <span className="px-2 py-0.5 rounded bg-white border text-gray-700">{st}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
