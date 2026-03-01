import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ActivityIndicator,
    Alert,
    SafeAreaView,
    StatusBar,
    Platform,
    ToastAndroid
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation';
import { useAppDispatch, useAppSelector } from '../hooks';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { ThemeText, ThemedSafeAreaView } from '../components';
import { useTheme } from '../context';
import { formatImageUrl } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;
export const ProductDetail: React.FC<Props> = ({ route, navigation }) => {
    const { productId } = route.params;
    const dispatch = useAppDispatch();
    const { colors, isDark } = useTheme();
    const { products } = useAppSelector((state) => state.catalog);
    const { user } = useAppSelector((state) => state.auth);
    const { loading: cartLoading } = useAppSelector((state) => state.cart);
    const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('500g');
    const [isDetailsOpen, setIsDetailsOpen] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

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
    const images = imageUrl ? [imageUrl, imageUrl, imageUrl, imageUrl] : [];
    const isInWishlist = wishlistItems.some(i => i.id === product.id);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slide = Math.ceil(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
        if (slide !== activeImageIndex) {
            setActiveImageIndex(slide);
        }
    };

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
            .then((res) => {
                if (Platform.OS === 'android') {
                    ToastAndroid.show(res.message || 'Item added to cart', ToastAndroid.SHORT);
                }
            })
            .catch((err) => {
                if (Platform.OS === 'android') {
                    ToastAndroid.show(err.message || 'Failed to add item', ToastAndroid.SHORT);
                }
            });
    };

    const sizes = ['500g', '1 Kg', '2 Kg'];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Immersive Header Image */}
                <View style={styles.imageContainer}>
                    {images.length > 0 ? (
                        <FlatList
                            data={images}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScroll={handleScroll}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item }) => (
                                <Image
                                    source={{ uri: item }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                            )}
                        />
                    ) : (
                        <View style={[styles.image, { backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' }]}>
                            <Ionicons name="image-outline" size={100} color={colors.textSecondary} />
                        </View>
                    )}

                    {/* Overlay Navbar */}
                    <SafeAreaView style={[styles.overlayNav, { paddingTop: 50 }]}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.navButton}
                        >
                            <Ionicons name="chevron-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => dispatch(toggleWishlist(product))}
                            style={styles.navButton}
                        >
                            <Ionicons
                                name={isInWishlist ? "heart" : "heart-outline"}
                                size={22}
                                color={isInWishlist ? colors.primary : "#FFF"}
                            />
                        </TouchableOpacity>
                    </SafeAreaView>

                    {/* Image Pagination Dots Overlay */}
                    <View style={styles.paginationContainer}>
                        {images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    activeImageIndex === index && styles.activeDot
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Main Content Card */}
                <View style={[styles.contentCard, { backgroundColor: colors.background }]}>
                    <View style={styles.mainInfo}>
                        <ThemeText style={styles.title}>{product.name}</ThemeText>

                        {/* Rating Row */}
                        <View style={styles.ratingContainer}>
                            <View style={styles.starsRow}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Ionicons key={s} name="star" size={14} color="#FFB800" />
                                ))}
                            </View>
                            <ThemeText style={styles.ratingText}>
                                4.8 <ThemeText style={{ color: colors.textSecondary }}>223 Reviews</ThemeText>
                            </ThemeText>
                        </View>

                        {/* Price Row */}
                        <View style={styles.priceContainer}>
                            <ThemeText style={styles.priceLarge}>₹{product.discount_price}</ThemeText>
                            {product.price > product.discount_price && (
                                <ThemeText style={[styles.oldPrice, { color: colors.textSecondary }]}>₹{product.price}</ThemeText>
                            )}
                        </View>
                        <ThemeText style={[styles.taxInfo, { color: colors.textSecondary }]}>Inclusive of all taxes</ThemeText>

                        {/* Size Selection */}
                        <View style={styles.sizeSection}>
                            {sizes.map((size) => (
                                <TouchableOpacity
                                    key={size}
                                    style={[
                                        styles.sizeChip,
                                        {
                                            backgroundColor: selectedSize === size ? colors.primary : colors.surface,
                                            borderColor: selectedSize === size ? colors.primary : colors.border
                                        }
                                    ]}
                                    onPress={() => setSelectedSize(size)}
                                >
                                    <ThemeText style={[
                                        styles.sizeText,
                                        { color: selectedSize === size ? '#FFF' : colors.text }
                                    ]}>
                                        {size}
                                    </ThemeText>
                                    {selectedSize === size && size.includes('1 Kg') && (
                                        <Ionicons name="chevron-down" size={12} color="#FFF" style={{ marginLeft: 4 }} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <ThemeText style={[styles.description, { color: colors.textSecondary }]}>
                            {product.description || 'Rich chocolate sponge layered with creamy chocolate ganache. Perfect for birthdays and celebrations.'}
                        </ThemeText>

                        {/* Buy/Cart Buttons Boxed */}
                        <View style={styles.actionButtonsRow}>
                            <TouchableOpacity
                                style={[styles.outlineButton, { borderColor: colors.primary }]}
                                onPress={handleAddToCart}
                            >
                                <Ionicons name="cart-outline" size={20} color={colors.primary} />
                                <ThemeText style={[styles.outlineButtonText, { color: colors.primary }]}>Add to Cart</ThemeText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                                onPress={() => { }}
                            >
                                <Ionicons name="flash-outline" size={20} color="#FFF" />
                                <ThemeText style={styles.primaryButtonText}>Buy Now</ThemeText>
                            </TouchableOpacity>
                        </View>

                        {/* Product Details Section Wrapper */}
                        <View style={[styles.sectionWrapper, { borderTopColor: colors.border }]}>
                            <TouchableOpacity
                                style={styles.sectionHeader}
                                onPress={() => setIsDetailsOpen(!isDetailsOpen)}
                            >
                                <ThemeText style={styles.sectionTitle}>Product Details</ThemeText>
                                <Ionicons
                                    name={isDetailsOpen ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>

                            {isDetailsOpen && (
                                <View style={[styles.detailsBox, { backgroundColor: colors.surface }]}>
                                    <View style={styles.detailItem}>
                                        <ThemeText style={styles.detailLabel}>Flavor:</ThemeText>
                                        <ThemeText style={[styles.detailValue, { color: colors.textSecondary }]}>Chocolate, Truffle, Cake</ThemeText>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <ThemeText style={styles.detailLabel}>Frosting:</ThemeText>
                                        <ThemeText style={[styles.detailValue, { color: colors.textSecondary }]}>Chocolate</ThemeText>
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Subheader Review Style */}
                        <View style={[styles.sectionWrapper, { borderTopColor: colors.border, marginTop: 10 }]}>
                            <TouchableOpacity style={styles.sectionHeader}>
                                <ThemeText style={styles.sectionTitle}>Setup Details</ThemeText>
                                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Reviews Section Placeholder matching image */}
                        {/* <View style={styles.reviewSnippet}>
                            <View style={styles.reviewerHeader}>
                                <Image
                                    source={{ uri: 'https://i.pravatar.cc/100?u=abhishek' }}
                                    style={styles.reviewAvatar}
                                />
                                <View style={styles.reviewerInfo}>
                                    <View style={styles.reviewerNameRow}>
                                        <ThemeText style={styles.reviewerName}>Abhishek</ThemeText>
                                        <View style={styles.verifiedBadge}>
                                            <Ionicons name="checkmark-circle" size={12} color="#FFF" />
                                            <ThemeText style={styles.verifiedText}>VERIFIED</ThemeText>
                                        </View>
                                    </View>
                                    <ThemeText style={[styles.reviewStats, { color: colors.textSecondary }]}>38 Recipes</ThemeText>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                            </View>
                            <View style={styles.reviewStarsRow}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Ionicons key={s} name="star" size={12} color="#FFB800" />
                                ))}
                                <ThemeText style={[styles.reviewDate, { color: colors.textSecondary }]}>• 09 at 2023</ThemeText>
                            </View>
                            <ThemeText style={[styles.reviewText, { color: colors.textSecondary }]}>
                                Very fresh and healthy. Perfect for my breakfast!
                            </ThemeText>
                        </View> */}
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Bottom Footer */}
            <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                <View style={styles.footerPriceContainer}>
                    <View style={styles.footerPriceRow}>
                        <View style={[styles.footerDot, { backgroundColor: colors.primary }]} />
                        <ThemeText style={styles.footerPrice}>599</ThemeText>
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.footerButton, { backgroundColor: colors.primary }]}
                    onPress={() => { }}
                >
                    <ThemeText style={styles.footerButtonText}>Buy Now</ThemeText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    imageContainer: {
        width: width,
        height: 380,
        position: 'relative',
    },
    image: {
        width: width,
        height: '100%',
    },
    overlayNav: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    navButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    activeDot: {
        width: 12,
        backgroundColor: '#FFF',
    },
    contentCard: {
        marginTop: -20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingTop: 20,
        minHeight: 500,
    },
    mainInfo: {
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    starsRow: {
        flexDirection: 'row',
        marginRight: 8,
    },
    ratingText: {
        fontSize: 13,
        fontWeight: '600',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    priceLarge: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    oldPrice: {
        fontSize: 16,
        textDecorationLine: 'line-through',
    },
    taxInfo: {
        fontSize: 12,
        marginBottom: 16,
    },
    sizeSection: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    sizeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
    },
    sizeText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 24,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    outlineButton: {
        flex: 1,
        flexDirection: 'row',
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    outlineButtonText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    primaryButton: {
        flex: 1,
        flexDirection: 'row',
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    primaryButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    sectionWrapper: {
        borderTopWidth: 1,
        paddingTop: 15,
        paddingBottom: 5,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    detailsBox: {
        padding: 15,
        borderRadius: 12,
        gap: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        width: 80,
    },
    detailValue: {
        fontSize: 14,
        flex: 1,
    },
    reviewSnippet: {
        marginTop: 20,
        paddingBottom: 20,
    },
    reviewerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    reviewerInfo: {
        flex: 1,
    },
    reviewerNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    reviewerName: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3B82F6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 2,
    },
    verifiedText: {
        color: '#FFF',
        fontSize: 8,
        fontWeight: 'bold',
    },
    reviewStats: {
        fontSize: 12,
    },
    reviewStarsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 4,
    },
    reviewDate: {
        fontSize: 11,
        marginLeft: 4,
    },
    reviewText: {
        fontSize: 13,
        lineHeight: 18,
        marginTop: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 90,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 10,
        borderTopWidth: 1,
    },
    footerPriceContainer: {
        flex: 1,
    },
    footerPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    footerDot: {
        width: 24,
        height: 12,
        borderRadius: 6,
        opacity: 0.2,
    },
    footerPrice: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    footerButton: {
        height: 50,
        paddingHorizontal: 35,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default ProductDetail;
