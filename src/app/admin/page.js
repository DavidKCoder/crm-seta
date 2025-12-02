"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRoles } from "@/components/RolesProvider";
import { apiGet, apiPost, apiDelete, apiPut } from "@/lib/apiClient";
import RolesTab from "./components/RolesTab";
import StatusesTab from "./components/StatusesTab";
import UsersTab from "./components/UsersTab";
import NotAccess from "@/components/NotAccess";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { fetchStatuses } from "@/features/statuses/statusesSlice";
import { useDispatch } from "react-redux";

const MODULES = ["clients", "campaign", "deals", "expenses", "packages", "statistics"];
const ADMIN_TOOLS = ["admin.dashboard", "manage.roles", "manage.statuses"];

export default function AdminDashboardPage() {
    const { t } = useTranslation();
    const { roles, setRoleAccess, getRoleConfig } = useRoles();
    const { isAdmin } = useIsAdmin();
    const dispatch = useDispatch();

    // State management
    const [backendRoles, setBackendRoles] = useState([]);
    const [activeTab, setActiveTab] = useState("roles");
    const [isCreatingRole, setIsCreatingRole] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);
    const [newRole, setNewRole] = useState({ name: "", description: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load roles on component mount
    const loadRoles = useCallback(async () => {
        try {
            const data = await apiGet("/api/roles");
            const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
            const withNames = list.filter((r) => r && typeof r.name === "string" && r.name.trim().length > 0);
            withNames.sort((a, b) => a.name.localeCompare(b.name));
            setBackendRoles(withNames);
        } catch (error) {
            console.error("Error loading roles:", error);
            setError(t("Failed to load roles. Please refresh the page."));
        }
    }, [t]);

    // Initialize roles on mount
    useEffect(() => {
        loadRoles();
        dispatch(fetchStatuses(""));
    }, [dispatch, loadRoles]);

    // Handle role creation
    const handleCreateRole = useCallback(async (e) => {
        e?.preventDefault();
        setError("");
        setSuccess("");

        if (!newRole.name.trim()) {
            setError(t("Role name is required"));
            return;
        }

        setIsSubmitting(true);

        try {
            await apiPost("/api/roles", {
                name: newRole.name.trim(),
                description: newRole.description.trim(),
            });

            setSuccess(t(`Role "${newRole.name}" created successfully!`));
            setNewRole({ name: "", description: "" });
            setIsCreatingRole(false);
            await loadRoles();
        } catch (error) {
            console.error("Error creating role:", error);
            setError(error.message || t("Failed to create role. Please try again."));
        } finally {
            setIsSubmitting(false);
        }
    }, [newRole, t, loadRoles]);

    // Toggle permission for a role
    const togglePermission = useCallback((roleName, key) => {
        const cfg = getRoleConfig(roleName) || { access: [] };
        const acc = new Set(cfg.access || []);
        if (acc.has("all")) acc.delete("all");
        if (acc.has(key)) acc.delete(key); else acc.add(key);
        setRoleAccess(roleName, Array.from(acc));
    }, [getRoleConfig, setRoleAccess]);

    // Toggle all permissions for a role
    const toggleAllForRole = useCallback((roleName) => {
        const cfg = getRoleConfig(roleName) || { access: [] };
        const hasAll = (cfg.access || []).includes("all");
        setRoleAccess(roleName, hasAll ? [] : ["all"]);
    }, [getRoleConfig, setRoleAccess]);

    // Handle delete role click
    const handleDeleteClick = useCallback((role) => {
        setRoleToDelete(role);
    }, []);

    // Handle role deletion
    const confirmDeleteRole = useCallback(async () => {
        if (!roleToDelete) return;

        setError("");
        setSuccess("");
        setIsSubmitting(true);

        try {
            const roleId = roleToDelete.id || roleToDelete._id;
            await apiDelete(`/api/roles/${roleId}`);

            setSuccess(t(`Role "${roleToDelete.name}" deleted successfully`));
            setBackendRoles(prev =>
                prev.filter(r => (r.id || r._id) !== roleId),
            );

            const timer = setTimeout(() => {
                setSuccess("");
                setRoleToDelete(null);
            }, 1000);

            return () => clearTimeout(timer);
        } catch (err) {
            console.error("Error deleting role:", err);
            setError(err.response?.data?.message || err.message || t("Failed to delete role"));
        } finally {
            setIsSubmitting(false);
        }
    }, [roleToDelete, t]);

    if (!isAdmin) {
        return <NotAccess />;
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{t("Admin Dashboard")}</h1>
                {activeTab === "roles" && (
                    <button
                        type="button"
                        onClick={() => {
                            setIsCreatingRole(true);
                            setError("");
                            setSuccess("");
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        {t("Create Role")}
                    </button>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {roleToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md text-black">
                        <h2 className="text-xl font-bold mb-4">{t("Delete Role")}</h2>

                        {error && (
                            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                                {success}
                            </div>
                        )}

                        <p className="mb-6">
                            {t("Are you sure you want to delete the role")}{" "}
                            <span className="font-semibold">{roleToDelete?.name}</span>?{" "}
                            {t("This action cannot be undone.")}
                        </p>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setRoleToDelete(null);
                                    setError("");
                                    setSuccess("");
                                }}
                                className="px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer"
                                disabled={isSubmitting}
                            >
                                {t("Cancel")}
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteRole}
                                className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        {t("Deleting...")}
                                    </span>
                                ) : (
                                    t("Delete")
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Role Modal */}
            {isCreatingRole && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{t("Create New Role")}</h2>

                        {error && (
                            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleCreateRole}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    {t("Role Name")} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newRole.name}
                                    onChange={(e) => setNewRole((prev) => ({ ...prev, name: e.target.value }))}
                                    className="w-full p-2 border rounded"
                                    placeholder={t("Enter role name")}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    {t("Description")}
                                </label>
                                <textarea
                                    name="description"
                                    value={newRole.description}
                                    onChange={(e) => setNewRole((prev) => ({ ...prev, description: e.target.value }))}
                                    className="w-full p-2 border rounded"
                                    placeholder={t("Enter role description")}
                                    rows="3"
                                />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreatingRole(false);
                                        setNewRole({ name: "", description: "" });
                                        setError("");
                                        setSuccess("");
                                    }}
                                    className="px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer"
                                >
                                    {t("Cancel")}
                                </button>
                                <button
                                    type="submit"
                                    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            {t("Creating...")}
                                        </span>
                                    ) : (
                                        t("Create")
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    type="button"
                    onClick={() => setActiveTab("roles")}
                    className={`px-4 py-2 font-medium cursor-pointer ${activeTab === "roles" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                    {t("Roles")}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("statuses")}
                    className={`px-4 py-2 font-medium cursor-pointer ${activeTab === "statuses" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                    {t("Statuses")}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("users")}
                    className={`px-4 py-2 font-medium cursor-pointer ${activeTab === "users" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                    {t("Users")}
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "roles" && (
                <RolesTab
                    roles={roles}
                    backendRoles={backendRoles}
                    togglePermission={togglePermission}
                    toggleAllForRole={toggleAllForRole}
                    MODULES={MODULES}
                    handleDeleteClick={handleDeleteClick}
                    t={t}
                />
            )}

            {activeTab === "statuses" && <StatusesTab />}

            {activeTab === "users" && (
                <UsersTab
                    backendRoles={backendRoles}
                    apiPost={apiPost}
                    fetchUsers={apiGet}
                    apiPut={apiPut}
                    apiDelete={apiDelete}
                    t={t}
                />
            )}
        </div>
    );
}
