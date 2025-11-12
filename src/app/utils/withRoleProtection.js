"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // <--- тут изменили
import { FiLock } from "react-icons/fi";
import NotAccess from "@/components/NotAccess";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { useCanAccess } from "@/hooks/useCanAccess";

export function withRoleProtection(Component, resourceKey) {
    return function ProtectedComponent(props) {
        const router = useRouter();
        const [initialized, setInitialized] = useState(false);
        const [hasAccess, setHasAccess] = useState(false);
        const { role } = useCurrentUserRole();
        const { canAccess } = useCanAccess();

        useEffect(() => {
            const access = canAccess(role, resourceKey);
            setHasAccess(access);
            setInitialized(true);

            if (!access) {
                // router.replace("/");
            }
        }, [router, role]);

        if (!initialized) {
            return null;
        }

        if (!hasAccess) {
            return <NotAccess />
        }

        return <Component {...props} />;
    };
}
