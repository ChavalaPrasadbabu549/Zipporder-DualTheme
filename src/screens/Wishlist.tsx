import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../hooks';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { ThemeText, ThemedSafeAreaView, Card } from '../components';
import { useTheme } from '../context';
import { Product } from '../utils/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { formatImageUrl } from '../utils';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation';

const { width } = Dimensions.get('window');

export const WishlistScreen: React.FC = () => {
    const { items } = useAppSelector((state) => state.wishlist);
    const dispatch = useAppDispatch();
    const { colors } = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const renderItem = ({ item }: { item: Product }) => {
        const imageUrl = formatImageUrl(item.images);
        return (
            <Card style={styles.card}>
                <TouchableOpacity
                    style={styles.content}
                    onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                >
                    <View style={[styles.imageContainer, { backgroundColor: colors.surface }]}>
                        {imageUrl ? (
                            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
                        ) : (
                            <Ionicons name="cube-outline" size={30} color={colors.textSecondary} />
                        )}
                    </View>
                    <View style={styles.info}>
                        <ThemeText style={styles.name} numberOfLines={1}>{item.name}</ThemeText>
                        <ThemeText style={[styles.price, { color: colors.primary }]}>₹{item.discount_price}</ThemeText>
                        {item.price > item.discount_price && (
                            <ThemeText style={styles.originalPrice}>₹{item.price}</ThemeText>
                        )}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => dispatch(toggleWishlist(item))}
                >
                    <Ionicons name="trash-outline" size={20} color={colors.error || '#FF3B30'} />
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <ThemedSafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <ThemeText style={styles.headerTitle}>My Wishlist</ThemeText>
                <View style={{ width: 40 }} />
            </View>

            {items.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={[styles.emptyIconContainer, { backgroundColor: colors.primary + '10' }]}>
                        <Ionicons name="heart-outline" size={60} color={colors.primary} />
                    </View>
                    <ThemeText style={styles.emptyTitle}>Your Wishlist is Empty</ThemeText>
                    <ThemeText style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                        Tap the heart icon on any product to save it for later.
                    </ThemeText>
                    <TouchableOpacity
                        style={[styles.startShoppingBtn, { backgroundColor: colors.primary }]}
                        onPress={() => navigation.navigate('Main' as any)}
                    >
                        <ThemeText style={styles.startShoppingText}>Start Shopping</ThemeText>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
        paddingVertical: 15,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    listContent: {
        padding: 15,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 12,
        borderRadius: 15,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: {
        width: 70,
        height: 70,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        overflow: 'hidden',
    },
    image: {
        width: '80%',
        height: '80%',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
    },
    originalPrice: {
        fontSize: 12,
        textDecorationLine: 'line-through',
        opacity: 0.5,
        marginTop: 2,
    },
    removeButton: {
        padding: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
    },
    startShoppingBtn: {
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    startShoppingText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default WishlistScreen;
