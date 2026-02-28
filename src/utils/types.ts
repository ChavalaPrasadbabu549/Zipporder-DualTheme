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
    loading?: boolean;
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
    userCart?: any;
}

// === Product State ===
export interface CatalogState {
    categories: Category[];
    subCategories: Record<number | string, SubCategory[]>;
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
    userCart: null,
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
export type OrderStatus = 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export interface OrderItem {
    id: number;
    name: string;
    image: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    date: string;
    status: 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
    totalAmount: number;
    items: OrderItem[];
    deliveryAddress?: string;
}
// BannerItem Interface
export interface BannerItemProps {
    id: string;
    imageUrl: string;
    isVideo?: boolean;
    title: string;
}

// OfferCard Interface
export interface OfferCardProps {
    offer: {
        id: string;
        title: string;
        subtitle: string;
        color: string;
        image: string;
    };
}

// === Tabs Interfaces ===
export interface TabOption {
    label: string;
    value: string;
}
// SegmentedTabs Interface
export interface SegmentedTabsProps {
    options: TabOption[];
    activeTab: string;
    onTabChange: (value: string) => void;
    containerStyle?: ViewStyle;
}

// ProductCard Interface
export interface ProductCardProps {
    product: Product;
    width?: number;
    hideWishlistButton?: boolean;
}

// Header Interface
export interface HeaderProps {
    title: string;
    subtitle?: string;
    showBackButton?: boolean;
    onBack?: () => void;
    rightComponent?: React.ReactNode;
}