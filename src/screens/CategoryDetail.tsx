import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Dimensions,
    RefreshControl,
    ImageBackground,
    Image
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchCategories, fetchProducts, fetchSubCategories } from '../store/slices/catalogSlice';
import { ThemeText, ThemedSafeAreaView, ProductCard, Header } from '../components';
import { useTheme } from '../context';
import { Product, SubCategory } from '../utils/types';
import { formatImageUrl } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const CategoryDetailScreen: React.FC<any> = ({ route }) => {
    const { categoryId: paramId, categoryName } = route.params;
    const dispatch = useAppDispatch();
    const { subCategories, categories, loading: globalLoading } = useAppSelector((state) => state.catalog);
    const { colors, isDark } = useTheme();

    const [localProducts, setLocalProducts] = useState<Product[]>([]);
    const [localLoading, setLocalLoading] = useState(false);
    const [selectedSubId, setSelectedSubId] = useState<number | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const resolvedCategory = categories.find(c =>
        c.name.toLowerCase().includes((categoryName || '').toLowerCase()) ||
        c.id === paramId
    );
    const categoryId = paramId || resolvedCategory?.id;

    const loadData = async (subId: number | null = selectedSubId) => {
        if (!categoryId) return;
        setLocalLoading(true);
        try {
            const result = await dispatch(fetchProducts({
                categoryId,
                subCategoryId: subId || undefined
            })).unwrap();
            setLocalProducts(result.products);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLocalLoading(false);
        }
    };

    const handleRefresh = async () => {
        if (!categoryId) return;
        setRefreshing(true);
        try {
            await Promise.all([
                dispatch(fetchSubCategories(categoryId)).unwrap(),
                loadData(selectedSubId)
            ]);
        } finally {
            setRefreshing(false);
        }
    };

    const currentSubCategories = categoryId ? subCategories[categoryId] || [] : [];

    useEffect(() => {
        if (categories.length === 0) {
            dispatch(fetchCategories({}));
        }
    }, [dispatch, categories.length]);

    useEffect(() => {
        if (categoryId) {
            dispatch(fetchSubCategories(categoryId));
            loadData(null);
            setSelectedSubId(null);
        }
    }, [dispatch, categoryId]);

    useEffect(() => {
        if (categoryId && selectedSubId !== null) {
            loadData(selectedSubId);
        } else if (categoryId) {
            loadData(null);
        }
    }, [selectedSubId, categoryId]);

    const handleSubCategorySelect = (id: number | null) => {
        setSelectedSubId(id);
    };

    const renderSubCategoryItem = (item: SubCategory | null) => {
        const isSelected = selectedSubId === (item ? item.id : null);
        const name = item ? item.name : 'All';
        const imgUrl = item ? formatImageUrl(item.image) : null;

        return (
            <TouchableOpacity
                key={item ? item.id : 'all'}
                style={styles.subCatBtn}
                onPress={() => handleSubCategorySelect(item ? item.id : null)}
                activeOpacity={0.8}
            >
                <View style={[
                    styles.subCatIconBox,
                    {
                        borderColor: isSelected ? colors.primary : colors.border,
                        backgroundColor: isSelected ? colors.primary + '10' : colors.surface,
                        borderWidth: isSelected ? 2 : 1.5,
                    }
                ]}>
                    <View style={[
                        styles.innerIconCircle,
                        { backgroundColor: isSelected ? colors.primary : isDark ? '#2D3748' : '#EDF2F7' }
                    ]}>
                        {imgUrl ? (
                            <Image source={{ uri: imgUrl }} style={styles.subCatImg} resizeMode="cover" />
                        ) : (
                            <Ionicons
                                name={item ? "layers" : "apps"}
                                size={26}
                                color={isSelected ? colors.surface : colors.primary}
                            />
                        )}
                    </View>
                    {isSelected && (
                        <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]}>
                            <Ionicons name="checkmark" size={10} color={colors.surface} />
                        </View>
                    )}
                </View>
                <ThemeText
                    style={[
                        styles.subCatName,
                        {
                            color: isSelected ? colors.primary : colors.textSecondary,
                            fontFamily: isSelected ? 'Inter-Bold' : 'Inter-Medium'
                        }
                    ]}
                    numberOfLines={1}
                >
                    {name}
                </ThemeText>
            </TouchableOpacity>
        );
    };

    const renderProductItem = ({ item }: { item: Product }) => (
        <ProductCard product={item} width={(width - 48) / 2} />
    );

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    const categoryImage = resolvedCategory ? formatImageUrl(resolvedCategory.image) : null;

    return (
        <ThemedSafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
            <Header title={capitalize(categoryName || 'Category')} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
            >
                <View>
                    {categoryImage ? (
                        <View style={styles.splitHeroWrapper}>
                            <View style={styles.splitMainRow}>
                                <View style={[styles.splitTextCol, { backgroundColor: colors.primary }]}>
                                    <View style={styles.splitBadgeContainer}>
                                        <View style={[styles.splitBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                            <ThemeText style={[styles.splitBadgeText, { color: colors.surface }]}>LATEST DROP</ThemeText>
                                        </View>
                                    </View>
                                    <ThemeText style={[styles.splitTitle, { color: colors.surface }]}>
                                        {resolvedCategory?.name || capitalize(categoryName || '')}
                                    </ThemeText>
                                    <ThemeText style={[styles.splitDesc, { color: colors.offWhiteText }]} numberOfLines={2}>
                                        {resolvedCategory?.description || `Premium selection of ${categoryName?.toLowerCase()} items.`}
                                    </ThemeText>
                                    <Ionicons name="ribbon-outline" size={100} color="rgba(255,255,255,0.15)" style={styles.splitIconBack} />
                                </View>
                                <View style={styles.splitImageCol}>
                                    {categoryImage ? (
                                        <Image source={{ uri: categoryImage }} style={styles.splitHeroImage} resizeMode="cover" />
                                    ) : (
                                        <View style={[styles.splitImageFallback, { backgroundColor: colors.border }]}>
                                            <Ionicons name="image-outline" size={40} color={colors.textSecondary} />
                                        </View>
                                    )}
                                </View>
                            </View>

                            <View style={styles.splitStatsFloating}>
                                <View style={[styles.splitStatItem, { backgroundColor: colors.surface, shadowColor: colors.primary }]}>
                                    <ThemeText style={[styles.splitStatVal, { color: colors.primary }]}>{localProducts.length}</ThemeText>
                                    <ThemeText style={[styles.splitStatLab, { color: colors.textSecondary }]}>Products</ThemeText>
                                </View>
                                <View style={[styles.splitStatItem, { backgroundColor: colors.surface, shadowColor: colors.primary }]}>
                                    <ThemeText style={[styles.splitStatVal, { color: colors.primary }]}>{currentSubCategories.length}</ThemeText>
                                    <ThemeText style={[styles.splitStatLab, { color: colors.textSecondary }]}>Categories</ThemeText>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={[styles.heroCardFallback, { backgroundColor: colors.primary }]}>
                            <ThemeText style={[styles.heroTitleFallback, { color: colors.surface }]}>{resolvedCategory?.name || capitalize(categoryName || '')}</ThemeText>
                            <ThemeText style={[styles.heroSubtitleFallback, { color: colors.offWhiteText }]}>
                                {resolvedCategory?.description || `Freshly picked for you`}
                            </ThemeText>
                            <Ionicons name="sparkles" size={80} color="rgba(255,255,255,0.1)" style={styles.heroIconFallback} />
                        </View>
                    )}
                </View>

                <View style={styles.subCategoriesSection}>
                    <View style={styles.sectionHeaderInner}>
                        <ThemeText style={styles.sectionLabelMain}>Browse by Type</ThemeText>
                        <ThemeText style={[styles.itemCountGhost, { color: colors.textSecondary }]}>
                            {currentSubCategories.length + 1} options
                        </ThemeText>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.subCategoriesScrollInner}
                    >
                        {renderSubCategoryItem(null)}
                        {currentSubCategories.map(sub => renderSubCategoryItem(sub))}
                    </ScrollView>
                </View>

                <View style={styles.productsSectionMain}>
                    <View style={styles.gridHeader}>
                        <ThemeText style={styles.gridTitle}>
                            {selectedSubId ? currentSubCategories.find(s => s.id === selectedSubId)?.name : 'All Products'}
                        </ThemeText>
                        <ThemeText style={[styles.itemsCount, { color: colors.textSecondary }]}>
                            Showing {localProducts.length} items
                        </ThemeText>
                    </View>

                    {localLoading && !refreshing ? (
                        <View style={styles.loaderContainerMain}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    ) : (
                        <View style={styles.gridContainerMain}>
                            {localProducts.length > 0 ? (
                                <View style={styles.productsGridMain}>
                                    {localProducts.map((product: Product) => (
                                        <View key={product.id} style={styles.gridItemMain}>
                                            {renderProductItem({ item: product })}
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <Ionicons name="search-outline" size={50} color={colors.border} />
                                    <ThemeText style={styles.emptyTitle}>No products found</ThemeText>
                                    <ThemeText style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                                        Try another subcategory
                                    </ThemeText>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
        </ThemedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    scrollContent: {
        paddingBottom: 20,
    },

    splitHeroWrapper: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 40,
    },
    splitMainRow: {
        flexDirection: 'row',
        height: 220,
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    splitTextCol: {
        flex: 1.2,
        padding: 20,
        justifyContent: 'center',
    },
    splitBadgeContainer: {
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    splitBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    splitBadgeText: {
        fontSize: 9,
        fontWeight: 'bold',
        letterSpacing: 1,
        fontFamily: 'Inter-Bold',
    },
    splitTitle: {
        fontSize: 28,
        fontWeight: '900',
        fontFamily: 'Inter-Bold',
        letterSpacing: -0.5,
        textTransform: 'capitalize',
    },
    splitDesc: {
        fontSize: 12,
        marginTop: 6,
        lineHeight: 18,
        fontFamily: 'Inter-Medium',
    },
    splitIconBack: {
        position: 'absolute',
        right: -20,
        bottom: -20,
    },
    splitImageCol: {
        flex: 1,
    },
    splitHeroImage: {
        width: '100%',
        height: '100%',
    },
    splitImageFallback: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    splitStatsFloating: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 15,
        left: 32,
        right: 32,
        justifyContent: 'center',
    },
    splitStatItem: {
        flex: 1,
        marginHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    splitStatVal: {
        fontSize: 18,
        fontWeight: '900',
        fontFamily: 'Inter-Bold',
    },
    splitStatLab: {
        fontSize: 10,
        textTransform: 'uppercase',
        fontFamily: 'Inter-Medium',
        marginTop: 1,
    },
    heroCardFallback: {
        height: 180,
        borderRadius: 20,
        padding: 25,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    heroTitleFallback: {
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: 'Inter-Bold',
    },
    heroSubtitleFallback: {
        fontSize: 15,
        marginTop: 5,
        fontFamily: 'Inter-Regular',
    },
    heroIconFallback: {
        position: 'absolute',
        right: -10,
        bottom: -10,
    },
    subCategoriesSection: {
        marginTop: 5,
        marginBottom: 20,
    },
    sectionHeaderInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionLabelMain: {
        fontSize: 18,
        fontWeight: '700',
        fontFamily: 'Inter-Bold',
    },
    itemCountGhost: {
        fontSize: 12,
        fontFamily: 'Inter-Medium',
    },
    subCategoriesScrollInner: {
        paddingHorizontal: 15,
        paddingBottom: 5,
    },
    subCatBtn: {
        alignItems: 'center',
        marginHorizontal: 8,
        width: 76,
    },
    subCatIconBox: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        position: 'relative',
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    innerIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    subCatImg: {
        width: '100%',
        height: '100%',
    },
    subCatName: {
        fontSize: 11,
        textAlign: 'center',
        marginTop: 2,
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    productsSectionMain: {
        paddingHorizontal: 16,
    },
    gridHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    gridTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Inter-Bold',
    },
    itemsCount: {
        fontSize: 12,
        fontFamily: 'Inter-Medium',
    },
    loaderContainerMain: {
        padding: 50,
        alignItems: 'center',
    },
    gridContainerMain: {
        width: '100%',
    },
    productsGridMain: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItemMain: {
        width: (width - 48) / 2,
        marginBottom: 16,
    },
    emptyContainer: {
        padding: 60,
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Inter-Bold',
        marginTop: 15,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5,
        fontFamily: 'Inter-Regular',
    },
});

export default CategoryDetailScreen;

