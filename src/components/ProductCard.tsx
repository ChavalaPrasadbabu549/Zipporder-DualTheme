import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import { ProductCardProps } from '../utils/types';
import { formatImageUrl } from '../utils';
import { ThemeText } from './';
import { useTheme } from '../context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppDispatch, useAppSelector } from '../hooks';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation';


export const ProductCard: React.FC<ProductCardProps> = ({ product, width: customWidth, hideWishlistButton }) => {
    const { colors, isDark } = useTheme();
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
    const imageUrl = formatImageUrl(product.images);
    const isInWishlist = wishlistItems.some(wishItem => wishItem.id === product.id);
    const hasDiscount = product.price > product.discount_price;
    const discountPercent = hasDiscount
        ? Math.round(((product.price - product.discount_price) / product.price) * 100)
        : 0;

    return (
        <TouchableOpacity
            style={[styles.container, customWidth ? { width: customWidth } : {}]}
            onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
            activeOpacity={0.9}
        >
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
                <View style={[styles.imageContainer, { backgroundColor: isDark ? '#1A202C' : '#F8FAFC' }]}>
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
                    ) : (
                        <Image
                            source={require('../asssets/placeholder.png')}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    )}

                    {hasDiscount && (
                        <View style={[styles.discountBadge, { backgroundColor: colors.primary }]}>
                            <ThemeText style={[styles.discountText, { color: colors.surface }]}>{discountPercent}% OFF</ThemeText>
                        </View>
                    )}

                    {!hideWishlistButton && (
                        <TouchableOpacity
                            style={[styles.wishlistBtn, { backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : '#FFF' }]}
                            onPress={() => dispatch(toggleWishlist(product))}
                        >
                            <Ionicons
                                name={isInWishlist ? "heart" : "heart-outline"}
                                size={16}
                                color={isInWishlist ? colors.primary : colors.textSecondary}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.infoContainer}>
                    <ThemeText style={[styles.productName, { color: colors.text }]} numberOfLines={1}>
                        {product.name}
                    </ThemeText>

                    <View style={styles.priceContainer}>
                        <View>
                            <ThemeText style={[styles.currentPrice, { color: colors.primary }]}>
                                ₹{product.discount_price}
                            </ThemeText>
                            {hasDiscount && (
                                <ThemeText style={[styles.oldPrice, { color: colors.textSecondary }]}>
                                    ₹{product.price}
                                </ThemeText>
                            )}
                        </View>

                        <TouchableOpacity
                            style={[styles.addBtn, { backgroundColor: colors.primary }]}
                            onPress={(e) => {
                                e.stopPropagation();
                                // Add to cart logic
                            }}
                        >
                            <Ionicons name="add" size={20} color={colors.surface} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    card: {
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    imageContainer: {
        height: 140,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        padding: 10,
        borderRadius: 18,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    discountBadge: {
        position: 'absolute',
        top: 0,
        left: 0,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderBottomRightRadius: 15,
    },
    discountText: {
        fontSize: 10,
        fontWeight: '900',
        fontFamily: 'Inter-Bold',
    },
    wishlistBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    infoContainer: {
        padding: 12,
        paddingTop: 8,
    },
    productName: {
        fontSize: 13,
        fontWeight: 'bold',
        fontFamily: 'Inter-Bold',
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    currentPrice: {
        fontSize: 16,
        fontWeight: '900',
        fontFamily: 'Inter-Bold',
    },
    oldPrice: {
        fontSize: 11,
        textDecorationLine: 'line-through',
        fontFamily: 'Inter-Medium',
        marginTop: 2,
    },
    addBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
});

