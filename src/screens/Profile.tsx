import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Switch,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../hooks';
import { logout } from '../store/slices/authSlice';
import { useTheme } from '../context';
import { Platform, ToastAndroid } from 'react-native';
import { Asset } from 'react-native-image-picker';
import { takePhotoAction, pickFromGalleryAction } from '../utils/imagePicker';
import { formatImageUrl } from '../utils/helpers';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation';
import { Input, Button, ImagePickerModal, ThemeText, ThemedSafeAreaView } from '../components';
import { updateProfile } from '../store/slices/authSlice';


type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;
export const Profile: React.FC<Props> = ({ navigation }) => {
    const { user, loading } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const { colors, isDark, toggleTheme } = useTheme();
    const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [profileImage, setProfileImage] = useState<Asset | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        location: user?.location || '',
    });

    const handleFieldChange = (name: string, value: string) => {
        setEditValues(prev => ({ ...prev, [name]: value }));
    };

    const takePhoto = async () => {
        setShowPicker(false);
        await takePhotoAction((asset) => {
            setProfileImage(asset);
        });
    };

    const pickFromGallery = async () => {
        setShowPicker(false);
        await pickFromGalleryAction((asset) => {
            setProfileImage(asset);
        });
    };

    const handleSave = async () => {
        if (!user?.id) return;

        const userData = {
            ...editValues,
            profile_picture: profileImage ? {
                uri: profileImage.uri,
                type: profileImage.type,
                name: (profileImage.fileName || `profile_${Date.now()}.jpg`).replace(/\s+/g, '_'),
            } : null
        };

        dispatch(updateProfile({ id: user.id, userData }))
            .unwrap()
            .then((data) => {
                setIsEditing(false);
                setProfileImage(null);
                if (Platform.OS === 'android') {
                    ToastAndroid.show(data.message || 'Profile updated', ToastAndroid.SHORT);
                }
            })
            .catch((error) => {
                if (Platform.OS === 'android') {
                    ToastAndroid.show(error || 'Update Failed', ToastAndroid.LONG);
                }
            });
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    const MenuItem = ({
        icon,
        label,
        value,
        onPress,
        isLast,
        hasSwitch,
        switchValue,
        onSwitchChange,
        iconColor
    }: {
        icon: string;
        label: string;
        value?: string;
        onPress?: () => void;
        isLast?: boolean;
        hasSwitch?: boolean;
        switchValue?: boolean;
        onSwitchChange?: (val: boolean) => void;
        iconColor?: string;
    }) => (
        <TouchableOpacity
            style={[styles.menuItem, isLast && styles.lastMenuItem]}
            onPress={onPress}
            disabled={hasSwitch}
        >
            <View style={[styles.menuIconContainer]}>
                <Ionicons name={icon} size={22} color={iconColor || colors.primary} />
            </View>
            <ThemeText style={styles.menuLabel}>{label}</ThemeText>
            {value && <ThemeText style={[styles.menuValue, { color: colors.textSecondary }]}>{value}</ThemeText>}
            {hasSwitch ? (
                <Switch
                    value={switchValue}
                    onValueChange={onSwitchChange}
                    trackColor={{ false: '#DDD', true: colors.primary + '80' }}
                    thumbColor={switchValue ? colors.primary : '#F4F3F4'}
                />
            ) : (
                <Ionicons name="chevron-forward" size={18} color="#CCC" />
            )}
        </TouchableOpacity>
    );


    return (
        <ThemedSafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.logoTitleContainer}>
                    <Ionicons name="bag-handle" size={24} color={colors.primary} />
                    <ThemeText style={styles.headerTitle}>Zipporder</ThemeText>
                </View>
                <TouchableOpacity style={styles.settingsIcon}>
                    <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Profile Info Section */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarWrapper}>
                        <View style={[styles.avatarContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            {profileImage ? (
                                <Image source={{ uri: profileImage.uri }} style={styles.avatarImage} />
                            ) : user?.profile_picture ? (
                                <Image
                                    source={{ uri: formatImageUrl(user.profile_picture) }}
                                    style={styles.avatarImage}
                                />
                            ) : (
                                <ThemeText style={[styles.avatarPlaceholder, { color: colors.primary }]}>
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </ThemeText>
                            )}
                        </View>
                        {(isEditing || !user?.profile_picture) && (
                            <TouchableOpacity
                                style={[styles.cameraBadge, { backgroundColor: colors.primary }]}
                                onPress={() => setShowPicker(true)}
                            >
                                <Ionicons name="camera" size={14} color="#FFF" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {isEditing ? (
                        <View style={styles.editForm}>
                            <Input
                                label="Full Name"
                                placeholder="Enter your name"
                                value={editValues.name}
                                onChangeText={(val) => handleFieldChange('name', val)}
                                containerStyle={styles.editInput}
                                leftIcon={<Ionicons name="person" size={20} color={colors.textSecondary} />}
                            />
                            <Input
                                label="Email Address"
                                placeholder="Enter your email"
                                value={editValues.email}
                                onChangeText={(val) => handleFieldChange('email', val)}
                                keyboardType="email-address"
                                containerStyle={styles.editInput}
                                leftIcon={<Ionicons name="mail" size={20} color={colors.textSecondary} />}
                            />
                            <Input
                                label="Phone Number"
                                placeholder="Enter phone number"
                                value={editValues.phone_number}
                                onChangeText={(val) => handleFieldChange('phone_number', val)}
                                keyboardType="phone-pad"
                                containerStyle={styles.editInput}
                                leftIcon={<Ionicons name="call" size={20} color={colors.textSecondary} />}
                            />
                            <Input
                                label="Date of Birth"
                                placeholder="YYYY-MM-DD"
                                value={editValues.dob}
                                onChangeText={(val) => handleFieldChange('dob', val)}
                                containerStyle={styles.editInput}
                                leftIcon={<Ionicons name="calendar" size={20} color={colors.textSecondary} />}
                            />
                            <Input
                                label="Location"
                                placeholder="Enter location"
                                value={editValues.location}
                                onChangeText={(val) => handleFieldChange('location', val)}
                                containerStyle={styles.editInput}
                                leftIcon={<Ionicons name="location" size={20} color={colors.textSecondary} />}
                            />
                            <View style={styles.editActions}>
                                <Button
                                    title="Cancel"
                                    onPress={() => setIsEditing(false)}
                                    variant="outline"
                                    style={styles.cancelEditBtn}
                                    startIcon={<Ionicons name="close" size={20} color={colors.surface} />}
                                />
                                <Button
                                    title={loading ? "Saving..." : "Save Changes"}
                                    onPress={handleSave}
                                    disabled={loading}
                                    style={styles.saveEditBtn}
                                    startIcon={<Ionicons name="save" size={20} color={colors.surface} />}
                                />
                            </View>
                        </View>
                    ) : (
                        <>
                            <ThemeText style={styles.userName}>{user?.name || user?.phone_number || 'Guest User'}</ThemeText>
                            <ThemeText style={[styles.userEmail, { color: colors.textSecondary }]}>
                                {user?.email || 'No email provided'}
                            </ThemeText>

                            <TouchableOpacity
                                style={[styles.editProfileButton, { borderColor: colors.border }]}
                                onPress={() => {
                                    setEditValues({
                                        name: user?.name || '',
                                        email: user?.email || '',
                                        phone_number: user?.phone_number || '',
                                        dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
                                        location: user?.location || '',
                                    });
                                    setIsEditing(true);
                                }}
                            >
                                <ThemeText style={[styles.editProfileText, { color: colors.textSecondary }]}>View & Edit Profile</ThemeText>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {/* Menu Tiles */}
                <View style={[styles.menuCard, { backgroundColor: colors.surface }]}>
                    <MenuItem
                        icon="cube-outline"
                        label="My Orders"
                        value="5"
                        onPress={() => { navigation.navigate('Orders') }}
                        iconColor="#E67E22"
                    />
                    <MenuItem
                        icon="location-outline"
                        label="Shipping Address"
                        onPress={() => { }}
                        iconColor="#27AE60"
                    />
                    <MenuItem
                        icon="wallet-outline"
                        label="Wallet"
                        value="₹ 7520"
                        onPress={() => { }}
                        iconColor="#E74C3C"
                    />
                    <MenuItem
                        icon="cart-outline"
                        label="My Cart"
                        onPress={() => navigation.navigate('Cart')}
                        iconColor="#3498DB"
                    />
                    <MenuItem
                        icon="heart-outline"
                        label="Wishlist"
                        value={wishlistItems.length > 0 ? wishlistItems.length.toString() : undefined}
                        onPress={() => navigation.navigate('Wishlist')}
                        iconColor="#F06292"
                    />
                    <MenuItem
                        icon="notifications-outline"
                        label="Notifications"
                        hasSwitch
                        switchValue={notificationsEnabled}
                        onSwitchChange={setNotificationsEnabled}
                        iconColor="#9B59B6"
                    />
                    <MenuItem
                        icon="moon-outline"
                        label="Dark Mode"
                        hasSwitch
                        switchValue={isDark}
                        onSwitchChange={toggleTheme}
                        iconColor="#575fcf"
                    />
                    <MenuItem
                        icon="settings-outline"
                        label="Settings"
                        onPress={() => { }}
                        iconColor="#7F8C8D"
                    />
                    <MenuItem
                        icon="log-out-outline"
                        label="Logout"
                        onPress={handleLogout}
                        isLast
                        iconColor="#C0392B"
                    />
                </View>
            </ScrollView>

            {/* Image Picker Modal */}
            <ImagePickerModal
                visible={showPicker}
                onClose={() => setShowPicker(false)}
                onTakePhoto={takePhoto}
                onPickGallery={pickFromGallery}
            />
        </ThemedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        padding: 5,
    },
    logoTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    settingsIcon: {
        padding: 5,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 15,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarPlaceholder: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        marginBottom: 15,
    },
    editProfileButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    editProfileText: {
        fontSize: 13,
        fontWeight: '600',
    },
    menuCard: {
        marginHorizontal: 20,
        borderRadius: 20,
        paddingVertical: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.03)',
    },
    lastMenuItem: {
        borderBottomWidth: 0,
    },
    menuIconContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
    },
    menuValue: {
        fontSize: 14,
        fontWeight: '600',
        marginRight: 10,
    },
    saveEditBtn: {
        flex: 1,
    },
    editForm: {
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    editInput: {
        marginBottom: 12,
    },
    editActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 10,
    },
    cancelEditBtn: {
        flex: 1,
    },
});

export default Profile;
