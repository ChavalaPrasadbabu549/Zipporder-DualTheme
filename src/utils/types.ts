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
    id: string;
    name: string;
    email: string;
    phone_number?: string;
    dob?: string;
    location?: string;
    created_at?: string;
    updated_at?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

export const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false,
};

export interface Order {
    id: string;
    title: string;
    date: string;
    status: 'pending' | 'delivered' | 'cancelled';
    amount: string;
}