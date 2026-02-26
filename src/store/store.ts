import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import catalogReducer from './slices/catalogSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        catalog: catalogReducer,
        cart: cartReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
