import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeText, ThemedSafeAreaView, Header } from '../components';
import { useTheme } from '../context';
import { RootStackParamList } from '../navigation/navigation';
import { ORDERS, formatCurrency } from '../utils/helpers';

const { width } = Dimensions.get('window');

const TRACKING_STEPS = [
    { key: 'confirmed', title: 'Order Confirmed', time: '10:30 AM', icon: 'checkmark-circle', completed: true },
    { key: 'preparing', title: 'Preparing Food', time: '10:45 AM', icon: 'restaurant', completed: true },
    { key: 'on_the_way', title: 'On the Way', time: '11:00 AM', icon: 'bicycle', completed: true, active: true },
    { key: 'arriving', title: 'Arriving Soon', time: 'Estimated 11:15 AM', icon: 'location', completed: false },
];

export const TrackOrder: React.FC = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'TrackOrder'>>();
    const orderId = route.params?.orderId;

    const order = ORDERS.find(o => o.id === orderId) || ORDERS[0];

    return (
        <ThemedSafeAreaView style={styles.container}>
            <Header
                title="Track Order"
                subtitle={order.orderNumber}
                rightComponent={
                    <TouchableOpacity style={styles.helpButton}>
                        <Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.primary} />
                    </TouchableOpacity>
                }
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Visual Status Card */}
                <View style={[styles.statusCard, { backgroundColor: colors.primary }]}>
                    <View style={styles.statusInfo}>
                        <ThemeText style={styles.statusLabel}>Estimated Delivery</ThemeText>
                        <ThemeText style={styles.statusTime}>11:15 AM</ThemeText>
                    </View>
                    <View style={styles.statusIconContainer}>
                        <Ionicons name="bicycle" size={60} color="#FFF" style={styles.floatingIcon} />
                    </View>
                </View>

                {/* Vertical Timeline */}
                <View style={[styles.timelineContainer, { backgroundColor: colors.surface }]}>
                    <ThemeText style={styles.sectionTitle}>Delivery Status</ThemeText>
                    {TRACKING_STEPS.map((step, index) => (
                        <View key={step.key} style={styles.stepRow}>
                            <View style={styles.stepLeft}>
                                <View style={[
                                    styles.stepIconContainer,
                                    { backgroundColor: step.completed ? colors.primary : colors.text + '10' }
                                ]}>
                                    <Ionicons
                                        name={step.icon}
                                        size={18}
                                        color={step.completed ? '#FFF' : colors.text + '40'}
                                    />
                                </View>
                                {index !== TRACKING_STEPS.length - 1 && (
                                    <View style={[
                                        styles.stepLine,
                                        { backgroundColor: step.completed ? colors.primary : colors.text + '10' }
                                    ]} />
                                )}
                            </View>
                            <View style={styles.stepRight}>
                                <ThemeText style={[
                                    styles.stepTitle,
                                    step.active && { color: colors.primary, fontWeight: '900' }
                                ]}>
                                    {step.title}
                                </ThemeText>
                                <ThemeText style={styles.stepTime}>{step.time}</ThemeText>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Delivery Person Card */}
                <View style={[styles.deliveryCard, { backgroundColor: colors.surface }]}>
                    <View style={styles.driverInfo}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200' }}
                            style={styles.driverAvatar}
                        />
                        <View style={styles.driverText}>
                            <ThemeText style={styles.driverName}>John Doe</ThemeText>
                            <ThemeText style={styles.driverRole}>Your Delivery Hero</ThemeText>
                        </View>
                    </View>
                    <View style={styles.driverActions}>
                        <TouchableOpacity style={[styles.driverButton, { backgroundColor: colors.primary + '15' }]}>
                            <Ionicons name="call" size={20} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.driverButton, { backgroundColor: colors.primary + '15' }]}>
                            <Ionicons name="mail" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Order Summary Preview */}
                <View style={[styles.orderSummary, { backgroundColor: colors.surface }]}>
                    <View style={styles.summaryHeader}>
                        <ThemeText style={styles.summaryTitle}>Order Summary</ThemeText>
                        <ThemeText style={styles.itemCount}>{order.items.length} items</ThemeText>
                    </View>
                    <View style={styles.summaryFooter}>
                        <ThemeText style={styles.totalLabel}>Total Paid</ThemeText>
                        <ThemeText style={[styles.totalValue, { color: colors.primary }]}>{formatCurrency(order.totalAmount)}</ThemeText>
                    </View>
                </View>

            </ScrollView>

            {/* Bottom Floating Action */}
            <View style={[styles.bottomBar, { backgroundColor: colors.surface }]}>
                <TouchableOpacity style={[styles.trackLiveButton, { backgroundColor: colors.primary }]}>
                    <ThemeText style={styles.trackLiveText}>View Live Map</ThemeText>
                    <Ionicons name="map" size={18} color="#FFF" />
                </TouchableOpacity>
            </View>
        </ThemedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    helpButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    statusCard: {
        borderRadius: 30,
        padding: 30,
        height: 160,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    statusInfo: {
        flex: 1,
    },
    statusLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 5,
    },
    statusTime: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: '900',
    },
    statusIconContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatingIcon: {
        transform: [{ rotate: '-10deg' }],
    },
    timelineContainer: {
        borderRadius: 25,
        padding: 25,
        marginBottom: 20,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 25,
    },
    stepRow: {
        flexDirection: 'row',
        height: 70,
    },
    stepLeft: {
        alignItems: 'center',
        marginRight: 15,
    },
    stepIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    stepLine: {
        width: 2,
        flex: 1,
        marginVertical: 4,
    },
    stepRight: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 5,
    },
    stepTitle: {
        fontSize: 15,
        fontWeight: '600',
        opacity: 0.9,
    },
    stepTime: {
        fontSize: 12,
        opacity: 0.5,
        marginTop: 2,
    },
    deliveryCard: {
        borderRadius: 25,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 2,
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    driverAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    driverText: {
        justifyContent: 'center',
    },
    driverName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    driverRole: {
        fontSize: 12,
        opacity: 0.5,
    },
    driverActions: {
        flexDirection: 'row',
        gap: 10,
    },
    driverButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderSummary: {
        borderRadius: 25,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        paddingBottom: 15,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemCount: {
        fontSize: 14,
        opacity: 0.5,
    },
    summaryFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 14,
        opacity: 0.7,
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '900',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 20,
        paddingBottom: 30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    trackLiveButton: {
        height: 56,
        borderRadius: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    trackLiveText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
