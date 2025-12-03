import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function UsersTab({ backendRoles, apiPost, fetchUsers, apiPut, apiDelete }) {
    const { t } = useTranslation();

    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        isActive: true,
        roleIds: [],
    });

    const [userError, setUserError] = useState("");
    const [userSuccess, setUserSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editState, setEditState] = useState(null);
    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState("");
    const [editSubmitting, setEditSubmitting] = useState(false);
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                !search.trim() ||
                [user.email, user.firstName, user.lastName].some(field =>
                    field?.toLowerCase().includes(search.toLowerCase()),
                );
            const createdAt = user.createdAt ? new Date(user.createdAt) : null;
            const withinStart = dateFilter.startDate ? createdAt >= new Date(dateFilter.startDate) : true;
            const withinEnd = dateFilter.endDate ? createdAt <= new Date(dateFilter.endDate) : true;
            return matchesSearch && withinStart && withinEnd;
        });
    }, [users, search, dateFilter.startDate, dateFilter.endDate]);

    useEffect(() => {
        const loadUsers = async () => {
            setUsersLoading(true);
            try {
                const response = await fetchUsers("/api/users", {
                    page: 1,
                    limit: 100,
                    startDate: dateFilter.startDate || undefined,
                    endDate: dateFilter.endDate || undefined,
                    search: search || undefined,
                });
                setUsers(response?.data || []);
            } catch (error) {
                console.error("Error fetching users:", error);
                setUserError(t("Failed to load users"));
            } finally {
                setUsersLoading(false);
            }
        };
        loadUsers();
    }, [fetchUsers, dateFilter.startDate, dateFilter.endDate, search, t]);

    const handleUserInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewUser(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const toggleUserRole = (roleId) => {
        setNewUser(prev => ({
            ...prev,
            roleIds: prev.roleIds.includes(roleId)
                ? prev.roleIds.filter(id => id !== roleId)
                : [...prev.roleIds, roleId],
        }));
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!newUser.email || !newUser.password || !newUser.firstName || !newUser.lastName) {
            setUserError(t("All fields are required"));
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
            setUserError(t("Please enter a valid email address"));
            return;
        }

        if (newUser.password.length < 6) {
            setUserError(t("Password must be at least 6 characters"));
            return;
        }

        if (newUser.roleIds.length === 0) {
            setUserError(t("Please select at least one role"));
            return;
        }

        try {
            setIsSubmitting(true);
            setUserError("");

            const response = await apiPost("/api/users", {
                email: newUser.email.trim(),
                password: newUser.password,
                firstName: newUser.firstName.trim(),
                lastName: newUser.lastName.trim(),
                isActive: newUser.isActive,
                roleIds: newUser.roleIds,
            });

            setTimeout(() => {
                setUserSuccess(t("User created successfully!"));
            }, 1000);

            setNewUser({
                email: "",
                password: "",
                firstName: "",
                lastName: "",
                isActive: true,
                roleIds: [],
            });

        } catch (error) {
            console.error("Error creating user:", error);
            setUserError(error.message || t("Failed to create user. Please try again."));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSelect = (user) => {
        setSelectedUser(user);
        setEditError("");
        setEditSuccess("");
        setEditState({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            isActive: Boolean(user.isActive),
            roleIds: Array.isArray(user.roles)
                ? user.roles.map(role => role.id || role)
                : [],
        });
    };

    const toggleEditRole = (roleId) => {
        setEditState(prev => ({
            ...prev,
            roleIds: prev.roleIds.includes(roleId)
                ? prev.roleIds.filter(id => id !== roleId)
                : [...prev.roleIds, roleId],
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;
        if (!editState.firstName.trim() || !editState.lastName.trim()) {
            setEditError(t("First and last name are required"));
            return;
        }
        if (editState.roleIds.length === 0) {
            setEditError(t("Please select at least one role"));
            return;
        }
        try {
            setEditSubmitting(true);
            setEditError("");
            await apiPut(`/api/users/${selectedUser.id}`, {
                firstName: editState.firstName.trim(),
                lastName: editState.lastName.trim(),
                isActive: editState.isActive,
                roleIds: editState.roleIds,
            });
            setEditSuccess(t("User updated successfully"));
            setSelectedUser(null);
            setEditState(null);
            // Refresh users list
            const response = await fetchUsers("/api/users", {
                page: 1,
                limit: 100,
                startDate: dateFilter.startDate || undefined,
                endDate: dateFilter.endDate || undefined,
                search: search || undefined,
            });
            setUsers(response?.data || []);
        } catch (error) {
            console.error("Error updating user:", error);
            setEditError(error.message || t("Failed to update user"));
        } finally {
            setEditSubmitting(false);
        }
    };

    const handleDeleteUser = async (user) => {
        if (!user?.id) return;
        if (!window.confirm(t("Are you sure you want to delete this user?"))) return;
        try {
            await apiDelete(`/api/users/${user.id}`);
            setUsers(prev => prev.filter(u => u.id !== user.id));
            setUserSuccess(t("User deleted successfully"));
            setSelectedUser(null);
            setEditState(null);
        } catch (error) {
            console.error("Error deleting user:", error);
            setUserError(error.message || t("Failed to delete user"));
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 text-black">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">{t("User Management")}</h2>
            </div>

            {userError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {userError}
                </div>
            )}

            {userSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                    {userSuccess}
                </div>
            )}

            <form onSubmit={handleUserSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("First Name")} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={newUser.firstName}
                            onChange={handleUserInputChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("Last Name")} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={newUser.lastName}
                            onChange={handleUserInputChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("Email")} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={newUser.email}
                            onChange={handleUserInputChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("Password")} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={newUser.password}
                            onChange={handleUserInputChange}
                            minLength={6}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {t("Minimum 6 characters")}
                        </p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("Roles")} <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                        {backendRoles.length > 0 ? (
                            backendRoles
                                .filter((role) => role.name !== "Admin")
                                .map((role) => {
                                    const { id, name } = role;
                                    const isChecked = newUser.roleIds.includes(id);

                                    return (
                                        <div key={id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`role-${id}`}
                                                checked={isChecked}
                                                onChange={() => toggleUserRole(id)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label
                                                htmlFor={`role-${id}`}
                                                className="ml-2 text-sm text-gray-700"
                                            >
                                                {name}
                                            </label>
                                        </div>
                                    );
                                })
                        ) : (
                            <p className="text-sm text-gray-500">
                                {t("No roles available. Please create roles first.")}
                            </p>
                        )}
                    </div>

                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={newUser.isActive}
                        onChange={(e) => setNewUser(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                        {t("Active Account")}
                    </label>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || backendRoles.length === 0}
                        className={`px-4 py-2 rounded-md text-white ${
                            isSubmitting || backendRoles.length === 0
                                ? "bg-blue-300 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                     fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                                {t("Creating...")}
              </span>
                        ) : t("Create User")}
                    </button>
                </div>
            </form>

            <div className="border-t my-6" />

            {selectedUser && editState && (
                <div className="mt-6 p-4 border rounded bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">{t("Edit User")}</h3>

                    {editError && (
                        <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">{editError}</div>
                    )}

                    {editSuccess && (
                        <div className="mb-3 p-2 bg-green-100 text-green-700 rounded text-sm">{editSuccess}</div>
                    )}

                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("First Name")} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editState.firstName}
                                    onChange={(e) => setEditState(prev => ({ ...prev, firstName: e.target.value }))}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("Last Name")} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editState.lastName}
                                    onChange={(e) => setEditState(prev => ({ ...prev, lastName: e.target.value }))}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t("Roles")} <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-2">
                                {backendRoles.map((role) => {
                                    return (
                                        <div key={role.id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`edit-role-${role.id}`}
                                                checked={editState.roleIds.includes(role.id)}
                                                onChange={() => toggleEditRole(role.id)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={`edit-role-${role.id}`}
                                                   className="ml-2 block text-sm text-gray-700">
                                                {role.name}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="edit-isActive"
                                checked={editState.isActive}
                                onChange={(e) => setEditState(prev => ({ ...prev, isActive: e.target.checked }))}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="edit-isActive" className="ml-2 block text-sm text-gray-700">
                                {t("Active Account")}
                            </label>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedUser(null);
                                    setEditState(null);
                                    setEditError("");
                                    setEditSuccess("");
                                }}
                                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                                {t("Cancel")}
                            </button>
                            <button
                                type="submit"
                                disabled={editSubmitting}
                                className={`px-4 py-2 rounded-md text-white ${
                                    editSubmitting ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer`}
                            >
                                {editSubmitting ? t("Saving...") : t("Save Changes")}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("Search users")}
                        </label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="p-2 border rounded w-full"
                            placeholder={t("Search by name or email")}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("From")}
                        </label>
                        <input
                            type="date"
                            value={dateFilter.startDate}
                            max={dateFilter.endDate || undefined}
                            onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                            className="p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("To")}
                        </label>
                        <input
                            type="date"
                            value={dateFilter.endDate}
                            min={dateFilter.startDate || undefined}
                            onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                            className="p-2 border rounded"
                        />
                    </div>
                </div>

                {usersLoading ? (
                    <div className="text-gray-500">{t("Loading users...")}</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-gray-500">{t("No users found for the selected filters.")}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t("Name")}
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t("Email")}
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t("Roles")}
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => {
                                const { id, _id, firstName, lastName, email, roles = [] } = user;

                                const isAdmin = roles.some((role) => role?.name === "Admin");
                                const roleNames = roles.map((r) => r?.name || r).join(", ");
                                const name = `${firstName ?? ""} ${lastName ?? ""}`.trim();

                                return (
                                    <tr key={id || _id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {name || "-"}
                                        </td>

                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {email}
                                        </td>

                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {roleNames}
                                        </td>

                                        <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            {!isAdmin && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditSelect(user)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        {t("Edit")}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteUser(user)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        {t("Delete")}
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
