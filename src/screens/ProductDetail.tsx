import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation';
import { useAppDispatch, useAppSelector } from '../hooks';
import { addToCart } from '../store/slices/cartSlice';
import { ThemeText, ThemedSafeAreaView } from '../components';
import { useTheme } from '../context';
import { formatImageUrl } from '../utils';
import InputSpinner from 'react-native-input-spinner';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const ProductDetail: React.FC<Props> = ({ route, navigation }) => {
    const { productId } = route.params;
    const dispatch = useAppDispatch();
    const { colors } = useTheme();
    const { products } = useAppSelector((state) => state.catalog);
    const { user } = useAppSelector((state) => state.auth);
    const { loading: cartLoading } = useAppSelector((state) => state.cart);
    const [quantity, setQuantity] = useState(1);
    const product = products.find(p => p.id === productId);

    if (!product) {
        return (
            <ThemedSafeAreaView style={styles.center}>
                <ThemeText>Product not found</ThemeText>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ThemeText style={{ color: colors.primary, marginTop: 10 }}>Go Back</ThemeText>
                </TouchableOpacity>
            </ThemedSafeAreaView>
        );
    }

    const imageUrl = formatImageUrl(product.images);

    const handleAddToCart = () => {
        if (!user) {
            Alert.alert('Login Required', 'Please login to add items to cart');
            return;
        }

        dispatch(addToCart({
            productId: product.id,
            quantity: quantity
        }))
            .unwrap()
            .then(() => {
                Alert.alert('Success', 'Product added to cart!');
            })
            .catch((err) => {
                Alert.alert('Error', err || 'Failed to add to cart');
            });
    };

    return (
        <ThemedSafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <ThemeText style={styles.headerTitle}>Product Details</ThemeText>
                <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.backButton}>
                    <Ionicons name="cart-outline" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.imageContainer, { backgroundColor: colors.surface }]}>
                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    ) : (
                        <Ionicons name="image-outline" size={100} color={colors.textSecondary} />
                    )}
                </View>

                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <ThemeText style={styles.title}>{product.name}</ThemeText>
                        <View style={styles.badge}>
                            <ThemeText style={styles.badgeText}>Fresh</ThemeText>
                        </View>
                    </View>

                    <ThemeText style={[styles.category, { color: colors.textSecondary }]}>
                        {product.category?.name} • {product.subcategory?.name}
                    </ThemeText>

                    <View style={styles.priceRow}>
                        <View>
                            <ThemeText style={styles.price}>₹{product.discount_price}</ThemeText>
                            {product.price > product.discount_price && (
                                <ThemeText style={styles.oldPrice}>₹{product.price}</ThemeText>
                            )}
                        </View>
                        {product.price > product.discount_price && (
                            <View style={styles.discountBadge}>
                                <ThemeText style={styles.discountText}>
                                    {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                                </ThemeText>
                            </View>
                        )}
                    </View>

                    <View style={styles.divider} />

                    <ThemeText style={styles.sectionTitle}>Description</ThemeText>
                    <ThemeText style={[styles.description, { color: colors.textSecondary }]}>
                        {product.description || 'No description available for this delicious item. Rest assured it is made with the finest ingredients and lots of love!'}
                    </ThemeText>

                    <View style={styles.divider} />

                    <View style={styles.quantityRow}>
                        <ThemeText style={styles.sectionTitle}>Quantity</ThemeText>
                        <InputSpinner
                            max={product.quantity || 10}
                            min={1}
                            step={1}
                            colorMax={colors.error}
                            colorMin={colors.primary}
                            value={quantity}
                            onChange={(num: number) => setQuantity(num)}
                            skin="round"
                            style={styles.spinner}
                            buttonStyle={{ backgroundColor: colors.primary }}
                        />
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <View style={styles.totalRow}>
                    <ThemeText style={styles.totalLabel}>Grand Total</ThemeText>
                    <ThemeText style={styles.totalAmount}>₹{product.discount_price * quantity}</ThemeText>
                </View>
                <TouchableOpacity
                    style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
                    onPress={handleAddToCart}
                    disabled={cartLoading}
                >
                    {cartLoading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <Ionicons name="cart" size={20} color="#FFF" style={{ marginRight: 10 }} />
                            <ThemeText style={styles.addToCartText}>Add to Cart</ThemeText>
                        </>
                    )}
                </TouchableOpacity>
            </View>
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
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        padding: 5,
    },
    imageContainer: {
        width: width,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        padding: 20,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
    },
    badge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        marginLeft: 10,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    category: {
        fontSize: 14,
        marginTop: 5,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FF004D',
    },
    oldPrice: {
        fontSize: 14,
        textDecorationLine: 'line-through',
        opacity: 0.5,
        marginLeft: 5,
    },
    discountBadge: {
        backgroundColor: 'rgba(255, 0, 77, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
        marginLeft: 15,
    },
    discountText: {
        color: '#FF004D',
        fontSize: 12,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        lineHeight: 22,
    },
    quantityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    spinner: {
        width: 120,
        height: 40,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    totalLabel: {
        fontSize: 14,
        opacity: 0.7,
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    addToCartButton: {
        flexDirection: 'row',
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    addToCartText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProductDetail;
