import React, { useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchCart, addToCart, removeFromCart } from '../store/slices/cartSlice';
import { ThemeText, ThemedSafeAreaView } from '../components';
import { useTheme } from '../context';
import { formatImageUrl } from '../utils';
import InputSpinner from 'react-native-input-spinner';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation';


const CartScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useAppDispatch();
    const { items, loading, error } = useAppSelector((state) => state.cart);
    const { user } = useAppSelector((state) => state.auth);
    const { products } = useAppSelector((state) => state.catalog);
    const { colors } = useTheme();

    const enrichedItems = React.useMemo(() => {
        if (!Array.isArray(items)) return [];
        return items.map(item => {
            const product = item.product || products.find(p => p.id === (item as any).product_id);
            return {
                ...item,
                product
            };
        });
    }, [items, products]);



    const onRefresh = React.useCallback(() => {
        if (user) {
            dispatch(fetchCart());
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (user) {
            dispatch(fetchCart())
                .unwrap()
                .catch((err) => {
                    console.error('Fetch Cart Error:', err);

                });
        }
    }, [dispatch, user]);

    const handleUpdateQuantity = (productId: number, quantity: number) => {
        if (!user) return;
        dispatch(addToCart({
            productId,
            quantity
        }))
            .unwrap()
            .catch((err) => {
                Alert.alert('Update Failed', err || 'Failed to update quantity');
            });
    };

    const handleRemoveItem = (productId: number) => {
        dispatch(removeFromCart(productId))
            .unwrap()
            .catch((err) => {
                Alert.alert('Remove Failed', err || 'Failed to remove item');
            });
    };

    const calculateTotal = () => {
        return enrichedItems.reduce((total, item) => {
            const price = item.product?.discount_price || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    const renderCartItem = ({ item }: { item: any }) => {
        if (!item.product) return null;
        const imageUrl = formatImageUrl(item.product.images);
        return (
            <View style={[styles.cartItem, { backgroundColor: colors.surface }]}>
                <Image
                    source={imageUrl ? { uri: imageUrl } : require('../asssets/placeholder.png')}
                    style={styles.itemImage}
                />
                <View style={styles.itemInfo}>
                    <ThemeText style={styles.itemName}>{item.product.name}</ThemeText>
                    <ThemeText style={styles.itemPrice}>₹{item.product.discount_price}</ThemeText>
                    <View style={styles.quantityContainer}>
                        <InputSpinner
                            max={10}
                            min={1}
                            step={1}
                            colorMax={colors.error}
                            colorMin={colors.primary}
                            value={item.quantity}
                            onChange={(num: number) => handleUpdateQuantity(item.product.id, num)}
                            skin="round"
                            buttonStyle={{ backgroundColor: colors.primary, width: 20, height: 20 }}
                            height={20}
                            width={90}
                            fontSize={12}
                            buttonFontSize={12}
                            // skin="square"
                            buttonTextColor="#fff"
                            style={{
                                borderWidth: 1,
                                // borderColor: isDark ? '#FFFFFF1A' : '#D9D9D9',
                                borderRadius: 6,
                                backgroundColor: 'transparent',
                                justifyContent: 'center',
                                alignItems: 'center',
                                boxShadow: 'none',
                            }}
                            inputStyle={{
                                height: 20,
                                paddingVertical: 0,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                lineHeight: 20,
                                color: '#000',
                            } as any}
                        // buttonStyle={{
                        //     width: 30,
                        //     backgroundColor: 'transparent',
                        //     justifyContent: 'center',
                        //     alignItems: 'center',
                        // }}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveItem(item.product.id)}
                >
                    <Ionicons name="trash-outline" size={20} color={colors.error} />
                </TouchableOpacity>
            </View>
        );
    };

    if (loading && items.length === 0) {
        return (
            <ThemedSafeAreaView style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary} />
            </ThemedSafeAreaView>
        );
    }

    console.log('🛒 CART SCREEN DATA:', {
        redux_itemsCount: items?.length,
        enrichedItemsCount: enrichedItems?.length,
        items: JSON.stringify(items),
        catalogProductCount: products?.length
    });


    return (
        <ThemedSafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <ThemeText style={styles.title}>Your Cart</ThemeText>
                <View style={{ width: 24 }} />
            </View>

            {(!items || items.length === 0) ? (
                <ScrollView
                    contentContainerStyle={[styles.center, { flex: 1 }]}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={onRefresh}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                        />
                    }
                >
                    <Ionicons name="cart-outline" size={80} color={colors.border} />
                    <ThemeText style={styles.emptyText}>
                        {error ? `Error: ${error}` : 'Your cart is empty'}
                    </ThemeText>
                    {!error && (
                        <TouchableOpacity
                            style={[styles.shopButton, { backgroundColor: colors.primary }]}
                            onPress={() => navigation.navigate('Main')}
                        >
                            <ThemeText style={styles.shopButtonText}>Shop Now</ThemeText>
                        </TouchableOpacity>
                    )}
                    {error && (
                        <TouchableOpacity
                            style={[styles.shopButton, { backgroundColor: colors.primary }]}
                            onPress={() => dispatch(fetchCart())}
                        >
                            <ThemeText style={styles.shopButtonText}>Try Again</ThemeText>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            ) : (
                <>
                    <FlatList
                        data={enrichedItems}
                        renderItem={renderCartItem}
                        keyExtractor={(item) => (item.id || item.product_id).toString()}
                        contentContainerStyle={styles.listContent}
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={onRefresh}
                                colors={[colors.primary]}
                                tintColor={colors.primary}
                            />
                        }
                    />
                    <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                        <View style={styles.totalRow}>
                            <ThemeText style={styles.totalLabel}>Total Amount:</ThemeText>
                            <ThemeText style={styles.totalPrice}>₹{calculateTotal()}</ThemeText>
                        </View>
                        <TouchableOpacity
                            style={[styles.checkoutButton, { backgroundColor: colors.primary }]}
                            onPress={() => Alert.alert('Checkout', 'Proceed to checkout?')}
                        >
                            <ThemeText style={styles.checkoutText}>Proceed to Checkout</ThemeText>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </ThemedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15 },
    backButton: { padding: 5 },
    title: { fontSize: 20, fontWeight: 'bold' },
    listContent: { padding: 15 },
    cartItem: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    itemImage: { width: 80, height: 80, borderRadius: 10 },
    itemInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
    itemName: { fontSize: 16, fontWeight: 'bold' },
    itemPrice: { fontSize: 14, color: '#FF004D', fontWeight: 'bold', marginVertical: 4 },
    quantityContainer: { marginTop: 5 },
    spinner: { width: 100, height: 35 },
    removeButton: { padding: 5, justifyContent: 'center' },
    footer: { padding: 20, borderTopWidth: 1 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    totalLabel: { fontSize: 16, opacity: 0.8 },
    totalPrice: { fontSize: 20, fontWeight: 'bold' },
    checkoutButton: { height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    checkoutText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 18, color: '#999', marginTop: 10 },
    shopButton: { marginTop: 20, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
    shopButtonText: { color: '#FFF', fontWeight: 'bold' }
});

export default CartScreen;
