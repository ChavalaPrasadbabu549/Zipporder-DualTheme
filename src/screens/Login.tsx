import React, { useState, } from 'react';
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
    Image,
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
            .then((data) => {
                if (Platform.OS === 'android') {
                    const detail = data.user ? ` (${data.user.email})` : '';
                    ToastAndroid.show(`${data.message}${detail}`, ToastAndroid.SHORT);
                }
            })
            .catch((error) => {
                if (Platform.OS === 'android') {
                    ToastAndroid.show(error || 'Login Failed', ToastAndroid.LONG);
                }
            });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <ImageBackground
                        source={require('../asssets/auth_bg.png')}
                        style={styles.headerBackground}
                        resizeMode="cover"
                    >
                        <View style={styles.overlay} />
                        <View style={styles.headerContent}>
                            <View style={styles.appLogoContainer}>
                                {/* <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
                                    <Ionicons name="cart" size={30} color={colors.surface} />
                                </View> */}
                                <Image source={require('../asssets/app-logo.png')} style={styles.logoIcon} />
                                <ThemeText style={[styles.appName, { color: colors.surface }]}>ZippOrder</ThemeText>
                            </View>

                            <View style={styles.welcomeContainer}>
                                <ThemeText style={[styles.welcomeTitle, { color: colors.surface }]}>Welcome Back 👋</ThemeText>
                                <ThemeText style={[styles.welcomeSubtitle, { color: colors.offWhiteText }]}>Login to continue shopping and get exciting offers</ThemeText>
                            </View>
                        </View>
                    </ImageBackground>

                    <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
                        <View style={styles.form}>
                            {loginFields.map((field) => (
                                <Input
                                    key={field.name}
                                    label={field.label}
                                    required={field.required}
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
                                onPress={() => navigation.navigate('ForgotPassword')}
                            >
                                <ThemeText style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot Password?</ThemeText>
                            </TouchableOpacity>

                            <Button
                                title="Login"
                                onPress={handleLogin}
                                loading={loading}
                                style={styles.loginButton}
                            />

                            <View style={[styles.dividerFull, { backgroundColor: colors.border }]} />

                            <View style={styles.featuresSection}>
                                <View style={styles.featureItem}>
                                    <View style={[styles.featureIconContainer, { backgroundColor: colors.primary + '15' }]}>
                                        <Ionicons name="shield-checkmark" size={22} color={colors.primary} />
                                    </View>
                                    <ThemeText style={[styles.featureText, { color: colors.darkTextSecondaryOpacity }]}>Secure</ThemeText>
                                </View>
                                <View style={styles.featureItem}>
                                    <View style={[styles.featureIconContainer, { backgroundColor: colors.primary + '15' }]}>
                                        <Ionicons name="flash" size={22} color={colors.primary} />
                                    </View>
                                    <ThemeText style={[styles.featureText, { color: colors.darkTextSecondaryOpacity }]}>Fast</ThemeText>
                                </View>
                                <View style={styles.featureItem}>
                                    <View style={[styles.featureIconContainer, { backgroundColor: colors.primary + '15' }]}>
                                        <Ionicons name="headset" size={22} color={colors.primary} />
                                    </View>
                                    <ThemeText style={[styles.featureText, { color: colors.darkTextSecondaryOpacity }]}>Support</ThemeText>
                                </View>
                            </View>

                            <View style={styles.footer}>
                                <ThemeText style={[styles.footerText, { color: colors.textSecondary }]}>Don't have an account? </ThemeText>
                                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                    <ThemeText style={[styles.footerLink, { color: colors.primary }]}>Register</ThemeText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        fontSize: 24,
        lineHeight: 26,
        fontWeight: 'bold',
        fontFamily: 'Inter-Bold',
    },
    welcomeContainer: {
        alignItems: 'center',
    },
    welcomeTitle: {
        fontSize: 26,
        lineHeight: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Inter-Bold',
    },
    welcomeSubtitle: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        fontFamily: 'Inter-Regular',
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
        marginTop: 20,
    },
    inputContainer: {
        marginBottom: 16,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontSize: 13,
        lineHeight: 20,
        fontFamily: 'Inter-Medium',
        fontWeight: '600',
    },
    loginButton: {
        marginBottom: 24,
    },
    footerText: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '600',
        fontFamily: 'Inter-Medium',
    },
    footerLink: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '700',
        fontFamily: 'Inter-SemiBold',
    },
    dividerFull: {
        height: 1,
        width: '100%',
        marginTop: 10,
        opacity: 0.5,
    },
    featuresSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        paddingHorizontal: 10,
    },
    featureItem: {
        alignItems: 'center',
        flex: 1,
    },
    featureIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    featureText: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '600',
        fontFamily: 'Inter-Medium',
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 10,
    },
});

export default LoginScreen;
