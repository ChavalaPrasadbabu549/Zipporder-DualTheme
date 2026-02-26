import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProducts, fetchSubCategories } from '../store/slices/catalogSlice';
import { ThemeText, ThemedSafeAreaView, Card } from '../components';
import { useTheme } from '../context';
import { Product, SubCategory } from '../utils/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { formatImageUrl } from '../utils';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CategoryDetail'>;

const CategoryDetailScreen: React.FC<Props> = ({ route, navigation }) => {
    // Note: Since I'm making this generic, I'll expect categoryId and categoryName from params
    const { categoryId, categoryName } = route.params;

    const dispatch = useAppDispatch();
    const { products, loading, subCategories } = useAppSelector((state) => state.catalog);
    const { colors } = useTheme();
    const [selectedSubId, setSelectedSubId] = useState<number | null>(null);

    const currentSubCategories = subCategories[categoryId] || [];

    useEffect(() => {
        dispatch(fetchSubCategories(categoryId));
        dispatch(fetchProducts({ categoryId }));
    }, [dispatch, categoryId]);

    useEffect(() => {
        if (selectedSubId !== null) {
            dispatch(fetchProducts({
                categoryId,
                subCategoryId: selectedSubId
            }));
        } else {
            dispatch(fetchProducts({ categoryId }));
        }
    }, [selectedSubId, dispatch, categoryId]);

    const renderSubCategoryChip = (item: SubCategory | null) => {
        const isSelected = selectedSubId === (item ? item.id : null);
        const name = item ? item.name : 'All';

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
                onPress={() => setSelectedSubId(item ? item.id : null)}
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
                            <Image source={{ uri: imageUrl }} style={styles.productImage} resizeMode="cover" />
                        ) : (
                            <View style={[styles.productImage, { backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' }]}>
                                <Ionicons name="image-outline" size={40} color={colors.textSecondary} />
                            </View>
                        )}
                    </View>
                    <View style={styles.productInfo}>
                        <ThemeText style={styles.productName} numberOfLines={1}>{item.name}</ThemeText>
                        <ThemeText style={styles.price}>₹{item.discount_price}</ThemeText>
                        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
                            <Ionicons name="add" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <ThemedSafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <ThemeText style={styles.title}>{categoryName}</ThemeText>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.subCategoriesContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subCategoriesScroll}>
                    {renderSubCategoryChip(null)}
                    {currentSubCategories.map(sub => renderSubCategoryChip(sub))}
                </ScrollView>
            </View>

            {loading && products.length === 0 ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <ThemeText>No products found.</ThemeText>
                        </View>
                    }
                />
            )}
        </ThemedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15 },
    backButton: { padding: 5 },
    title: { fontSize: 20, fontWeight: 'bold' },
    subCategoriesContainer: { marginVertical: 10 },
    subCategoriesScroll: { paddingHorizontal: 15 },
    subCategoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginHorizontal: 5 },
    subCategoryText: { fontSize: 13, fontWeight: 'bold' },
    listContent: { padding: 10 },
    columnWrapper: { justifyContent: 'space-between' },
    productCard: { width: '48%', marginBottom: 15, padding: 0 },
    imageWrapper: { position: 'relative' },
    productImage: { width: '100%', height: 140 },
    productInfo: { padding: 10 },
    productName: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
    price: { fontSize: 16, fontWeight: 'bold', color: '#FF004D' },
    addButton: { position: 'absolute', bottom: 10, right: 10, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default CategoryDetailScreen;
