import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppSelector, useAppDispatch } from '../hooks';
import { logout } from '../store/slices/authSlice';
import { ThemeText, Button, ThemedSafeAreaView } from '../components';
import { useTheme } from '../context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Profile: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const { colors } = useTheme();

    const handleLogout = () => {
        dispatch(logout());
    };

    const InfoRow = ({ icon, label, value }: { icon: string; label: string; value?: string }) => (
        <View style={styles.infoRow}>
            <View style={[styles.iconContainer, { backgroundColor: colors.surface }]}>
                <Ionicons name={icon} size={20} color={colors.primary} />
            </View>
            <View style={styles.infoTextContainer}>
                <ThemeText style={styles.infoLabel}>{label}</ThemeText>
                <ThemeText style={styles.infoValue}>{value || 'Not provided'}</ThemeText>
            </View>
        </View>
    );

    return (
        <ThemedSafeAreaView>
            <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.header}>
                    <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
                        <ThemeText style={styles.avatarText}>
                            {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
                        </ThemeText>
                    </View>
                    <ThemeText style={styles.userName}>{user?.name || 'User'}</ThemeText>
                    <ThemeText style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email}</ThemeText>
                </View>

                <View style={styles.section}>
                    <ThemeText style={styles.sectionTitle}>Account Information</ThemeText>
                    <View style={[styles.card, { backgroundColor: colors.surface }]}>
                        <InfoRow icon="person-outline" label="Full Name" value={user?.name} />
                        <InfoRow icon="mail-outline" label="Email Address" value={user?.email} />
                        <InfoRow icon="call-outline" label="Phone Number" value={user?.phone_number} />
                        <InfoRow icon="calendar-outline" label="Date of Birth" value={user?.dob ? new Date(user.dob).toLocaleDateString() : undefined} />
                        <InfoRow icon="location-outline" label="Location" value={user?.location} />
                    </View>
                </View>

                <View style={styles.footer}>
                    <Button
                        title="Logout"
                        onPress={handleLogout}
                        variant="outline"
                        style={styles.logoutBtn}
                        textStyle={{ color: colors.error }}
                    />
                </View>
            </ScrollView>
        </ThemedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFF',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        marginLeft: 4,
    },
    card: {
        borderRadius: 16,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        opacity: 0.6,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    logoutBtn: {
        borderColor: '#FF3B30',
        borderWidth: 1,
    },
});
