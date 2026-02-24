import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { ThemedSafeAreaViewProps } from '../utils/types';



export const ThemedSafeAreaView: React.FC<ThemedSafeAreaViewProps> = ({ children, style }) => {
    const { colors, isDark } = useTheme();

    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor: colors.background }, style]}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />
            {children}
        </SafeAreaView>
    );
};
