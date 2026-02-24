import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/navigation';
import { useTheme } from '../context';
import { ThemeText, Button, Input } from '../components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { register, clearError } from '../store/slices/authSlice';
import { validateForm, registerFields } from '../utils/validators';
import Ionicons from 'react-native-vector-icons/Ionicons';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

interface RegisterScreenProps {
    navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
    const [formValues, setFormValues] = useState<Record<string, string>>({
        email: '',
        phone_number: '',
        dob: '',
        location: '',
        password: '',
        confirmPassword: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);
    const { colors } = useTheme();

    useEffect(() => {
        if (error) {
            Alert.alert('Registration Failed', error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleFieldChange = (name: string, value: string) => {
        setFormValues(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const errors = validateForm(formValues, registerFields);
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) {
            return;
        }
        dispatch(register({
            phone_number: formValues.phone_number,
            email: formValues.email,
            password: formValues.password,
            dob: formValues.dob,
            location: formValues.location,
        }));
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>

                    <ThemeText style={styles.title}>Create Account</ThemeText>
                    <ThemeText style={[styles.subtitle, { color: colors.textSecondary }]}>Sign up to get started</ThemeText>

                    <View style={styles.form}>
                        {registerFields.map((field) => (
                            <Input
                                key={field.name}
                                label={field.label}
                                placeholder={field.placeholder}
                                value={formValues[field.name]}
                                onChangeText={(val) => handleFieldChange(field.name, val)}
                                error={formErrors[field.name]}
                                secureTextEntry={field.type === 'password'}
                                autoCapitalize={field.autoCapitalize}
                                keyboardType={field.type === 'number' ? 'phone-pad' : (field.type === 'email' ? 'email-address' : 'default')}
                                leftIcon={<Ionicons name={field.icon as any} size={20} color={colors.textSecondary} />}
                            />
                        ))}

                        <Button
                            title={loading ? "Creating Account..." : "Sign Up"}
                            onPress={handleRegister}
                            disabled={loading}
                            style={{ backgroundColor: colors.primary, marginTop: 8, marginBottom: 16 }}
                        />

                        <View style={styles.loginContainer}>
                            <ThemeText style={styles.loginText}>Already have an account? </ThemeText>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <ThemeText style={[styles.loginLink, { color: colors.primary }]}>Login</ThemeText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    backButton: {
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 40,
    },
    form: {
        width: '100%',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        fontSize: 14,
    },
    loginLink: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default RegisterScreen;
