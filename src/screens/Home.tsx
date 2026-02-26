import React, { useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchCategories } from '../store/slices/catalogSlice';
import { ThemeText, ThemedSafeAreaView, Card, Loading } from '../components';
import { useTheme } from '../context';
import { Category } from '../utils/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { formatImageUrl } from '../utils';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation';

const { width } = Dimensions.get('window');
export const Home: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useAppDispatch();
    const { categories, loading } = useAppSelector((state) => state.catalog);
    const { colors } = useTheme();

    useEffect(() => {
        dispatch(fetchCategories({}));
    }, [dispatch]);

    const renderCategoryItem = ({ item }: { item: Category }) => {
        const imageUrl = formatImageUrl(item.image);
        return (
            <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => navigation.navigate('CategoryDetail', {
                    categoryId: item.id,
                    categoryName: item.name
                })}
            >
                <View style={[styles.imageContainer, { backgroundColor: colors.surface }]}>
                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.categoryImage}
                        />
                    ) : (
                        <View style={[styles.categoryImage, { backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' }]}>
                            <Ionicons name="image-outline" size={24} color={colors.textSecondary} />
                        </View>
                    )}
                </View>
                <ThemeText style={styles.categoryName}>{item.name}</ThemeText>
                <ThemeText style={[styles.subCount, { color: colors.textSecondary }]}>
                    {item.subcategory_count} Items
                </ThemeText>
            </TouchableOpacity>
        );
    };

    if (loading && categories.length === 0) {
        return <Loading />;
    }

    return (
        <ThemedSafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <ThemeText style={styles.greeting}>Hello there!</ThemeText>
                    <View style={styles.sectionHeader}>
                        <ThemeText style={styles.title}>Categories</ThemeText>
                        <TouchableOpacity onPress={() => navigation.navigate('AllCategories')}>
                            <ThemeText style={[styles.seeAll, { color: colors.primary }]}>See All</ThemeText>
                        </TouchableOpacity>
                    </View>
                </View>
                <FlatList
                    data={categories.slice(0, 4)}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={4}
                    contentContainerStyle={styles.listContent}
                    scrollEnabled={false}
                />

                <Card style={styles.promoCard}>
                    <View style={styles.promoContent}>
                        <ThemeText style={styles.promoTitle}>Fresh Bakery</ThemeText>
                        <ThemeText style={styles.promoDesc}>Get 20% off on all cakes today!</ThemeText>
                        <TouchableOpacity
                            style={[styles.promoButton, { backgroundColor: '#FFF' }]}
                            onPress={() => navigation.navigate('CategoryDetail', {
                                categoryId: 1,
                                categoryName: 'Bakery'
                            })}
                        >
                            <ThemeText style={{ color: colors.primary, fontWeight: 'bold' }}>Order Now</ThemeText>
                        </TouchableOpacity>
                    </View>
                </Card>


            </ScrollView>
        </ThemedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingBottom: 10,
    },
    greeting: {
        fontSize: 16,
        opacity: 0.7,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    seeAll: {
        fontSize: 14,
        fontWeight: '600',
    },
    listContent: {
        padding: 10,
    },
    categoryCard: {
        width: (width - 40) / 4,
        padding: 5,
        alignItems: 'center',
    },
    imageContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        padding: 5,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 8,
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
    },
    categoryName: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    subCount: {
        fontSize: 10,
        marginTop: 2,
    },
    promoCard: {
        margin: 20,
        backgroundColor: '#FF004D',
        borderRadius: 20,
        padding: 20,
    },
    promoContent: {
        justifyContent: 'center',
    },
    promoTitle: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
    },
    promoDesc: {
        color: '#FFF',
        fontSize: 14,
        marginTop: 4,
        opacity: 0.9,
    },
    promoButton: {
        marginTop: 15,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
});
