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
    ImageBackground,
    Dimensions,
    StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/navigation';
import { useTheme } from '../context';
import { ThemeText, Button, Input } from '../components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { register, clearError } from '../store/slices/authSlice';
import { validateForm, registerFields } from '../utils/validators';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

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
    const [agreed, setAgreed] = useState(false);

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
        if (!agreed) {
            Alert.alert('Terms & Conditions', 'Please agree to the terms and conditions to continue.');
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
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back" size={28} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.headerContent}>
                        <View style={styles.appLogoContainer}>
                            <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
                                <Ionicons name="cart" size={30} color="#fff" />
                            </View>
                            <ThemeText style={styles.appName}>ZippOrder</ThemeText>
                        </View>

                        <View style={styles.welcomeContainer}>
                            <ThemeText style={styles.welcomeTitle}>Create Account</ThemeText>
                            <ThemeText style={styles.welcomeSubtitle}>Register to get started!</ThemeText>
                        </View>
                    </View>
                </ImageBackground>

                <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={styles.keyboardView}
                    >
                        <View style={styles.form}>
                            {registerFields.map((field) => (
                                <Input
                                    key={field.name}
                                    placeholder={field.placeholder}
                                    value={formValues[field.name]}
                                    onChangeText={(val) => handleFieldChange(field.name, val)}
                                    error={formErrors[field.name]}
                                    secureTextEntry={field.type === 'password'}
                                    autoCapitalize={field.autoCapitalize}
                                    keyboardType={field.type === 'number' ? 'phone-pad' : (field.type === 'email' ? 'email-address' : 'default')}
                                    maxLength={field.name === 'phone_number' ? 10 : (field.name === 'dob' ? 10 : undefined)}
                                    leftIcon={<Ionicons name={field.icon as any} size={20} color={colors.textSecondary} />}
                                    containerStyle={styles.inputSpacing}
                                />
                            ))}

                            <TouchableOpacity
                                style={styles.agreeContainer}
                                onPress={() => setAgreed(!agreed)}
                            >
                                <Ionicons
                                    name={agreed ? "checkbox" : "square-outline"}
                                    size={22}
                                    color={agreed ? colors.primary : colors.textSecondary}
                                />
                                <ThemeText style={styles.agreeText}>
                                    I agree to the <ThemeText style={{ color: colors.primary, fontWeight: 'bold' }}>Terms & Conditions</ThemeText>
                                </ThemeText>
                            </TouchableOpacity>

                            <Button
                                title={loading ? "Registering..." : "Register"}
                                onPress={handleRegister}
                                disabled={loading}
                                style={styles.registerButton}
                            />

                            <View style={styles.footer}>
                                <ThemeText style={[styles.footerText, { color: colors.textSecondary }]}>Already have an account? </ThemeText>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <ThemeText style={[styles.footerLink, { color: colors.primary }]}>Login</ThemeText>
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
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    appName: {
        fontSize: 24,
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
        marginBottom: 6,
    },
    welcomeSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    formCard: {
        flex: 1,
        marginTop: -30,
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
    },
    inputSpacing: {
        marginBottom: 16,
    },
    agreeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    },
    agreeText: {
        marginLeft: 10,
        fontSize: 14,
    },
    registerButton: {
        marginVertical: 20,

    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    footerText: {
        fontSize: 15,
    },
    footerLink: {
        fontSize: 15,
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
