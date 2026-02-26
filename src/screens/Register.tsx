import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ToastAndroid,
    StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/navigation';
import { useTheme } from '../context';
import { ThemeText, Button, Input, ThemedSafeAreaView } from '../components';
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
        }))
            .unwrap()
            .then(() => {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Account Created Successfully!', ToastAndroid.SHORT);
                }
            });
    };

    return (
        <ThemedSafeAreaView>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* <StatusBar
                        barStyle={colors.background === '#000' ? 'light-content' : 'dark-content'}
                        backgroundColor={colors.background}
                        translucent
                    /> */}
                    <View style={[styles.bgBlob, { backgroundColor: colors.primary }]} />

                    <View style={styles.content}>
                        <View style={styles.header}>
                            <View style={[styles.iconContainer, { backgroundColor: colors.surface }]}>
                                <Ionicons name="person-add" size={32} color={colors.primary} />
                            </View>
                            <ThemeText style={styles.title}>Create Account</ThemeText>
                            <ThemeText style={[styles.subtitle, { color: colors.textSecondary }]}>
                                Discover the finest bakery items near you
                            </ThemeText>
                        </View>

                        <View style={styles.formCard}>
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
                                    maxLength={field.name === 'phone_number' ? 10 : (field.name === 'dob' ? 10 : undefined)}
                                    leftIcon={<Ionicons name={field.icon as any} size={20} color={colors.primary} />}
                                    containerStyle={styles.inputSpacing}
                                />
                            ))}

                            <Button
                                title={loading ? "Registering..." : "Sign Up"}
                                onPress={handleRegister}
                                disabled={loading}
                                style={{
                                    backgroundColor: colors.primary,
                                    marginVertical: 20,
                                }}
                            />
                        </View>

                        <View style={styles.footer}>
                            <ThemeText style={styles.loginText}>Already a member? </ThemeText>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <ThemeText style={[styles.loginLink, { color: colors.primary }]}>Login here</ThemeText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    bgBlob: {
        position: 'absolute',
        top: -150,
        right: -100,
        width: 400,
        height: 400,
        borderRadius: 200,
        opacity: 0.1,
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 60,
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    title: {
        fontSize: 34,
        fontWeight: '900',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    formCard: {
        width: '100%',
    },
    inputSpacing: {
        marginBottom: 16,
    },
    registerBtn: {
        height: 56,
        borderRadius: 18,
        marginTop: 10,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    line: {
        flex: 1,
        height: 1,
        opacity: 0.3,
    },
    dividerText: {
        marginHorizontal: 15,
        fontSize: 14,
        fontWeight: 'bold',
        opacity: 0.5,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 30,
    },
    socialBtn: {
        width: 60,
        height: 60,
        borderRadius: 20,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    loginText: {
        fontSize: 15,
        opacity: 0.7,
    },
    loginLink: {
        fontSize: 15,
        fontWeight: '700',
    },
});

export default RegisterScreen;
