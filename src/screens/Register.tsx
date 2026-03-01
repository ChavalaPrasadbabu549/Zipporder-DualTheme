import React, { useState } from 'react';
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
import { ThemeText, Button, Input, ImagePickerModal } from '../components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { register } from '../store/slices/authSlice';
import { validateForm, registerFields } from '../utils/validators';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Asset } from 'react-native-image-picker';
import { takePhotoAction, pickFromGalleryAction } from '../utils/imagePicker';



const { width, height } = Dimensions.get('window');
type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

interface RegisterScreenProps {
    navigation: RegisterScreenNavigationProp;
}
const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
    const [formValues, setFormValues] = useState<Record<string, string>>({
        profile_picture: '',
        name: '',
        email: '',
        phone_number: '',
        dob: '',
        location: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [profileImage, setProfileImage] = useState<Asset | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.auth);
    const { colors } = useTheme();

    const handleFieldChange = (name: string, value: string) => {
        setFormValues(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const takePhoto = async () => {
        setShowPicker(false);
        await takePhotoAction((asset) => {
            setProfileImage(asset);
            handleFieldChange('profile_picture', asset.uri || 'selected');
        });
    };

    const pickFromGallery = async () => {
        setShowPicker(false);
        await pickFromGalleryAction((asset) => {
            setProfileImage(asset);
            handleFieldChange('profile_picture', asset.uri || 'selected');
        });
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

        const registrationData = {
            ...formValues,
            profile_picture: profileImage ? {
                uri: profileImage.uri,
                type: profileImage.type,
                name: (profileImage.fileName || `profile_${Date.now()}.jpg`).replace(/\s+/g, '_'),
            } : null
        };

        dispatch(register(registrationData))
            .unwrap()
            .then((data) => {
                if (Platform.OS === 'android') {
                    const detail = data.user ? ` (${data.user.email})` : '';
                    ToastAndroid.show(`${data.message}${detail}`, ToastAndroid.SHORT);
                }
            })
            .catch((error) => {
                if (Platform.OS === 'android') {
                    ToastAndroid.show(error || 'Registration Failed', ToastAndroid.LONG);
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
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="chevron-back" size={28} color="#fff" />
                        </TouchableOpacity>

                        <View style={styles.headerContent}>
                            <View style={styles.appLogoContainer}>
                                {/* <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
                                    <Ionicons name="cart" size={30} color="#fff" />
                                </View> */}
                                <Image source={require('../asssets/app-logo.png')} style={styles.logoIcon} />
                                <ThemeText style={[styles.appName, { color: colors.surface }]}>ZippOrder</ThemeText>
                            </View>

                            <View style={styles.welcomeContainer}>
                                <ThemeText style={[styles.welcomeTitle, { color: colors.surface }]}>Register Account</ThemeText>
                                <ThemeText style={[styles.welcomeSubtitle, { color: colors.offWhiteText }]}>Register to get started and enjoy shopping with us!</ThemeText>
                            </View>
                        </View>
                    </ImageBackground>

                    <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
                        <View style={styles.form}>
                            {/* Profile Image Picker */}
                            <View style={styles.profilePickerContainer}>
                                <TouchableOpacity
                                    style={[styles.profileImageWrapper, { borderColor: colors.primary }]}
                                    onPress={() => setShowPicker(true)}
                                >
                                    {profileImage ? (
                                        <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />
                                    ) : (
                                        <View style={styles.profilePlaceholder}>
                                            <Ionicons name="camera" size={30} color={colors.textSecondary} />
                                            <ThemeText style={[styles.profilePlaceholderText, { color: colors.textSecondary }]}>Add Photo</ThemeText>
                                        </View>
                                    )}
                                    <View style={[styles.addIconBadge, { backgroundColor: colors.primary }]}>
                                        <Ionicons name="add" size={16} color="#fff" />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {registerFields
                                .filter(field => field.type !== 'image')
                                .map((field) => (
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
                                        keyboardType={field.type === 'number' ? 'phone-pad' : (field.type === 'email' ? 'email-address' : 'default')}
                                        maxLength={field.name === 'phone_number' ? 10 : (field.name === 'dob' ? 10 : undefined)}
                                        leftIcon={<Ionicons name={field.icon as any} size={20} color={colors.textSecondary} />}
                                        containerStyle={styles.inputSpacing}
                                    />
                                ))}

                            {/* <TouchableOpacity
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
                            </TouchableOpacity> */}

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
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Image Picker Modal */}
            <ImagePickerModal
                visible={showPicker}
                onClose={() => setShowPicker(false)}
                onTakePhoto={takePhoto}
                onPickGallery={pickFromGallery}
            />
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
    },
    welcomeContainer: {
        alignItems: 'center',
    },
    welcomeTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        fontFamily: 'Inter-Bold',
        marginBottom: 6,
    },
    welcomeSubtitle: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter-Medium',
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
        marginVertical: 10,
    },
    agreeText: {
        marginLeft: 10,
        fontSize: 14,
    },
    registerButton: {
        marginVertical: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    footerText: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter-Medium',
    },
    footerLink: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: 'bold',
        fontFamily: 'Inter-Bold',
    },
    profilePickerContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    profileImageWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#f8f8f8',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    profilePlaceholder: {
        alignItems: 'center',
    },
    profilePlaceholderText: {
        fontSize: 12,
        marginTop: 4,
    },
    addIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
});

export default RegisterScreen;
