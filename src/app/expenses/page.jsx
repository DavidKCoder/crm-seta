"use client";

import React, { useEffect, useState, useMemo } from "react";
import DataTable from "@/components/DataTable";
import { useTranslation } from "react-i18next";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient";
import { withRoleProtection } from "@/app/utils/withRoleProtection";

function ExpensesPage() {
    const { t } = useTranslation();
    const [roles, setRoles] = useState([]);
    const [dynamicColumns, setDynamicColumns] = useState([]);
    const [expensesList, setExpensesList] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [dealsList, setDealsList] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ ...notification, show: false }), 3000);
    };

    const baseColumns = useMemo(() => ([
        { key: "dealDisplay", label: "Deal", sortable: true },
        { key: "assignedUsersDisplay", label: "Assigned Users", sortable: false },
    ]), []);

    const trailingColumns = useMemo(() => ([
        { key: "total", label: "Total", sortable: true },
        { key: "notes", label: "Notes", sortable: false },
        { key: "action", label: "Actions", sortable: false },
    ]), []);

    const buildExpenseRow = (expense) => {
        const roleAmounts = {};
        (expense.items || []).forEach(item => {
            if (!item?.roleId) {
                return;
            }
            const amountValue = Number(item.amount) || 0;
            roleAmounts[item.roleId] = (roleAmounts[item.roleId] || 0) + amountValue;
        });

        const assignedUsers = Array.isArray(expense.assignedUsers) ? expense.assignedUsers : [];
        const assignedUsersDisplay = assignedUsers
            .map(user => [user.firstName, user.lastName].filter(Boolean).join(" ").trim())
            .filter(Boolean)
            .join(", ") || "-";

        const assignedToUserIds = assignedUsers.map(user => user.id).filter(Boolean);

        const normalizedItems = (expense.items || []).map((item, index) => ({
            roleId: item.roleId,
            role: item.role,
            amount: item.amount,
            userId: item.userId || assignedToUserIds[index] || assignedToUserIds[0] || "",
        }));

        return {
            id: expense.id,
            deal: expense.deal,
            dealId: expense.deal?.id || "",
            dealDisplay: expense.deal?.name
                || (expense.deal?.id ? `#${String(expense.deal.id).slice(0, 6)}` : "-"),
            items: normalizedItems,
            assignedUsers,
            assignedUsersDisplay,
            assignedToUserIds,
            notes: expense.notes || "",
            total: Number(expense.total) || 0,
            createdAt: expense.createdAt,
            updatedAt: expense.updatedAt,
            ...roleAmounts,
        };
    };

    // Fetch expenses
    const fetchExpenses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiGet("/api/expenses");
            if (response && Array.isArray(response.data)) {
                const formatted = response.data.map(buildExpenseRow);
                setExpensesList(formatted);
                setFilteredExpenses(formatted);
            }
        } catch (err) {
            console.error("Error fetching expenses:", err);
            setError(t("Failed to load expenses. Please try again later."));
            showNotification(t("Failed to load expenses"), 'error');
        } finally {
            setLoading(false);
        }
    };

    // Fetch deals
    const fetchDeals = async () => {
        try {
            const response = await apiGet("/api/deals");
            if (response && Array.isArray(response.data)) {
                setDealsList(response.data);
            }
        } catch (error) {
            console.error("Error fetching deals:", error);
            showNotification(t("Failed to load deals"), 'error');
        }
    };

    // Fetch users
    const fetchUsers = async () => {
        try {
            const response = await apiGet("/api/users");
            if (response && Array.isArray(response.data)) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            showNotification(t("Failed to load users"), 'error');
        }
    };

    // Fetch roles
    const fetchRoles = async () => {
        try {
            const response = await apiGet("/api/roles");
            if (response && Array.isArray(response.data)) {
                setRoles(response.data);
                const roleColumns = response.data.map(role => ({
                    key: role.id,
                    label: role.name,
                    sortable: true,
                    roleId: role.id
                }));
                setDynamicColumns([...baseColumns, ...roleColumns, ...trailingColumns]);
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            showNotification(t("Failed to load roles"), 'error');
        }
    };

    // Initial data loading
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                fetchExpenses(),
                fetchDeals(),
                fetchRoles(),
                fetchUsers()
            ]);
        };
        loadData();
    }, []);

    // Handle save (create/update) expense
    const handleSave = async (formData) => {
        try {
            let response;
            if (formData.id) {
                // Update existing expense
                response = await apiPut(`/api/expenses/${formData.id}`, formData);
                if (response.data) {
                    showNotification(t("Expense updated successfully"));
                    await fetchExpenses();
                    return true;
                }
            } else {
                // Create new expense
                response = await apiPost('/api/expenses', formData);
                if (response.data) {
                    showNotification(t("Expense created successfully"));
                    await fetchExpenses();
                    return true;
                }
            }
            showNotification(t("Failed to save expense"), 'error');
            return false;
        } catch (error) {
            console.error("Error saving expense:", error);
            showNotification(t("An error occurred while saving"), 'error');
            return false;
        }
    };

    // Handle delete expense
    const handleDelete = async (id) => {
        if (!window.confirm(t("Are you sure you want to delete this expense?"))) {
            return false;
        }

        try {
            await apiDelete(`/api/expenses/${id}`);
            showNotification(t("Expense deleted successfully"));
            await fetchExpenses();
            return true;
        } catch (error) {
            console.error("Error deleting expense:", error);
            showNotification(t("Failed to delete expense"), 'error');
            return false;
        }
    };

    const handleDateRangeChange = ({ startDate, endDate }) => {
        if (!startDate && !endDate) {
            setFilteredExpenses(expensesList);
            return;
        }

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        const next = expensesList.filter(expense => {
            if (!expense.createdAt) return true;
            const created = new Date(expense.createdAt);

            if (start && created < start) return false;
            if (end) {
                // include the whole end day
                const endOfDay = new Date(end);
                endOfDay.setHours(23, 59, 59, 999);
                if (created > endOfDay) return false;
            }
            return true;
        });

        setFilteredExpenses(next);
    };

    if (loading) {
        return <div className="p-6">{t("Loading...")}</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="p-6">

            {/* Notification */}
            {notification.show && (
                <div className={`fixed top-4 right-4 p-4 rounded shadow-lg ${
                    notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } text-white z-50`}>
                    {notification.message}
                </div>
            )}

            <DataTable
                initialData={filteredExpenses}
                dealsList={dealsList}
                columns={dynamicColumns}
                title={t("Expenses")}
                onSave={handleSave}
                onDelete={handleDelete}
                roles={roles}
                users={users}
                onDateRangeChange={handleDateRangeChange}
            />

        </div>
    );
}

export default withRoleProtection(ExpensesPage, "expenses");