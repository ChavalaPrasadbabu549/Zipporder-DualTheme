import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ToastAndroid,
    ImageBackground,
    Dimensions,
    StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/navigation';
import { useTheme } from '../context';
import { ThemeText, Button, Input } from '../components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { login } from '../store/slices/authSlice';
import { validateForm, loginFields } from '../utils/validators';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
    navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const [formValues, setFormValues] = useState<Record<string, string>>({
        email: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.auth);
    const { colors } = useTheme();

    const handleFieldChange = (name: string, value: string) => {
        setFormValues(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const errors = validateForm(formValues, loginFields);
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) {
            return;
        }
        dispatch(login({ email: formValues.email, password: formValues.password }))
            .unwrap()
            .then(() => {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Login Successful!', ToastAndroid.SHORT);
                }
            });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <ImageBackground
                    source={require('../asssets/auth_bg.png')}
                    style={styles.headerBackground}
                    resizeMode="cover"
                >
                    <View style={styles.overlay} />
                    <View style={styles.headerContent}>
                        <View style={styles.appLogoContainer}>
                            <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
                                <Ionicons name="cart" size={30} color="#fff" />
                            </View>
                            <ThemeText style={styles.appName}>ZippOrder</ThemeText>
                        </View>

                        <View style={styles.welcomeContainer}>
                            <ThemeText style={styles.welcomeTitle}>Welcome Back 👋</ThemeText>
                            <ThemeText style={styles.welcomeSubtitle}>Login to continue shopping</ThemeText>
                        </View>
                    </View>
                </ImageBackground>

                <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={styles.keyboardView}
                    >
                        <View style={styles.form}>
                            {loginFields.map((field) => (
                                <Input
                                    key={field.name}
                                    placeholder={field.placeholder}
                                    value={formValues[field.name]}
                                    onChangeText={(val) => handleFieldChange(field.name, val)}
                                    error={formErrors[field.name]}
                                    secureTextEntry={field.type === 'password'}
                                    autoCapitalize={field.autoCapitalize}
                                    keyboardType={field.type === 'email' ? 'email-address' : 'default'}
                                    leftIcon={<Ionicons name={field.icon as any} size={20} color={colors.textSecondary} />}
                                    containerStyle={styles.inputContainer}
                                />
                            ))}

                            <TouchableOpacity
                                style={styles.forgotPassword}
                                onPress={() => navigation.navigate('ForgotPassword' as any)}
                            >
                                <ThemeText style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot Password?</ThemeText>
                            </TouchableOpacity>

                            <Button
                                title={loading ? "Logging in..." : "Login"}
                                onPress={handleLogin}
                                disabled={loading}
                                style={styles.loginButton}
                            />

                            <View style={styles.footer}>
                                <ThemeText style={[styles.footerText, { color: colors.textSecondary }]}>New user? </ThemeText>
                                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                    <ThemeText style={[styles.footerLink, { color: colors.primary }]}>Create Account</ThemeText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    headerBackground: {
        width: width,
        height: height * 0.4,
        paddingTop: StatusBar.currentHeight || 40,
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    appLogoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoIcon: {
        width: 45,
        height: 45,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    welcomeContainer: {
        alignItems: 'center',
    },
    welcomeTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    formCard: {
        flex: 1,
        marginTop: -40,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 40,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    keyboardView: {
        flex: 1,
    },
    form: {
        width: '100%',
        marginTop: 100,
    },
    inputContainer: {
        marginBottom: 16,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        marginBottom: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        fontSize: 15,
    },
    footerLink: {
        fontSize: 15,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
