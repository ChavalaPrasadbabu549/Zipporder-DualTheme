import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, initialState } from '../../utils/types';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// initializeAuth thunk to restore session from AsyncStorage
export const initializeAuth = createAsyncThunk(
    'auth/initialize',
    async (_, { rejectWithValue }) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userJson = await AsyncStorage.getItem('user');

            if (token && userJson) {
                const user = JSON.parse(userJson);
                return { token, user };
            }
            return null;
        } catch (error) {
            return rejectWithValue('Failed to restore session');
        }
    }
);

// login thunk using real API
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: any }, { rejectWithValue }) => {
        try {
            const response = await api.post('/users/login', credentials);

            if (response.data && response.data.token && response.data.user) {
                const { token, user } = response.data;

                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('user', JSON.stringify(user));

                return { user, token };
            }
            return rejectWithValue('Invalid response from server');
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Login failed';
            return rejectWithValue(message);
        }
    }
);

// register thunk using real API
export const register = createAsyncThunk(
    'auth/register',
    async (userData: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/users/register', userData);

            if (response.data && response.data.token && response.data.user) {
                const { token, user } = response.data;

                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('user', JSON.stringify(user));

                return { user, token };
            }
            return rejectWithValue('Registration failed');
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Registration failed';
            return rejectWithValue(message);
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
            AsyncStorage.removeItem('token');
            AsyncStorage.removeItem('user');
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Initialize
            .addCase(initializeAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(initializeAuth.fulfilled, (state, action) => {
                if (action.payload) {
                    state.user = action.payload.user;
                    state.token = action.payload.token;
                    state.isAuthenticated = true;
                }
                state.loading = false;
            })
            .addCase(initializeAuth.rejected, (state) => {
                state.loading = false;
            })
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
