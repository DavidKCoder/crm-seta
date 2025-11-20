"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import clientsReducer from "@/features/clients/clientsSlice";
import campaignsReducer from "@/features/campaigns/campaignsSlice";
import dealsReducer from "@/features/deals/dealsSlice";
import statusesReducer from "@/features/statuses/statusesSlice";

export function makeStore() {
    return configureStore({
        reducer: {
            auth: authReducer,
            clients: clientsReducer,
            campaigns: campaignsReducer,
            deals: dealsReducer,
            statuses: statusesReducer,
        },
    });
}

export const store = makeStore();

export function getStoreState() {
    return store.getState();
}
