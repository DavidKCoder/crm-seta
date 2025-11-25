import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function UsersTab({ backendRoles, apiPost }) {
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
            setUserError("All fields are required");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
            setUserError("Please enter a valid email address");
            return;
        }

        if (newUser.password.length < 6) {
            setUserError("Password must be at least 6 characters");
            return;
        }

        if (newUser.roleIds.length === 0) {
            setUserError("Please select at least one role");
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

    return (
        <div className="bg-white rounded-lg shadow p-6">
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
                        {backendRoles.map((role) => (
                            <div key={role.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`role-${role.id}`}
                                    checked={newUser.roleIds.includes(role.id)}
                                    onChange={() => toggleUserRole(role.id)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`role-${role.id}`} className="ml-2 block text-sm text-gray-700">
                                    {role.name}
                                </label>
                            </div>
                        ))}
                        {backendRoles.length === 0 && (
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
        </div>
    );
}
