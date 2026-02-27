import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemeText } from './';
import { CategoryCard } from './CategoryCard';
import { useTheme } from '../context';
import { Category } from '../utils/types';
import { RootStackParamList } from '../navigation/navigation';

interface CategorySectionProps {
    categories: Category[];
    size?: 'small' | 'large';
}

export const CategorySection: React.FC<CategorySectionProps> = ({ categories, size = 'large' }) => {
    const { colors } = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const isSmall = size === 'small';

    if (categories.length === 0) {
        return null;
    }

    const renderItem = ({ item }: { item: Category }) => (
        <CategoryCard
            category={item}
            size={size}
            onPress={() => navigation.navigate('AllCategories', {
                categoryId: item.id,
                categoryName: item.name
            })}
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <ThemeText style={styles.title}>
                        Categories
                    </ThemeText>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('AllCategories' as any)}>
                    <ThemeText style={[styles.viewAll, { color: colors.primary }]}>View all</ThemeText>
                </TouchableOpacity>
            </View>

            <FlatList
                data={categories}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                snapToInterval={isSmall ? (Dimensions.get('window').width * 0.48 + 16) : (Dimensions.get('window').width * 0.7 + 16)}
                decelerationRate="fast"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 14,
    },
    viewAll: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 4,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
});
