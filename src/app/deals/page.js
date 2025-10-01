"use client";
import { withRoleProtection } from "@/app/utils/withRoleProtection";
import DealsPageContent from "@/app/deals/components/DealsPageContent";

export default withRoleProtection(DealsPageContent, "deals");