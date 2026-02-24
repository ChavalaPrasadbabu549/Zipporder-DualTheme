import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, initialState } from '../../utils/types';

// Mock API calls - Replace with real API endpoints
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: any }, { rejectWithValue }) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(() => resolve(null), 1500));

            if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
                const mockUser: User = {
                    id: '1',
                    name: 'Test User',
                    email: credentials.email,
                    phone_number: '1234567890',
                    dob: '1990-01-01',
                    location: 'New York',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };
                return { user: mockUser, token: 'mock-jwt-token' };
            }
            return rejectWithValue('Invalid email or password');
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData: any, { rejectWithValue }) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(() => resolve(null), 1500));

            const mockUser: User = {
                id: Math.random().toString(36).substr(2, 9),
                name: userData.email.split('@')[0],
                email: userData.email,
                phone_number: userData.phone_number,
                dob: userData.dob,
                location: userData.location,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            return { user: mockUser, token: 'mock-jwt-token' };
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
