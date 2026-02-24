import React, { useState } from 'react';
import {
    TextInput,
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { InputProps } from '../utils/types';
import { useTheme } from '../context';

const Input: React.FC<InputProps> = ({
    label,
    error,
    containerStyle,
    inputStyle,
    labelStyle,
    errorStyle,
    leftIcon,
    rightIcon,
    required = false,
    ...textInputProps
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const { colors } = useTheme();

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={[styles.label, { color: colors.text }, labelStyle]}>
                    {label}
                    {required && <Text style={{ color: colors.error }}> *</Text>}
                </Text>
            )}

            <View
                style={[
                    styles.inputContainer,
                    {
                        backgroundColor: colors.background,
                        borderColor: error ? colors.error : colors.border
                    },
                    isFocused && { borderColor: colors.primary, backgroundColor: colors.surface },
                    error && { borderColor: colors.error },
                ]}
            >
                {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

                <TextInput
                    style={[
                        styles.input,
                        { color: colors.text },
                        leftIcon ? styles.inputWithLeftIcon : undefined,
                        rightIcon ? styles.inputWithRightIcon : undefined,
                        inputStyle,
                    ]}
                    placeholderTextColor={colors.placeholder}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...textInputProps}
                />

                {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
            </View>

            {error && <Text style={[styles.error, { color: colors.error }, errorStyle]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 7,
        borderWidth: 1,
        paddingHorizontal: 16,
        height: 50,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 12,
    },
    inputWithLeftIcon: {
        paddingLeft: 8,
    },
    inputWithRightIcon: {
        paddingRight: 8,
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
    error: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});

export default Input;
