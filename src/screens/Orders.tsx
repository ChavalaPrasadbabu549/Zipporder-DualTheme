import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeText, ThemedSafeAreaView, SegmentedTabs, Header } from '../components';
import { useTheme } from '../context';
import { ORDERS, formatCurrency } from '../utils/helpers';
import { RootStackParamList } from '../navigation/navigation';

const { width } = Dimensions.get('window');
const StatusConfig = {
    preparing: { label: 'Preparing', color: '#F59E0B', icon: 'restaurant-outline' },
    on_the_way: { label: 'On the Way', color: '#10B981', icon: 'bicycle-outline' },
    delivered: { label: 'Delivered', color: '#3B82F6', icon: 'checkmark-circle-outline' },
    cancelled: { label: 'Cancelled', color: '#EF4444', icon: 'close-circle-outline' },
};

export const Orders: React.FC = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [activeTab, setActiveTab] = useState<'ongoing' | 'history'>('ongoing');

    const filteredOrders = ORDERS.filter(order => {
        if (activeTab === 'ongoing') {
            return order.status === 'preparing' || order.status === 'on_the_way';
        }
        return order.status === 'delivered' || order.status === 'cancelled';
    });

    const renderOrderItem = ({ item: order }: { item: any }) => {
        const config = StatusConfig[order.status as keyof typeof StatusConfig];

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.orderCard, { backgroundColor: colors.surface }]}
                onPress={() => {/* Navigate to Order Detail if available */ }}
            >
                <View style={styles.cardHeader}>
                    <View>
                        <ThemeText style={styles.orderNumber}>{order.orderNumber}</ThemeText>
                        <ThemeText style={styles.orderDate}>{order.date}</ThemeText>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: config.color + '15' }]}>
                        <Ionicons name={config.icon} size={14} color={config.color} />
                        <ThemeText style={[styles.statusText, { color: config.color }]}>
                            {config.label}
                        </ThemeText>
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <FlatList
                        data={order.items}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.itemImageContainer}>
                                <Image source={{ uri: item.image }} style={styles.itemImage} />
                                <View style={styles.itemQuantityBadge}>
                                    <ThemeText style={styles.itemQuantityText}>{item.quantity}</ThemeText>
                                </View>
                            </View>
                        )}
                    />
                    <View style={styles.orderDetails}>
                        <ThemeText style={styles.itemCountText}>
                            {order.items.length} {order.items.length > 1 ? 'items' : 'item'}
                        </ThemeText>
                        <ThemeText style={[styles.totalAmount, { color: colors.primary }]}>
                            {formatCurrency(order.totalAmount)}
                        </ThemeText>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <View style={styles.addressRow}>
                        <Ionicons name="location-outline" size={14} color={colors.text + '80'} />
                        <ThemeText style={styles.addressText} numberOfLines={1}>
                            {order.deliveryAddress}
                        </ThemeText>
                    </View>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.primary }]}
                        onPress={() => navigation.navigate('TrackOrder', { orderId: order.id })}
                    >
                        <ThemeText style={styles.actionButtonText}>
                            {order.status === 'delivered' ? 'Reorder' : 'Track Order'}
                        </ThemeText>
                        <Ionicons name="chevron-forward" size={16} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ThemedSafeAreaView style={styles.container}>
            <Header title="My Orders" />

            {/* Premium Tabs */}
            <SegmentedTabs
                activeTab={activeTab}
                onTabChange={(val: string) => setActiveTab(val as 'ongoing' | 'history')}
                options={[
                    { label: 'Ongoing', value: 'ongoing' },
                    { label: 'History', value: 'history' },
                ]}
            />

            <FlatList
                data={filteredOrders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="receipt-outline" size={80} color={colors.text + '20'} />
                        <ThemeText style={styles.emptyText}>No orders to show</ThemeText>
                        <TouchableOpacity
                            style={[styles.exploreButton, { borderColor: colors.primary }]}
                            onPress={() => navigation.navigate('Home' as any)}
                        >
                            <ThemeText style={{ color: colors.primary }}>Explore Menu</ThemeText>
                        </TouchableOpacity>
                    </View>
                }
            />
        </ThemedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    orderCard: {
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        paddingBottom: 12,
        marginBottom: 12,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderDate: {
        fontSize: 12,
        opacity: 0.6,
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardBody: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemImageContainer: {
        marginRight: 10,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F3F4F6',
    },
    itemQuantityBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#333',
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    itemQuantityText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    orderDetails: {
        flex: 1,
        alignItems: 'flex-end',
    },
    itemCountText: {
        fontSize: 12,
        opacity: 0.6,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 2,
    },
    cardFooter: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
        gap: 4,
    },
    addressText: {
        fontSize: 12,
        opacity: 0.7,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 4,
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 18,
        opacity: 0.5,
        marginTop: 10,
        marginBottom: 20,
    },
    exploreButton: {
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
});
