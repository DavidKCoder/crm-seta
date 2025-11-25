export const getTableColumns = (t) => [
    { key: "id", label: t("#") },
    { key: "name", label: t("Name") },
    { key: "email", label: t("Email") },
    { key: "phone", label: t("Phone"), sortable: false },
    { key: "joiningDate", label: t("Joining Date") },
    { key: "notes", label: t("Note"), sortable: false },
    { key: "social", label: t("Social"), sortable: false },
    { key: "status", label: t("Status") },
    { key: "action", label: t("Action"), sortable: false },
];

export const rolesConfig = {
    Admin: { access: ["all"] },
    Manager: { access: ["all"] },
    SalesManager: { access: ["clients", "campaign", "deals", "packages"], restricted: ["statistics"] },
    PM: { access: ["clients", "campaign", "deals", "packages"], restricted: ["statistics"] },
    Copywriter: { access: ["Copy Writing"], restricted: ["all"] },
    Reelmaker: { access: ["Shooting"], restricted: ["all"] },
    Designer: { access: ["Design"], restricted: ["all"] },
    Targetolog: { access: ["Targeting"], restricted: ["all"] }
};