import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ButtonProps } from '../utils/types';
import { useTheme } from '../context';

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    style,
    textStyle
}) => {
    const { colors } = useTheme();

    const getButtonStyle = (): ViewStyle => {
        const baseStyle = [styles.button, { backgroundColor: colors.primary }];
        switch (variant) {
            case 'secondary':
                return StyleSheet.flatten([baseStyle, { backgroundColor: colors.secondary }]);
            case 'outline':
                return StyleSheet.flatten([styles.button, { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.primary }]);
            default:
                return StyleSheet.flatten(baseStyle);
        }
    };

    const getTextStyle = (): TextStyle => {
        switch (variant) {
            case 'outline':
                return StyleSheet.flatten([styles.buttonText, { color: colors.primary }]);
            default:
                return StyleSheet.flatten([styles.buttonText, { color: '#FFFFFF' }]);
        }
    };

    return (
        <TouchableOpacity
            style={[getButtonStyle(), disabled && styles.disabledButton, style]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    disabledButton: {
        backgroundColor: '#ccc',
        opacity: 0.6,
        elevation: 0,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Button;
