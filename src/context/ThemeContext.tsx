import React, { createContext, useState, useMemo, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from '../utils/colors';

type ThemeMode = 'light' | 'dark' | 'system';

export const ThemeContext = createContext({
    isDark: false,
    colors: lightColors,
    themeMode: 'system' as ThemeMode,
    setThemeMode: (mode: ThemeMode) => { },
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: any) => {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState<ThemeMode>('system');

    const isDark = useMemo(() => {
        if (themeMode === 'system') {
            return systemColorScheme === 'dark';
        }
        return themeMode === 'dark';
    }, [themeMode, systemColorScheme]);

    const colors = isDark ? darkColors : lightColors;

    const toggleTheme = () => {
        setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider
            value={{
                isDark,
                colors,
                themeMode,
                setThemeMode,
                toggleTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
