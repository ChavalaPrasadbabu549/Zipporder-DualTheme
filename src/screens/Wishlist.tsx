import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../hooks';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { ThemeText, ThemedSafeAreaView, ProductCard, Header } from '../components';
import { useTheme } from '../context';
import { Product } from '../utils/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation';

const { width } = Dimensions.get('window');

export const WishlistScreen: React.FC = () => {
    const { items } = useAppSelector((state) => state.wishlist);
    const dispatch = useAppDispatch();
    const { colors } = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const renderItem = ({ item }: { item: Product }) => (
        <View style={styles.gridItem}>
            <ProductCard product={item} width={(width - 52) / 2} hideWishlistButton={true} />
            <TouchableOpacity
                style={[styles.removeIcon, { backgroundColor: colors.surface }]}
                onPress={() => dispatch(toggleWishlist(item))}
                activeOpacity={0.5}
            >
                <Ionicons name="close" size={20} color={colors.error || '#FF3B30'} />
            </TouchableOpacity>
        </View>
    );

    return (
        <ThemedSafeAreaView style={styles.container}>
            <Header title="My Favorites" />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero section */}
                <View style={styles.heroSection}>
                    <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
                        <View style={styles.heroContent}>
                            <ThemeText style={[styles.heroTitle, { color: colors.surface }]}>Your Wishlist</ThemeText>
                            <ThemeText style={[styles.heroSubtitle, { color: colors.offWhiteText }]}>
                                {items.length} curated products handpicked and saved in your personal collection.
                            </ThemeText>
                        </View>
                        <Ionicons name="heart" size={70} color="rgba(255,255,255,0.2)" style={styles.heroIcon} />
                    </View>
                </View>

                {items.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={[styles.emptyIconContainer, { backgroundColor: colors.primary + '10' }]}>
                            <Ionicons name="heart-dislike-outline" size={60} color={colors.primary} />
                        </View>
                        <ThemeText style={styles.emptyTitle}>Nothing here yet</ThemeText>
                        <ThemeText style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                            Start exploring and tap the heart icon to save products you love!
                        </ThemeText>
                        <TouchableOpacity
                            style={[styles.startShoppingBtn, { backgroundColor: colors.primary }]}
                            onPress={() => navigation.navigate('Main' as any)}
                        >
                            <ThemeText style={styles.startShoppingText}>Explore Now</ThemeText>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.productsSection}>
                        <View style={styles.sectionHeader}>
                            <ThemeText style={styles.sectionTitle}>Saved Items</ThemeText>
                        </View>
                        <View style={styles.productsGrid}>
                            {items.map((item) => (
                                <React.Fragment key={item.id}>
                                    {renderItem({ item })}
                                </React.Fragment>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>
        </ThemedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heroSection: {
        padding: 20,
        paddingBottom: 10,
    },
    heroCard: {
        height: 140,
        borderRadius: 15,
        padding: 25,
        flexDirection: 'row',
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    heroContent: {
        flex: 1,
        justifyContent: 'center',
        zIndex: 1,
    },
    heroTitle: {
        fontSize: 26,
        fontWeight: '900',
    },
    heroSubtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    heroIcon: {
        position: 'absolute',
        right: -5,
        bottom: -10,
    },
    productsSection: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40,
    },
    sectionHeader: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: (width - 52) / 2,
        marginBottom: 20,
        position: 'relative',
    },
    removeIcon: {
        position: 'absolute',
        top: -5,
        right: 5,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        zIndex: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 40,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 35,
    },
    startShoppingBtn: {
        paddingHorizontal: 40,
        paddingVertical: 14,
        borderRadius: 30,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    startShoppingText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '900',
    },
});

export default WishlistScreen;
