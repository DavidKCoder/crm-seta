"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient";

const initialState = {
    items: [],
    status: "idle",
    error: null,
};

export const fetchStatuses = createAsyncThunk(
    "statuses/fetchStatuses",
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiGet("/api/statuses");
            return data?.data || [];
        } catch (err) {
            return rejectWithValue(err.message || "Failed to load statuses");
        }
    }
);

export const createStatus = createAsyncThunk(
    "statuses/createStatus",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await apiPost("/api/statuses", payload);
            const status = data?.data || data;
            return status;
        } catch (err) {
            return rejectWithValue(err.message || "Failed to create status");
        }
    }
);

export const updateStatus = createAsyncThunk(
    "statuses/updateStatus",
    async ({ id, body }, { rejectWithValue }) => {
        try {
            const data = await apiPut(`/api/statuses/${id}`, body);
            const status = data?.data || data;
            return status;
        } catch (err) {
            return rejectWithValue(err.message || "Failed to update status");
        }
    }
);

export const deleteStatus = createAsyncThunk(
    "statuses/deleteStatus",
    async ({ id }, { rejectWithValue }) => {
        try {
            await apiDelete(`/api/statuses/${id}`);
            return { id };
        } catch (err) {
            return rejectWithValue(err.message || "Failed to delete status");
        }
    }
);

const statusesSlice = createSlice({
    name: "statuses",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStatuses.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchStatuses.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
                state.error = null;
            })
            .addCase(fetchStatuses.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error?.message || "Failed to load statuses";
            })
            .addCase(createStatus.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateStatus.fulfilled, (state, action) => {
                const updatedStatus = action.payload;
                const index = state.items.findIndex(s => s.id === updatedStatus.id);
                if (index !== -1) {
                    state.items[index] = updatedStatus;
                }
            })
            .addCase(deleteStatus.fulfilled, (state, action) => {
                const { id } = action.payload;
                state.items = state.items.filter(s => s.id !== id);
            });
    },
});

export default statusesSlice.reducer;
