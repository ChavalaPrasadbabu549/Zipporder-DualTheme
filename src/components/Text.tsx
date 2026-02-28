import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../context';

const ThemeText: React.FC<TextProps> = ({ style, children, ...props }) => {
    const { colors } = useTheme();

    return (
        <RNText style={[styles.text, { color: colors.text }, style]} {...props}>
            {children}
        </RNText>
    );
};

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Inter-Regular',
    },
});

export default ThemeText;
