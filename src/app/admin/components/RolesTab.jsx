import React from 'react';
import { useTranslation } from 'react-i18next';

export default function RolesTab({ 
  roles, 
  backendRoles, 
  setRoleAccess, 
  getRoleConfig, 
  MODULES, 
  ADMIN_TOOLS, 
  handleCreateRole, 
  isCreatingRole, 
  setIsCreatingRole, 
  newRole, 
  setNewRole, 
  error, 
  setError, 
  success, 
  isSubmitting, 
  roleToDelete, 
  setRoleToDelete, 
  confirmDeleteRole 
}) {
  const { t } = useTranslation();

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

  const handleDeleteClick = (role) => {
    setRoleToDelete(role);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 text-black">
      {/* Roles x Modules */}
      <div className="bg-white border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">{t("Permissions")} — {t("Modules")}</h2>
        </div>
        <div className="flex flex-col gap-4">
          {backendRoles.map((r) => {
            const roleName = r.name;
            const acc = roles[roleName]?.access || [];
            const hasAll = acc.includes("all");
            return (
              <div key={r.id} className="border rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{roleName}</div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hasAll}
                        disabled={roleName === "Admin"}
                        onChange={() => toggleAllForRole(roleName)}
                      />
                      <span>{t("All")}</span>
                    </label>
                    {roleName !== "Admin" && (
                      <button
                        onClick={() => handleDeleteClick(r)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        title="Delete role"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                {!hasAll && (
                  <div className="flex flex-wrap gap-2">
                    {MODULES.map((m) => (
                      <label key={m} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={acc.includes(m)}
                          onChange={() => togglePermission(roleName, m)}
                        />
                        <span className="px-2 py-0.5 rounded bg-white border text-gray-700">
                          {m}
                        </span>
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
          {backendRoles.map((r) => {
            const roleName = r.name;
            const acc = roles[roleName]?.access || [];
            const hasAll = acc.includes("all");
            return (
              <div key={r.id} className="border rounded p-3">
                <div className="font-medium mb-2">{roleName}</div>
                {hasAll ? (
                  <div className="text-sm text-gray-500">{t("All")}</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {ADMIN_TOOLS.map((m) => (
                      <label key={m} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={acc.includes(m)}
                          onChange={() => togglePermission(roleName, m)}
                        />
                        <span className="px-2 py-0.5 rounded bg-white border text-gray-700">
                          {m}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

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
                  onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border rounded"
                  placeholder="Enter role name"
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
                  onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded"
                  placeholder="Enter role description"
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
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer"
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t("Creating...")}
                    </span>
                  ) : t("Create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {roleToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
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
              {t("Are you sure you want to delete the role")} <span className="font-semibold">{roleToDelete?.name}</span>? {t("This action cannot be undone.")}
            </p>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setRoleToDelete(null);
                  setError("");
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer"
                disabled={isSubmitting}
              >
                {t("Cancel")}
              </button>
              <button
                type="button"
                onClick={confirmDeleteRole}
                className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t("Deleting...")}
                  </span>
                ) : t("Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
