"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest, authGet } from "@/lib/apiClient";

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID;

const initialState = {
    user: null,
    status: "idle",
    error: null,
};

export const login = createAsyncThunk("auth/login", async ({ email, password, role, tenantId }, { rejectWithValue }) => {
    try {
        console.log('TENANT_ID', TENANT_ID);
        const data = await authRequest("/login", {
            body: {
                tenantId: tenantId || TENANT_ID,
                email,
                password,
            },
        });
        if (role) {
            try {
                localStorage.setItem("auth_role", role);
            } catch {
            }
        }
        return data;
    } catch (err) {
        return rejectWithValue(err.message || "Login failed");
    }
});

export const me = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
    try {
        const data = await authGet("/me");
        return data;
    } catch (err) {
        return rejectWithValue(err.message || "Failed to load user");
    }
});

export const logout = createAsyncThunk("auth/logout", async () => {
    await authRequest("/logout", {});
});

export const refresh = createAsyncThunk("auth/refresh", async (_, { rejectWithValue }) => {
    try {
        const data = await authRequest("/refresh", {});
        return data;
    } catch (err) {
        return rejectWithValue(err.message || "Failed to refresh token");
    }
});

export const changePassword = createAsyncThunk(
    "auth/changePassword",
    async ({ currentPassword, newPassword }, { rejectWithValue }) => {
        try {
            const data = await authRequest("/change-password", { body: { currentPassword, newPassword } });
            return data;
        } catch (err) {
            return rejectWithValue(err.message || "Failed to change password");
        }
    }
);

export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async ({ email, tenantId }, { rejectWithValue }) => {
        try {
            const data = await authRequest("/forgot", {
                body: {
                    tenantId: tenantId || TENANT_ID,
                    email,
                },
            });
            return data;
        } catch (err) {
            return rejectWithValue(err.message || "Failed to send reset instructions");
        }
    }
);

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async ({ token, newPassword, tenantId }, { rejectWithValue }) => {
        try {
            const data = await authRequest("/reset", {
                body: {
                    token,
                    newPassword,
                    tenantId: tenantId || TENANT_ID,
                },
            });
            return data;
        } catch (err) {
            return rejectWithValue(err.message || "Failed to reset password");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        clearAuthState(state) {
            state.user = null;
            state.status = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload?.data || action.payload?.user || action.payload || null;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error?.message || "Login failed";
            })
            .addCase(me.fulfilled, (state, action) => {
                const user = action.payload?.data || action.payload?.user || action.payload || null;
                state.user = user;
                try {
                    if (user) {
                        // Persist full user for later hydration
                        localStorage.setItem("auth_user", JSON.stringify(user));

                        // Persist normalized role for permission checks
                        if (user.role) {
                            const normalizedRole = String(user.role).trim();
                            if (normalizedRole) {
                                localStorage.setItem("auth_role", normalizedRole);
                            }
                        }
                    }
                } catch {
                }
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.status = "idle";
                state.error = null;
            });
    },
});

export const { setUser, clearAuthState } = authSlice.actions;

export default authSlice.reducer;
