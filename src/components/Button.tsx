import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ButtonProps } from '../utils/types';

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    style,
    textStyle
}) => {
    const getButtonStyle = (): ViewStyle => {
        const baseStyle = styles.button;
        switch (variant) {
            case 'secondary':
                return { ...baseStyle, ...styles.secondaryButton };
            case 'outline':
                return { ...baseStyle, ...styles.outlineButton };
            default:
                return baseStyle;
        }
    };

    const getTextStyle = (): TextStyle => {
        const baseStyle = styles.buttonText;
        switch (variant) {
            case 'outline':
                return { ...baseStyle, ...styles.outlineButtonText };
            default:
                return baseStyle;
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
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
    },
    secondaryButton: {
        backgroundColor: '#5856D6',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#007AFF',
    },
    disabledButton: {
        backgroundColor: '#ccc',
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    outlineButtonText: {
        color: '#007AFF',
    },
});

export default Button;
