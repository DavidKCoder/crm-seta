"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGet } from "@/lib/apiClient";

const initialState = {
    byEntity: {
        client: { items: [], status: "idle", error: null },
        campaign: { items: [], status: "idle", error: null },
        deal: { items: [], status: "idle", error: null },
    },
};

export const fetchStatuses = createAsyncThunk(
    "statuses/fetchStatuses",
    async (entity, { rejectWithValue }) => {
        try {
            const data = await apiGet("/api/statuses", { entity });
            return { entity, items: data?.data || [] };
        } catch (err) {
            return rejectWithValue({ entity, message: err.message || "Failed to load statuses" });
        }
    }
);

const statusesSlice = createSlice({
    name: "statuses",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStatuses.pending, (state, action) => {
                const entity = action.meta.arg;
                if (!state.byEntity[entity]) return;
                state.byEntity[entity].status = "loading";
                state.byEntity[entity].error = null;
            })
            .addCase(fetchStatuses.fulfilled, (state, action) => {
                const { entity, items } = action.payload;
                if (!state.byEntity[entity]) return;
                state.byEntity[entity].status = "succeeded";
                state.byEntity[entity].items = items;
                state.byEntity[entity].error = null;
            })
            .addCase(fetchStatuses.rejected, (state, action) => {
                const entity = action.payload?.entity || action.meta.arg;
                const message = action.payload?.message || action.error?.message || "Failed to load statuses";
                if (!state.byEntity[entity]) return;
                state.byEntity[entity].status = "failed";
                state.byEntity[entity].error = message;
            });
    },
});

export default statusesSlice.reducer;
