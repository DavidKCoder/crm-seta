"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // <--- тут изменили
import { canAccess } from "@/app/utils/roles";
import { FiLock } from "react-icons/fi";
import NotAccess from "@/components/NotAccess";

const USER_ROLE = process.env.NEXT_PUBLIC_CURRENT_USER;

export function withRoleProtection(Component, resourceKey) {
    return function ProtectedComponent(props) {
        const router = useRouter();
        const [initialized, setInitialized] = useState(false);
        const [hasAccess, setHasAccess] = useState(false);

        useEffect(() => {
            const access = canAccess(USER_ROLE, resourceKey);
            setHasAccess(access);
            setInitialized(true);

            if (!access) {
                // router.replace("/");
            }
        }, [router]);

        if (!initialized) {
            return null;
        }

        if (!hasAccess) {
            return <NotAccess />
        }

        return <Component {...props} />;
    };
}
