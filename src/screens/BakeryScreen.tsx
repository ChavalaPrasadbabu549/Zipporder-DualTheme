import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProducts, fetchSubCategories } from '../store/slices/catalogSlice';
import { ThemeText, ThemedSafeAreaView, Card } from '../components';
import { useTheme } from '../context';
import { Product, SubCategory } from '../utils/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { formatImageUrl } from '../utils';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation';

const BakeryScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useAppDispatch();
    const { products, loading, subCategories } = useAppSelector((state) => state.catalog);
    const { colors } = useTheme();
    const [selectedSubId, setSelectedSubId] = useState<number | null>(null);

    const CATEGORY_ID = 1; // Bakery Category ID
    const bakerySubCategories = subCategories[CATEGORY_ID] || [];

    useEffect(() => {
        dispatch(fetchSubCategories(CATEGORY_ID));
        dispatch(fetchProducts({ categoryId: CATEGORY_ID }));
    }, [dispatch]);

    useEffect(() => {
        if (selectedSubId !== null) {
            dispatch(fetchProducts({
                categoryId: CATEGORY_ID,
                subCategoryId: selectedSubId
            }));
        } else {
            dispatch(fetchProducts({ categoryId: CATEGORY_ID }));
        }
    }, [selectedSubId, dispatch]);

    const handleSubCategorySelect = (id: number | null) => {
        setSelectedSubId(id);
    };

    const renderSubCategoryChip = (item: SubCategory | null) => {
        const isSelected = selectedSubId === (item ? item.id : null);
        const name = item ? item.name : 'All Products';

        return (
            <TouchableOpacity
                key={item ? item.id : 'all'}
                style={[
                    styles.subCategoryChip,
                    {
                        backgroundColor: isSelected ? colors.primary : colors.surface,
                        borderColor: isSelected ? colors.primary : colors.border,
                        borderWidth: 1
                    }
                ]}
                onPress={() => handleSubCategorySelect(item ? item.id : null)}
            >
                <ThemeText style={[
                    styles.subCategoryText,
                    { color: isSelected ? '#FFF' : colors.text }
                ]}>
                    {name}
                </ThemeText>
            </TouchableOpacity>
        );
    };

    const renderProductItem = ({ item }: { item: Product }) => {
        const imageUrl = formatImageUrl(item.images);
        return (
            <TouchableOpacity
                style={styles.productCard}
                onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            >
                <Card style={{ padding: 0, overflow: 'hidden', flex: 1 }}>
                    <View style={styles.imageWrapper}>
                        {imageUrl ? (
                            <Image
                                source={{ uri: imageUrl }}
                                style={styles.productImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={[styles.productImage, { backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' }]}>
                                <Ionicons name="image-outline" size={40} color={colors.textSecondary} />
                            </View>
                        )}
                        {item.discount_price < item.price && (
                            <View style={styles.badge}>
                                <ThemeText style={styles.badgeText}>OFFER</ThemeText>
                            </View>
                        )}
                    </View>
                    <View style={styles.productInfo}>
                        <ThemeText style={styles.productName} numberOfLines={1}>{item.name}</ThemeText>
                        <ThemeText style={styles.productDesc} numberOfLines={2}>
                            {item.description || 'Delicious bakery item fresh for you.'}
                        </ThemeText>

                        <View style={styles.priceRow}>
                            <View>
                                <ThemeText style={styles.price}>₹{item.discount_price}</ThemeText>
                                {item.price > item.discount_price && (
                                    <ThemeText style={styles.oldPrice}>₹{item.price}</ThemeText>
                                )}
                            </View>
                            <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
                                <Ionicons name="cart-outline" size={18} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <ThemedSafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <ThemeText style={styles.title}>Bakery</ThemeText>
                    <ThemeText style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Explore our sweet and savory treats
                    </ThemeText>
                </View>
                <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.surface }]}>
                    <Ionicons name="options-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.subCategoriesContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.subCategoriesScroll}
                >
                    {renderSubCategoryChip(null)}
                    {bakerySubCategories.map(sub => renderSubCategoryChip(sub))}
                </ScrollView>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <ThemeText style={{ marginTop: 10 }}>Updating products...</ThemeText>
                </View>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Ionicons name="basket-outline" size={60} color={colors.border} />
                            <ThemeText style={{ marginTop: 10 }}>No products found in this category.</ThemeText>
                        </View>
                    }
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    filterButton: {
        padding: 10,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    subCategoriesContainer: {
        marginVertical: 10,
    },
    subCategoriesScroll: {
        paddingHorizontal: 15,
        paddingBottom: 5,
    },
    subCategoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 25,
        marginHorizontal: 4,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    subCategoryText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    listContent: {
        padding: 12,
        paddingBottom: 30,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    productCard: {
        width: '48%',
        marginBottom: 16,
        padding: 0,
    },
    imageWrapper: {
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: 140,
        backgroundColor: '#f5f5f5',
    },
    badge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#FF004D',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    productInfo: {
        padding: 12,
    },
    productName: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    productDesc: {
        fontSize: 11,
        opacity: 0.6,
        lineHeight: 16,
        marginBottom: 10,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF004D',
    },
    oldPrice: {
        fontSize: 11,
        textDecorationLine: 'line-through',
        opacity: 0.4,
        marginLeft: 4,
    },
    addButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
});

export default BakeryScreen;
