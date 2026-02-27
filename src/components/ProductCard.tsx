import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { Product } from '../utils/types';
import { formatImageUrl } from '../utils';
import { ThemeText, Card } from './';
import { useTheme } from '../context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppDispatch, useAppSelector } from '../hooks';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation';

const { width } = Dimensions.get('window');

interface ProductCardProps {
    product: Product;
    width?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, width: customWidth }) => {
    const { colors } = useTheme();
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

    const imageUrl = formatImageUrl(product.images);
    const isInWishlist = wishlistItems.some(wishItem => wishItem.id === product.id);

    return (
        <TouchableOpacity
            style={[styles.productCard, customWidth ? { width: customWidth } : {}]}
            onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
        >
            <Card style={styles.productCardInner}>
                <View style={styles.productImageWrapper}>
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.productImage} resizeMode="contain" />
                    ) : (
                        <View style={[styles.productImage, { backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' }]}>
                            <Ionicons name="cube-outline" size={30} color={colors.textSecondary} />
                        </View>
                    )}
                    <TouchableOpacity
                        style={styles.wishlistButton}
                        onPress={() => dispatch(toggleWishlist(product))}
                    >
                        <Ionicons
                            name={isInWishlist ? "heart" : "heart-outline"}
                            size={16}
                            color={colors.primary}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.productContent}>
                    <ThemeText style={styles.productName} numberOfLines={1}>{product.name}</ThemeText>
                    <View style={styles.priceRow}>
                        <ThemeText style={[styles.productPrice, { color: colors.text }]}>₹{product.discount_price}</ThemeText>
                        <TouchableOpacity
                            style={[styles.addToCartSmall, { backgroundColor: colors.primary }]}
                            onPress={() => {
                                // Add to cart logic can be added here or passed via props
                            }}
                        >
                            <Ionicons name="cart-outline" size={14} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );
};

const SIDEBAR_WIDTH = 90;

const styles = StyleSheet.create({
    productCard: {
        width: (width - SIDEBAR_WIDTH - 32 - 12) / 2,
        marginBottom: 12,
    },
    productCardInner: {
        padding: 0,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowOpacity: 0.05,
    },
    productImageWrapper: {
        height: 110,
        backgroundColor: '#F9F9F9',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    productImage: {
        width: '80%',
        height: '80%',
    },
    wishlistButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#FFF',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    productContent: {
        padding: 10,
    },
    productName: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 14,
        fontWeight: '700',
    },
    addToCartSmall: {
        width: 24,
        height: 24,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
