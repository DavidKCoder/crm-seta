"use client";

import { withRoleProtection } from "@/app/utils/withRoleProtection";
import PackagesPageContent from "@/app/packages/PackagesPageContent";

export default withRoleProtection(PackagesPageContent, "packages");
