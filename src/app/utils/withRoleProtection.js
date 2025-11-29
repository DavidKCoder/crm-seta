"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // <--- тут изменили
import { FiLock } from "react-icons/fi";
import NotAccess from "@/components/NotAccess";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { useCanAccess } from "@/hooks/useCanAccess";
import { useSelector } from "react-redux";

export function withRoleProtection(Component, resourceKey) {
    return function ProtectedComponent(props) {
        const router = useRouter();
        const [initialized, setInitialized] = useState(false);
        const [hasAccess, setHasAccess] = useState(false);
        const { role } = useCurrentUserRole();
        const { canAccess } = useCanAccess();
        const authUser = useSelector((state) => state.auth.user);

        useEffect(() => {
            let access = false;

            // Prefer backend roles array if available
            if (authUser && Array.isArray(authUser.roles) && authUser.roles.length > 0) {
                access = authUser.roles.some((r) => {
                    const name = String(r?.name || "").trim();
                    if (!name) return false;
                    return canAccess(name, resourceKey);
                });
            } else {
                // Fallback to single role string (e.g., from auth_role)
                access = canAccess(role, resourceKey);
            }

            setHasAccess(access);
            setInitialized(true);

            if (!access) {
                // you could redirect if needed, currently just show NotAccess
            }
        }, [authUser, role, resourceKey, canAccess]);

        if (!initialized) {
            return null;
        }

        if (!hasAccess) {
            return <NotAccess />
        }

        return <Component {...props} />;
    };
}
