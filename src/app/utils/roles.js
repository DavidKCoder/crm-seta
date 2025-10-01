const rolesConfig = {
    Admin: {
        access: ["all"],
    },
    Manager: {
        access: ["all"],
    },
    SalesManager: {
        access:["clients", "campaign", "deals", "packages"],
        restricted: ["statistics"],
    },
    PM: {
        access: ["clients", "campaign", "deals", "packages"],
        restricted: ["statistics"],
    },
    Copywriter: {
        access: ["deals.CopyWriting"],
        restricted: ["all"],
    },
    Reelmaker: {
        access: ["deals.Shooting"],
        restricted: ["all"],
    },
    Designer: {
        access: ["deals.Designer"],
        restricted: ["all"],
    },
    Targetolog: {
        access: ["deals.Targeting"],
        restricted: ["all"],
    },
};

export function canAccess(role, resource) {
    const cfg = rolesConfig[role];
    if (!cfg) return false;

    if (cfg.access.includes("all")) return true;

    if (resource === "deals") {
        return cfg.access.includes("deals") || cfg.access.some(r => r.startsWith("deals."));
    }

    return cfg.access.includes(resource);
}
