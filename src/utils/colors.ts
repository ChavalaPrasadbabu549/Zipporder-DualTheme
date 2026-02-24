// Premium Color Palette

const palette = {
    // Brand Colors
    primary: '#FF004D', // bas
    primaryDark: '#FF004D', // Indigo 700
    authentication: '#FF004D', // Indigo 500
    secondary: '#EC4899', // Pink 500 - Playful accent
    accent: '#10B981', // Emerald 500 - Success/Go

    // Neutrals - Light
    white: '#FFFFFF',
    offWhite: '#F8FAFC', // Slate 50
    lightSurface: '#F1F5F9', // Slate 100
    lightBorder: '#E2E8F0', // Slate 200
    lightText: '#0F172A', // Slate 900
    lightTextSecondary: '#64748B', // Slate 500

    // Neutrals - Dark
    black: '#0F172A', // Slate 900
    darkBackground: '#0B1120', // Very dark slate/blue
    darkSurface: '#1E293B', // Slate 800
    darkBorder: '#334155', // Slate 700
    darkText: '#F8FAFC', // Slate 50
    darkTextSecondary: '#94A3B8', // Slate 400

    // Functional
    error: '#EF4444', // Red 500
    warning: '#F59E0B', // Amber 500
    success: '#10B981', // Emerald 500
    info: '#3B82F6', // Blue 500
};

export const lightColors = {
    background: palette.offWhite,
    surface: palette.white,
    text: palette.lightText,
    textSecondary: palette.lightTextSecondary,
    primary: palette.primary,
    primaryDark: palette.primaryDark,
    secondary: palette.secondary,
    accent: palette.accent,
    border: palette.lightBorder,
    inputBackground: palette.lightSurface,
    placeholder: palette.lightTextSecondary,
    error: palette.error,
    success: palette.success,
    warning: palette.warning,
    info: palette.info,
    card: palette.white,
    transparent: 'transparent',
};

export const darkColors = {
    background: palette.darkBackground,
    surface: palette.darkSurface,
    text: palette.darkText,
    textSecondary: palette.darkTextSecondary,
    primary: palette.authentication,
    primaryDark: palette.primary,
    secondary: palette.secondary,
    accent: palette.accent,
    border: palette.darkBorder,
    inputBackground: palette.darkSurface,
    placeholder: palette.darkTextSecondary,
    error: palette.error,
    success: palette.success,
    warning: palette.warning,
    info: palette.info,
    card: palette.darkSurface,
    overlay: 'rgba(0, 0, 0, 0.7)',
    transparent: 'transparent',
};

export type Colors = typeof lightColors;

