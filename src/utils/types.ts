import React from 'react';
import { TextInputProps, ViewStyle, TextStyle } from 'react-native';

//  ===== Input Interfaces   =====
export interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    labelStyle?: TextStyle;
    errorStyle?: TextStyle;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    required?: boolean;
}

//  ===== Select Interfaces   =====
export interface SelectOption {
    label: string;
    value: string | number;
}

export interface SelectProps {
    label?: string;
    placeholder?: string;
    options: SelectOption[];
    value?: string | number;
    onSelect: (value: string | number) => void;
    error?: string;
    containerStyle?: ViewStyle;
    selectStyle?: ViewStyle;
    labelStyle?: TextStyle;
    errorStyle?: TextStyle;
    required?: boolean;
    disabled?: boolean;
}

//  ===== Button Interfaces   =====
export interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

//  ===== Form Interfaces   =====
export interface FormFieldConfig {
    name: string;
    label: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'number';
    icon?: string;
    required?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

//  ===== Card Interfaces   =====
export interface CardProps {
    title?: string;
    children: React.ReactNode;
    style?: ViewStyle;
}

//  ===== Loading Interfaces   =====
export interface LoadingProps {
    size?: 'small' | 'large';
    color?: string;
    text?: string;
}

//  ===== Data Models   =====
export interface User {
    id: string | number;
    name?: string;
    email: string;
    avatar?: string;
    phone_number?: string;
    dob?: string;
    location?: string;
    created_at?: string;
    updated_at?: string;
}
// Category Interface
export interface Category {
    id: number;
    name: string;
    image: string;
    description: string;
    isActive: boolean;
    created_at: string;
    updated_at: string;
    subcategory_count: number;
}
// CategoryCard Interface
export interface CategoryCardProps {
    category: Category;
    onPress: () => void;
    size?: 'small' | 'large';
}
// SubCategory Interface
export interface SubCategory {
    id: number;
    name: string;
    image: string;
    description: string;
    isActive: boolean;
    category_id: number;
    created_at: string;
    updated_at: string;
}
// Product Interface
export interface Product {
    id: number;
    name: string;
    images: string;
    description: string;
    isActive: boolean;
    category_id: number;
    subcategory_id: number;
    specifications: Record<string, any>;
    price: number;
    discount_price: number;
    quantity: number;
    created_at: string;
    updated_at: string;
    category: {
        id: number;
        name: string;
        image: string;
    };
    subcategory: {
        id: number;
        name: string;
        image: string;
    };
}
// Pagination Interface
export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// === Auth State ===
export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

// === Product State ===
export interface CatalogState {
    categories: Category[];
    subCategories: Record<number, SubCategory[]>;
    products: Product[];
    loading: boolean;
    error: string | null;
    pagination: Pagination | null;
}

// === Cart State ===
export interface CartItem {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    product: Product;
}

export interface CartState {
    items: CartItem[];
    loading: boolean;
    error: string | null;
}

// === Wishlist State ===
export interface WishlistState {
    items: Product[];
}

// === Initial States ===
export const initialAuthState: AuthState = {
    user: null,
    token: null,
    loading: true,
    error: null,
    isAuthenticated: false,
};

export const initialCatalogState: CatalogState = {
    categories: [],
    subCategories: {},
    products: [],
    loading: false,
    error: null,
    pagination: null,
};

export const initialCartState: CartState = {
    items: [],
    loading: false,
    error: null,
};

export const initialWishlistState: WishlistState = {
    items: [],
};

// === ThemedSafeAreaViewProps ===
export interface ThemedSafeAreaViewProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

// === Order ===
export interface Order {
    id: string;
    title: string;
    date: string;
    status: 'pending' | 'delivered' | 'cancelled';
    amount: string;
}