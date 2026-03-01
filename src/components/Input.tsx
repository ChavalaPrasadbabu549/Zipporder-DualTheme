import React, { useState } from 'react';
import {
    TextInput,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { InputProps } from '../utils/types';
import { useTheme } from '../context';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
    secureTextEntry,
    ...textInputProps
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { colors } = useTheme();

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const renderRightIcon = () => {
        if (secureTextEntry) {
            return (
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconRight}>
                    <Ionicons
                        name={isPasswordVisible ? 'eye' : 'eye-off'}
                        size={20}
                        color={colors.textSecondary}
                    />
                </TouchableOpacity>
            );
        }
        if (rightIcon) {
            return <View style={styles.iconRight}>{rightIcon}</View>;
        }
        return null;
    };

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
                        (secureTextEntry || rightIcon) ? styles.inputWithRightIcon : undefined,
                        inputStyle,
                    ]}
                    placeholderTextColor={colors.placeholder}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    {...textInputProps}
                />

                {renderRightIcon()}
            </View>

            {error && <Text style={[styles.error, { color: colors.error }, errorStyle]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 4,
        fontFamily: 'Inter-SemiBold',
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 16,
        height: 50,
    },
    input: {
        flex: 1,
        fontSize: 13,
        paddingVertical: 12,
        fontFamily: 'Inter-Regular',
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
