import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    RefreshControl,
    Dimensions
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchCategories, fetchSubCategories, fetchProducts } from '../store/slices/catalogSlice';
import { ThemeText, ThemedSafeAreaView, ProductCard, Header } from '../components';
import { useTheme } from '../context';
import { Category, SubCategory, Product } from '../utils/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { formatImageUrl } from '../utils';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = 90;
const MAIN_PADDING = 16;
const mainContentWidth = width - SIDEBAR_WIDTH - (MAIN_PADDING * 2);
const CARD_WIDTH = mainContentWidth;
type Props = any;
const AllCategoriesScreen = ({ navigation, route }: Props) => {
    const dispatch = useAppDispatch();
    const { categories, subCategories, products, loading } = useAppSelector((state) => state.catalog);
    const { colors } = useTheme();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await dispatch(fetchCategories({})).unwrap();
            if (selectedId !== null) {
                await Promise.all([
                    dispatch(fetchSubCategories(selectedId)).unwrap(),
                    dispatch(fetchProducts({ categoryId: selectedId })).unwrap()
                ]);
            }
        } catch (error) {
            console.error('Refresh failed:', error);
        } finally {
            setRefreshing(false);
        }
    }, [dispatch, selectedId]);

    useEffect(() => {
        dispatch(fetchCategories({}));

        const params = route.params as any;
        if (params?.categoryId) {
            setSelectedId(params.categoryId);
        }
    }, [dispatch, route.params]);

    useEffect(() => {
        if (categories.length > 0 && selectedId === null) {
            setSelectedId(categories[0].id);
        }
    }, [categories, selectedId]);

    useEffect(() => {
        if (selectedId !== null) {
            dispatch(fetchSubCategories(selectedId));
            dispatch(fetchProducts({ categoryId: selectedId }));
        }
    }, [dispatch, selectedId]);

    const currentSubCategories = selectedId !== null ? subCategories[selectedId] || [] : [];
    const currentCategory = categories.find(c => c.id === selectedId);

    const renderSidebarItem = ({ item }: { item: Category }) => {
        const isSelected = selectedId === item.id;
        const imageUrl = formatImageUrl(item.image);

        return (
            <TouchableOpacity
                style={[
                    styles.sidebarItem,
                    { backgroundColor: isSelected ? colors.surface : 'transparent' }
                ]}
                onPress={() => setSelectedId(item.id)}
                activeOpacity={0.7}
            >
                {isSelected && (
                    <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
                )}

                <View style={[
                    styles.iconContainer,
                    { backgroundColor: isSelected ? colors.primary + '10' : colors.surface },
                    { borderColor: isSelected ? colors.primary : colors.border },
                    { borderWidth: isSelected ? 2 : 1 }
                ]}>
                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={[
                                styles.sidebarImage,
                                isSelected ? { opacity: 1 } : { opacity: 0.6 }
                            ]}
                            resizeMode="cover"
                        />
                    ) : (
                        <Ionicons
                            name="apps-outline"
                            size={20}
                            color={isSelected ? '#FFF' : colors.textSecondary}
                        />
                    )}
                </View>

                <ThemeText
                    style={[
                        styles.sidebarLabel,
                        {
                            color: isSelected ? colors.primary : colors.textSecondary,
                            fontWeight: isSelected ? '800' : '500',
                        }
                    ]}
                    numberOfLines={2}
                >
                    {item.name}
                </ThemeText>
            </TouchableOpacity>
        );
    };

    const renderSubCategory = ({ item }: { item: SubCategory }) => (
        <TouchableOpacity
            style={[styles.subCategoryCard, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('CategoryDetail', {
                categoryId: selectedId!,
                categoryName: currentCategory?.name || ''
            })}
        >
            <View style={[styles.subCategoryImageContainer, { backgroundColor: colors.surface }]}>
                {item.image ? (
                    <Image source={{ uri: formatImageUrl(item.image) }} style={styles.subCategoryImage} />
                ) : (
                    <Ionicons name="image-outline" size={20} color={colors.textSecondary} />
                )}
            </View>
            <ThemeText style={[styles.subCategoryName, { color: colors.text }]} numberOfLines={1}>{item.name}</ThemeText>
        </TouchableOpacity>
    );

    const renderProductItem = ({ item }: { item: Product }) => (
        <ProductCard product={item} width={CARD_WIDTH} />
    );

    return (
        <ThemedSafeAreaView style={styles.container}>
            <Header title="All Categories" />

            <View style={styles.content}>
                <View style={[styles.sidebar, { borderRightColor: colors.border, backgroundColor: colors.surface + '40' }]}>
                    <FlatList
                        data={categories}
                        renderItem={renderSidebarItem}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.sidebarList}
                    />
                </View>

                <ScrollView
                    style={[styles.mainArea, { backgroundColor: colors.background }]}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.mainScrollContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                        />
                    }
                >
                    <View style={styles.mainHeader}>
                        <ThemeText style={[styles.browseTitle, { color: colors.text }]}>Browse {currentCategory?.name}</ThemeText>
                    </View>

                    {currentSubCategories.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <ThemeText style={[styles.sectionTitle, { color: colors.text }]}>Shop Categories</ThemeText>
                            </View>
                            <FlatList
                                data={currentSubCategories}
                                renderItem={renderSubCategory}
                                keyExtractor={(item) => item.id.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.subListContent}
                            />
                        </View>
                    )}

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <ThemeText style={styles.sectionTitle}>Products</ThemeText>
                            <TouchableOpacity onPress={() => navigation.navigate('CategoryDetail', {
                                categoryId: selectedId!,
                                categoryName: currentCategory?.name || ''
                            })}>
                                {/* <ThemeText style={{ color: colors.primary, fontSize: 13 }}>See all</ThemeText> */}
                            </TouchableOpacity>
                        </View>

                        {loading && products.length === 0 ? (
                            <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} />
                        ) : (
                            <View style={styles.productsGrid}>
                                {products.slice(0, 6).map((product) => (
                                    <React.Fragment key={product.id}>
                                        {renderProductItem({ item: product })}
                                    </React.Fragment>
                                ))}
                                {products.length === 0 && !loading && (
                                    <ThemeText style={styles.emptyText}>No products found in this category.</ThemeText>
                                )}
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </ThemedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebar: {
        width: SIDEBAR_WIDTH,
        borderRightWidth: 1,
    },
    sidebarList: {
        paddingVertical: 10,
    },
    sidebarItem: {
        width: '100%',
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    activeIndicator: {
        position: 'absolute',
        left: 3,
        top: '20%',
        bottom: '20%',
        width: 3,
        borderRadius: 10,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        overflow: 'hidden',
    },
    sidebarImage: {
        width: '100%',
        height: '100%',
    },
    sidebarLabel: {
        fontSize: 10,
        textAlign: 'center',
        paddingHorizontal: 4,
        letterSpacing: 0.5,
        textTransform: 'capitalize',
        fontFamily: 'Inter-Medium',
    },
    mainArea: {
        flex: 1,
    },
    mainScrollContent: {
        padding: MAIN_PADDING,
    },
    mainHeader: {
        marginBottom: 20,
    },
    browseTitle: {
        fontSize: 18,
        fontWeight: '700',
        fontFamily: 'Inter-Bold',
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        fontFamily: 'Inter-Bold',
    },
    subListContent: {
        gap: 16,
    },
    subCategoryCard: {
        alignItems: 'center',
        width: 80,
    },
    subCategoryImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        overflow: 'hidden',
    },
    subCategoryImage: {
        width: '100%',
        height: '100%',
    },
    subCategoryName: {
        fontSize: 10,
        textAlign: 'center',
        fontFamily: 'Inter-Medium',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        opacity: 0.5,
        width: '100%',
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 16,
    },
});

export default AllCategoriesScreen;
