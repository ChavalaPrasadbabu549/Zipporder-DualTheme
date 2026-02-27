import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    ScrollView,
    TextInput
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchCategories, fetchSubCategories, fetchProducts } from '../store/slices/catalogSlice';
import { ThemeText, ThemedSafeAreaView, Card, ProductCard } from '../components';
import { useTheme } from '../context';
import { Category, SubCategory, Product } from '../utils/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { formatImageUrl } from '../utils';

const SIDEBAR_WIDTH = 90;
type Props = any;

const AllCategoriesScreen = ({ navigation, route }: Props) => {
    const dispatch = useAppDispatch();
    const { categories, subCategories, products, loading } = useAppSelector((state) => state.catalog);
    const { colors } = useTheme();
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Initial load and param handling
    useEffect(() => {
        dispatch(fetchCategories({}));

        // If navigation came with a categoryId, set it
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

    const getCategoryIcon = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('fashion') || lowerName.includes('clothing')) return 'shirt-outline';
        if (lowerName.includes('elect')) return 'phone-portrait-outline';
        if (lowerName.includes('home')) return 'home-outline';
        if (lowerName.includes('beauty')) return 'water-outline';
        if (lowerName.includes('sport')) return 'bicycle-outline';
        if (lowerName.includes('toy')) return 'game-controller-outline';
        if (lowerName.includes('bake')) return 'pizza-outline';
        if (lowerName.includes('grocery')) return 'basket-outline';
        return 'apps-outline';
    };

    const renderSidebarItem = ({ item }: { item: Category }) => {
        const isSelected = selectedId === item.id;
        return (
            <TouchableOpacity
                style={[
                    styles.sidebarItem,
                    isSelected && { backgroundColor: colors.background }
                ]}
                onPress={() => setSelectedId(item.id)}
            >
                {isSelected && <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />}
                <View style={[styles.iconContainer, isSelected && { backgroundColor: colors.primary + '10' }]}>
                    <Ionicons
                        name={getCategoryIcon(item.name)}
                        size={24}
                        color={isSelected ? colors.primary : colors.textSecondary}
                    />
                </View>
                <ThemeText style={[
                    styles.sidebarLabel,
                    { color: isSelected ? colors.primary : colors.textSecondary, fontWeight: isSelected ? '700' : '500' }
                ]}>
                    {item.name.toUpperCase()}
                </ThemeText>
            </TouchableOpacity>
        );
    };

    const renderSubCategory = ({ item }: { item: SubCategory }) => (
        <TouchableOpacity
            style={styles.subCategoryItem}
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
            <ThemeText style={styles.subCategoryName} numberOfLines={1}>{item.name}</ThemeText>
        </TouchableOpacity>
    );

    const renderProductItem = ({ item }: { item: Product }) => (
        <ProductCard product={item} />
    );

    return (
        <ThemedSafeAreaView style={styles.container}>
            {/* Header with Search and Back */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
                    <TextInput
                        placeholder={`Search ${currentCategory?.name || 'products'}...`}
                        placeholderTextColor={colors.textSecondary}
                        style={[styles.searchInput, { color: colors.text }]}
                    />
                </View>
                <TouchableOpacity style={styles.cartHeaderButton}>
                    <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                        <ThemeText style={styles.badgeText}>3</ThemeText>
                    </View>
                    <Ionicons name="cart-outline" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Left Sidebar */}
                <View style={[styles.sidebar, { borderRightColor: colors.border }]}>
                    <FlatList
                        data={categories}
                        renderItem={renderSidebarItem}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.sidebarList}
                    />
                </View>

                {/* Right Content Area */}
                <ScrollView
                    style={styles.mainArea}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.mainScrollContent}
                >
                    <View style={styles.mainHeader}>
                        <ThemeText style={styles.browseTitle}>Browse {currentCategory?.name}</ThemeText>
                    </View>

                    {/* Subcategories */}
                    {currentSubCategories.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <ThemeText style={styles.sectionTitle}>Shop Categories</ThemeText>
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

                    {/* Products */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <ThemeText style={styles.sectionTitle}>Featured Products</ThemeText>
                            <TouchableOpacity onPress={() => navigation.navigate('CategoryDetail', {
                                categoryId: selectedId!,
                                categoryName: currentCategory?.name || ''
                            })}>
                                <ThemeText style={{ color: colors.primary, fontSize: 13 }}>See all</ThemeText>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        gap: 12,
    },
    backButton: {
        padding: 4,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        padding: 0,
    },
    cartHeaderButton: {
        padding: 4,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
    },
    // Sidebar Styles
    sidebar: {
        width: SIDEBAR_WIDTH,
        backgroundColor: '#FCFCFC',
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
        left: 0,
        top: '25%',
        bottom: '25%',
        width: 4,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    sidebarLabel: {
        fontSize: 9,
        textAlign: 'center',
        paddingHorizontal: 4,
        letterSpacing: 0.5,
    },
    // Main Area Styles
    mainArea: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    mainScrollContent: {
        padding: 16,
    },
    mainHeader: {
        marginBottom: 20,
    },
    browseTitle: {
        fontSize: 22,
        fontWeight: '700',
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
        fontSize: 16,
        fontWeight: '700',
    },
    subListContent: {
        gap: 16,
    },
    subCategoryItem: {
        alignItems: 'center',
        width: 70,
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
        fontSize: 11,
        textAlign: 'center',
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
        gap: 12,
    },
});

export default AllCategoriesScreen;
