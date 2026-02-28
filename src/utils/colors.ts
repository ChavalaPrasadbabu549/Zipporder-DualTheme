// Premium Color Palette

const palette = {
    // Brand Colors
    primary: '#FF004D',
    primaryDark: '#FF004D',
    authentication: '#FF004D',
    secondary: '#EC4899',
    accent: '#10B981',

    // Neutrals - Light
    white: '#FFFFFF',
    offWhite: '#F8FAFC',
    lightSurface: '#F1F5F9',
    lightBorder: '#E2E8F0',
    lightText: '#0F172A',
    lightTextSecondary: '#64748B',
    offWhiteText: 'rgba(255,255,255,0.8)',

    // Neutrals - Dark
    black: '#0F172A',
    darkBackground: '#0B1120',
    darkSurface: '#1E293B',
    darkBorder: '#334155',
    darkText: '#F8FAFC',
    darkTextSecondary: '#94A3B8',
    darkTextSecondaryOpacity: 'rgba(0,0,0,0.5)',

    // Functional
    error: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
    info: '#3B82F6',
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
    offWhiteText: palette.offWhiteText,
    darkTextSecondaryOpacity: palette.darkTextSecondaryOpacity,
    transparent: 'transparent',
    disabled: '#CBD5E1',
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
    disabled: '#334155',
    offWhiteText: palette.white,
    darkTextSecondaryOpacity: palette.white,
};

export type Colors = typeof lightColors;

