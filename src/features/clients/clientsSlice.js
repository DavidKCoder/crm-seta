"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient";

const initialState = {
    items: [],
    status: "idle",
    error: null,
    meta: null,
};

export const fetchClients = createAsyncThunk(
    "clients/fetchClients",
    async (params = {}, { rejectWithValue }) => {
        try {
            const data = await apiGet("/api/clients", params);
            return data;
        } catch (err) {
            return rejectWithValue(err.message || "Failed to load clients");
        }
    }
);

export const createClient = createAsyncThunk(
    "clients/createClient",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await apiPost("/api/clients", payload);
            return data;
        } catch (err) {
            return rejectWithValue(err.message || "Failed to create client");
        }
    }
);

export const updateClient = createAsyncThunk(
    "clients/updateClient",
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const data = await apiPut(`/api/clients/${id}`, payload);
            return data;
        } catch (err) {
            return rejectWithValue(err.message || "Failed to update client");
        }
    }
);

export const deleteClient = createAsyncThunk(
    "clients/deleteClient",
    async (id, { rejectWithValue }) => {
        try {
            await apiDelete(`/api/clients/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.message || "Failed to delete client");
        }
    }
);

const clientsSlice = createSlice({
    name: "clients",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchClients.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload?.data || [];
                state.meta = action.payload?.meta || null;
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error?.message || "Failed to load clients";
            })
            .addCase(createClient.fulfilled, (state, action) => {
                const created = action.payload?.data || action.payload || null;
                if (created) {
                    state.items.unshift(created);
                }
            })
            .addCase(updateClient.fulfilled, (state, action) => {
                const updated = action.payload?.data;
                if (!updated) return;
                state.items = state.items.map((c) => (c.id === updated.id ? updated : c));
            })
            .addCase(deleteClient.fulfilled, (state, action) => {
                const id = action.payload;
                state.items = state.items.filter((c) => c.id !== id);
            });
    },
});

export default clientsSlice.reducer;
