"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient";

const initialState = {
    items: [],
    status: "idle",
    error: null,
    meta: null,
};

export const fetchCampaigns = createAsyncThunk(
    "campaigns/fetchCampaigns",
    async (params = {}, { rejectWithValue }) => {
        try {
            const data = await apiGet("/api/campaigns", params);
            return data;
        } catch (err) {
            return rejectWithValue(err.message || "Failed to load campaigns");
        }
    }
);

export const createCampaign = createAsyncThunk(
    "campaigns/createCampaign",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await apiPost("/api/campaigns", payload);
            return data;
        } catch (err) {
            return rejectWithValue(err.message || "Failed to create campaign");
        }
    }
);

export const updateCampaign = createAsyncThunk(
    "campaigns/updateCampaign",
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const data = await apiPut(`/api/campaigns/${id}`, payload);
            return data;
        } catch (err) {
            return rejectWithValue(err.message || "Failed to update campaign");
        }
    }
);

export const deleteCampaign = createAsyncThunk(
    "campaigns/deleteCampaign",
    async (id, { rejectWithValue }) => {
        try {
            await apiDelete(`/api/campaigns/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.message || "Failed to delete campaign");
        }
    }
);

const campaignsSlice = createSlice({
    name: "campaigns",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCampaigns.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchCampaigns.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload?.data || [];
                state.meta = action.payload?.meta || null;
            })
            .addCase(fetchCampaigns.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error?.message || "Failed to load campaigns";
            })
            .addCase(createCampaign.fulfilled, (state, action) => {
                const created = action.payload?.data || action.payload || null;
                if (created) {
                    state.items.unshift(created);
                }
            })
            .addCase(updateCampaign.fulfilled, (state, action) => {
                const updated = action.payload?.data;
                if (!updated) return;
                state.items = state.items.map((c) => (c.id === updated.id ? updated : c));
            })
            .addCase(deleteCampaign.fulfilled, (state, action) => {
                const id = action.payload;
                state.items = state.items.filter((c) => c.id !== id);
            });
    },
});

export default campaignsSlice.reducer;
