"use client";

import { withRoleProtection } from "@/app/utils/withRoleProtection";
import CampaignPageContent from "@/app/campaign/CampaignPageContent";

export default withRoleProtection(CampaignPageContent, "campaign");
