"use client";

import { withRoleProtection } from "@/app/utils/withRoleProtection";
import StatisticsPageContent from "@/app/statistics/StatisticsPageContent";

export default withRoleProtection(StatisticsPageContent, "statistics");
