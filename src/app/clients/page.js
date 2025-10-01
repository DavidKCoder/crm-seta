"use client";

import { withRoleProtection } from "@/app/utils/withRoleProtection";
import ClientsPageContent from "@/app/clients/ClientsPageContent";

export default withRoleProtection(ClientsPageContent, "clients");
