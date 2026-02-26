import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { initialCartState, } from '../../utils/types';

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/cart/get');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ productId, quantity }: { productId: number; quantity: number }, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.post('/cart/update', {
                product_id: productId,
                quantity: quantity
            });
            // After updating, refresh the cart to get the latest state
            dispatch(fetchCart());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (productId: number, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.delete('/cart/remove', {
                data: { product_id: productId }
            });
            // After removing, refresh the cart
            dispatch(fetchCart());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialCartState,
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                // Correctly map the product_ids array from the userCart object
                state.items = action.payload?.userCart?.product_ids || [];
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToCart.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeFromCart.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
