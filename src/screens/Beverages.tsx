import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProducts, fetchSubCategories } from '../store/slices/catalogSlice';
import { ThemeText, ThemedSafeAreaView, ProductCard } from '../components';
import { useTheme } from '../context';
import { Product, SubCategory } from '../utils/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation';

const { width } = Dimensions.get('window');

const BeveragesScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useAppDispatch();
    const { products, loading, subCategories } = useAppSelector((state) => state.catalog);
    const { colors } = useTheme();
    const [selectedSubId, setSelectedSubId] = useState<number | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const CATEGORY_ID = 3; // Beverages Category ID (Assuming ID 3)
    const beveragesSubCategories = subCategories[CATEGORY_ID] || [];

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

    const handleRefresh = async () => {
        setRefreshing(true);
        await Promise.all([
            dispatch(fetchSubCategories(CATEGORY_ID)),
            dispatch(fetchProducts({ categoryId: CATEGORY_ID, subCategoryId: selectedSubId || undefined }))
        ]);
        setRefreshing(false);
    };

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

    const renderProductItem = ({ item }: { item: Product }) => (
        <ProductCard product={item} width={(width - 40) / 2} />
    );

    return (
        <ThemedSafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <ThemeText style={styles.title}>Beverages</ThemeText>
                    <ThemeText style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Refreshing drinks for any occasion
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
                    {beveragesSubCategories.map(sub => renderSubCategoryChip(sub))}
                </ScrollView>
            </View>

            <FlatList
                data={products}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
                ListEmptyComponent={
                    loading && !refreshing ? (
                        <View style={styles.center}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    ) : (
                        <View style={styles.center}>
                            <Ionicons name="wine-outline" size={60} color={colors.border} />
                            <ThemeText style={{ marginTop: 10 }}>No products found in this category.</ThemeText>
                        </View>
                    )
                }
            />
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
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
});

export default BeveragesScreen;
