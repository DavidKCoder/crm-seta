"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/apiClient";

const initialState = {
    items: [],
    status: "idle",
    error: null,
    meta: null,
};

export const fetchDeals = createAsyncThunk(
    "deals/fetchDeals",
    async (params = {}, { rejectWithValue }) => {
        try {
            const data = await apiGet("/api/deals", params);
            return data;
        } catch (err) {
            return rejectWithValue(err.message || "Failed to load deals");
        }
    }
);

export const fetchDealById = createAsyncThunk(
    "deals/fetchDealById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiGet(`/api/deals/${id}`);
            return response.data; // Return the deal data directly
        } catch (err) {
            return rejectWithValue(err.message || `Failed to load deal ${id}`);
        }
    }
);

export const createDeal = createAsyncThunk(
    "deals/createDeal",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await apiPost("/api/deals", payload);
            return data;
        } catch (err) {
            return rejectWithValue(err.message || "Failed to create deal");
        }
    }
);

export const updateDeal = createAsyncThunk(
    "deals/updateDeal",
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            return await apiPut(`/api/deals/${id}`, payload);
        } catch (err) {
            return rejectWithValue(err.message || "Failed to update deal");
        }
    }
);

export const deleteDeal = createAsyncThunk(
    "deals/deleteDeal",
    async (id, { rejectWithValue }) => {
        try {
            await apiDelete(`/api/deals/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.message || "Failed to delete deal");
        }
    }
);

const dealsSlice = createSlice({
    name: "deals",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeals.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchDeals.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload?.data || [];
                state.meta = action.payload?.meta || null;
            })
            .addCase(fetchDeals.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error?.message || "Failed to load deals";
            })
            .addCase(fetchDealById.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchDealById.fulfilled, (state, action) => {
                state.status = "succeeded";
                // Update the specific deal in the items array if it exists
                const index = state.items.findIndex(deal => deal.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    state.items.push(action.payload);
                }
            })
            .addCase(fetchDealById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error?.message || "Failed to load deal";
            })
            .addCase(createDeal.fulfilled, (state, action) => {
                const created = action.payload?.data;
                if (created) {
                    state.items.unshift(created);
                }
            })
            .addCase(updateDeal.fulfilled, (state, action) => {
                const updated = action.payload?.data;
                if (!updated) return;
                state.items = state.items.map((d) => (d.id === updated.id ? updated : d));
            })
            .addCase(deleteDeal.fulfilled, (state, action) => {
                const id = action.payload;
                state.items = state.items.filter((d) => d.id !== id);
            });
    },
});

export default dealsSlice.reducer;
