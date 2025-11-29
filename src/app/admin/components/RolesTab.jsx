import React from "react";
import { useTranslation } from "react-i18next";
import { TbTrashXFilled } from "react-icons/tb";

export default function RolesTab({
                                     roles,
                                     backendRoles,
                                     MODULES,
                                     togglePermission,
                                     toggleAllForRole,
                                     handleDeleteClick,
                                     t,
                                 }) {
    const { t: tt } = useTranslation();

    return (
        <div className="grid md:grid-cols-2 gap-6 text-black">
            {/* Roles x Modules */}
            <div className="bg-white border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">{(t || tt)("Permissions")} — {(t || tt)("Modules")}</h2>
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
                                        <label className="flex items-center gap-2 text-sm select-none">
                                            <input
                                                type="checkbox"
                                                checked={hasAll}
                                                disabled={roleName === "Admin"}
                                                onChange={() => toggleAllForRole(roleName)}
                                                className="cursor-pointer"
                                            />
                                            <span>{(t || tt)("All")}</span>
                                        </label>
                                        {roleName !== "Admin" && (
                                            <button
                                                onClick={() => handleDeleteClick(r)}
                                                className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                                                title="Delete role"
                                            >
                                                <TbTrashXFilled className="cursor-pointer hover:text-red-600" size={20}/>
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
        </div>
    );
}
