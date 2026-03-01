import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ImageBackground,
    Dimensions,
    StatusBar,
    ToastAndroid,
    Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/navigation';
import { useTheme } from '../context';
import { ThemeText, Button, Input } from '../components';
import { validateForm, forgotPasswordFields } from '../utils/validators';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

interface ForgotPasswordScreenProps {
    navigation: ForgotPasswordScreenNavigationProp;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
    const [formValues, setFormValues] = useState<Record<string, string>>({
        email: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const { colors } = useTheme();

    const handleFieldChange = (name: string, value: string) => {
        setFormValues(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const errors = validateForm(formValues, forgotPasswordFields);
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleResetPassword = async () => {
        if (!validate()) {
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            if (Platform.OS === 'android') {
                ToastAndroid.show('Reset link sent to your email', ToastAndroid.LONG);
            }
            navigation.navigate('Login');
        }, 2000);
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
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="chevron-back" size={28} color="#fff" />
                        </TouchableOpacity>

                        <View style={styles.headerContent}>
                            <View style={styles.appLogoContainer}>
                                {/* <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
                                    <Ionicons name="key" size={30} color="#fff" />
                                </View> */}
                                <Image source={require('../asssets/app-logo.png')} style={styles.logoIcon} />
                                <ThemeText style={[styles.appName, { color: colors.surface }]}>ZippOrder</ThemeText>
                            </View>

                            <View style={styles.welcomeContainer}>
                                <ThemeText style={[styles.welcomeTitle, { color: colors.surface }]}>Forgot Password?</ThemeText>
                                <ThemeText style={[styles.welcomeSubtitle, { color: colors.offWhiteText }]}>Enter your email to reset your password</ThemeText>
                            </View>
                        </View>
                    </ImageBackground>

                    <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
                        <View style={styles.form}>
                            {forgotPasswordFields.map((field) => (
                                <Input
                                    key={field.name}
                                    label={field.label}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                    value={formValues[field.name]}
                                    onChangeText={(val) => handleFieldChange(field.name, val)}
                                    error={formErrors[field.name]}
                                    autoCapitalize={field.autoCapitalize}
                                    secureTextEntry={field.type === 'password'}
                                    keyboardType={field.type === 'email' ? 'email-address' : 'default'}
                                    leftIcon={<Ionicons name={field.icon as any} size={20} color={colors.textSecondary} />}
                                    containerStyle={styles.inputContainer}
                                />
                            ))}

                            <Button
                                title={loading ? "Sending..." : "Send Reset Link"}
                                onPress={handleResetPassword}
                                loading={loading}
                                style={styles.resetButton}
                            />

                            <View style={[styles.dividerFull, { backgroundColor: colors.border }]} />

                            <View style={styles.featuresSection}>
                                <View style={styles.featureItem}>
                                    <View style={[styles.featureIconContainer, { backgroundColor: colors.primary + '15' }]}>
                                        <Ionicons name="shield-checkmark" size={22} color={colors.primary} />
                                    </View>
                                    <ThemeText style={styles.featureText}>Secure</ThemeText>
                                </View>
                                <View style={styles.featureItem}>
                                    <View style={[styles.featureIconContainer, { backgroundColor: colors.primary + '15' }]}>
                                        <Ionicons name="flash" size={22} color={colors.primary} />
                                    </View>
                                    <ThemeText style={styles.featureText}>Fast</ThemeText>
                                </View>
                                <View style={styles.featureItem}>
                                    <View style={[styles.featureIconContainer, { backgroundColor: colors.primary + '15' }]}>
                                        <Ionicons name="headset" size={22} color={colors.primary} />
                                    </View>
                                    <ThemeText style={styles.featureText}>Support</ThemeText>
                                </View>
                            </View>

                            <View style={styles.footer}>
                                <ThemeText style={[styles.footerText, { color: colors.textSecondary }]}>Remembered your password? </ThemeText>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <ThemeText style={[styles.footerLink, { color: colors.primary }]}>Login</ThemeText>
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
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    headerBackground: {
        width: width,
        height: height * 0.35,
        paddingTop: StatusBar.currentHeight || 40,
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    backButton: {
        position: 'absolute',
        top: (StatusBar.currentHeight || 40) + 10,
        left: 20,
        zIndex: 10,
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
        marginBottom: 15,
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
        lineHeight: 24,
        fontWeight: 'bold',
        fontFamily: 'Inter-Bold',
    },
    welcomeContainer: {
        alignItems: 'center',
    },
    welcomeTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        fontFamily: 'Inter-Bold',
        marginBottom: 8,
    },
    welcomeSubtitle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Inter-Bold',
        textAlign: 'center',
    },
    formCard: {
        flex: 1,
        marginTop: -30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 24,
        paddingTop: 40,
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
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 15,
    },
    resetButton: {
        marginVertical: 20,
        // marginBottom: 15,
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
        fontWeight: '600',
        color: 'rgba(0,0,0,0.5)',
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 10,
    },
    footerText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Inter-Bold',
    },
    footerLink: {
        fontSize: 14,
        fontFamily: 'Inter-Bold',
        fontWeight: 'bold',
    },
});

export default ForgotPasswordScreen;
