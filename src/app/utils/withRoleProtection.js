"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import NotAccess from "@/components/NotAccess";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { useSelector } from "react-redux";

export function withRoleProtection(Component, resourceKey) {
    return function ProtectedComponent(props) {
        const router = useRouter();
        const [initialized, setInitialized] = useState(false);
        const [hasAccess, setHasAccess] = useState(false);
        const { role } = useCurrentUserRole();
        const authUser = useSelector((state) => state.auth.user);

        useEffect(() => {
            let access = false;

            // Access is controlled only by backend roles on authUser
            if (authUser && Array.isArray(authUser.roles) && authUser.roles.length > 0) {
                access = authUser.roles.some((r) => {
                    const accessArr = Array.isArray(r?.access) ? r.access : [];

                    if (accessArr.includes("all")) return true;

                    if (resourceKey === "deals") {
                        return (
                            accessArr.includes("deals") ||
                            accessArr.some((perm) => typeof perm === "string" && perm.startsWith("deals."))
                        );
                    }

                    return accessArr.includes(resourceKey);
                });
            } else {
                access = false;
            }

            setHasAccess(access);
            setInitialized(true);

            if (!access) {
                // you could redirect if needed, currently just show NotAccess
            }
        }, [authUser, role, resourceKey]);

        if (!initialized) {
            return null;
        }

        if (!hasAccess) {
            return <NotAccess />
        }

        return <Component {...props} />;
    };
}
