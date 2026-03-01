import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, View } from 'react-native';
import { ButtonProps } from '../utils/types';
import { useTheme } from '../context';

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
    textStyle,
    startIcon,
    rightIcon,
}) => {
    const { colors } = useTheme();
    const isDisabled = disabled || loading;

    const getButtonStyle = (): ViewStyle => {
        const baseStyle = [styles.button, { backgroundColor: colors.primary }];
        switch (variant) {
            case 'secondary':
                return StyleSheet.flatten([baseStyle, { backgroundColor: colors.secondary }]);
            case 'outline':
                return StyleSheet.flatten([styles.button, { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 }]);
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
            style={[
                getButtonStyle(),
                isDisabled && styles.disabledButton,
                isDisabled && {
                    backgroundColor: variant === 'outline' ? 'transparent' : colors.disabled,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                !title && { minWidth: 0, paddingHorizontal: 12 },
                style
            ]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? colors.primary : '#FFFFFF'} />
            ) : (
                <>
                    {startIcon && <View style={[styles.startIcon, !!title && { marginRight: 8 }]}>{startIcon}</View>}
                    {title ? (
                        <Text style={[
                            getTextStyle(),
                            isDisabled && { color: variant === 'outline' ? colors.disabled : '#FFFFFF' },
                            textStyle
                        ]}>{title}</Text>
                    ) : null}
                    {rightIcon && <View style={[styles.rightIcon, !!title && { marginLeft: 8 }]}>{rightIcon}</View>}
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
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
        opacity: 0.8,
    },
    buttonText: {
        fontSize: 16,
        lineHeight: 18,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
    },
    startIcon: {
        // Margin applied dynamically
    },
    rightIcon: {
        // Margin applied dynamically
    },
});

export default Button;
