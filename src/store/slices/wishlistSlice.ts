import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialWishlistState, Product } from '../../utils/types';

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: initialWishlistState,
    reducers: {
        toggleWishlist: (state, action: PayloadAction<Product>) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items.splice(index, 1);
            } else {
                state.items.push(action.payload);
            }
        },
        removeFromWishlist: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        clearWishlist: (state) => {
            state.items = [];
        }
    }
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
