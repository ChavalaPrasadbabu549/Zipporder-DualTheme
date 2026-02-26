import React, { useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchCategories } from '../store/slices/catalogSlice';
import { ThemeText, ThemedSafeAreaView } from '../components';
import { useTheme } from '../context';
import { Category } from '../utils/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { formatImageUrl } from '../utils';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation';

const { width } = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'AllCategories'>;

const AllCategoriesScreen: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { categories, loading } = useAppSelector((state) => state.catalog);
    const { colors } = useTheme();

    useEffect(() => {
        if (categories.length === 0) {
            dispatch(fetchCategories({}));
        }
    }, [dispatch, categories.length]);

    const renderCategoryItem = ({ item }: { item: Category }) => {
        const imageUrl = formatImageUrl(item.image);
        const isBakery = item.id === 1;

        return (
            <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => {
                    if (isBakery) {
                        // Navigate to the Bakery tab/screen specifically if you want the rich UI
                        navigation.navigate('Main', { screen: 'Bakery' } as any);
                    } else {
                        navigation.navigate('CategoryDetail', {
                            categoryId: item.id,
                            categoryName: item.name
                        });
                    }
                }}
            >
                <View style={[styles.imageContainer, { backgroundColor: colors.surface }]}>
                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.categoryImage}
                        />
                    ) : (
                        <View style={[styles.categoryImage, { backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' }]}>
                            <Ionicons name="image-outline" size={30} color={colors.textSecondary} />
                        </View>
                    )}
                </View>
                <ThemeText style={styles.categoryName} numberOfLines={1}>{item.name}</ThemeText>
                <ThemeText style={[styles.subCount, { color: colors.textSecondary }]}>
                    {item.subcategory_count} Items
                </ThemeText>
            </TouchableOpacity>
        );
    };

    return (
        <ThemedSafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <ThemeText style={styles.title}>All Categories</ThemeText>
                <View style={{ width: 24 }} />
            </View>

            {loading && categories.length === 0 ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={categories}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
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
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    backButton: {
        padding: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContent: {
        padding: 10,
    },
    categoryCard: {
        width: (width - 20) / 3,
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        padding: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 8,
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        borderRadius: 35,
    },
    categoryName: {
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subCount: {
        fontSize: 10,
        marginTop: 2,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AllCategoriesScreen;
