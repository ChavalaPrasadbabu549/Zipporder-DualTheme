import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { initialCatalogState, Category, SubCategory, Product, Pagination } from '../../utils/types';
import api from '../../utils/api';

// Fetch Categories
export const fetchCategories = createAsyncThunk(
    'catalog/fetchCategories',
    async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
        try {
            const response = await api.get(`/categorie?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

// Fetch SubCategories by Category ID
export const fetchSubCategories = createAsyncThunk(
    'catalog/fetchSubCategories',
    async (categoryId: number, { rejectWithValue }) => {
        try {
            const response = await api.get(`/subcategories/category/${categoryId}`);
            return { categoryId, data: response.data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch subcategories');
        }
    }
);

// Fetch Products by Category and SubCategory
export const fetchProducts = createAsyncThunk(
    'catalog/fetchProducts',
    async ({ categoryId, subCategoryId, page = 1, limit = 10 }: { categoryId?: number; subCategoryId?: number; page?: number; limit?: number }, { rejectWithValue }) => {
        try {
            let url = `/products?page=${page}&limit=${limit}`;
            if (categoryId) url += `&categoryId=${categoryId}`;
            if (subCategoryId) url += `&subCategoryId=${subCategoryId}`;

            const response = await api.get(url);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);

const catalogSlice = createSlice({
    name: 'catalog',
    initialState: initialCatalogState,
    reducers: {
        clearCatalogError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Categories
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.categories;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // SubCategories
            .addCase(fetchSubCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSubCategories.fulfilled, (state, action) => {
                state.loading = false;
                const { categoryId, data } = action.payload;
                state.subCategories[categoryId] = data.subCategories;
            })
            .addCase(fetchSubCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Products
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCatalogError } = catalogSlice.actions;
export default catalogSlice.reducer;
