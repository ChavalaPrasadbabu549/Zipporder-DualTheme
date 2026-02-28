import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ThemeText from './Text';
import { useTheme } from '../context';
import { Category } from '../utils/types';
import { RootStackParamList } from '../navigation/navigation';
import { formatImageUrl } from '../utils/helpers';

const { width } = Dimensions.get('window');
const GAP = 15;
const PADDING = 20;
const CARD_WIDTH = (width - (PADDING * 2) - GAP) / 2;

interface CategorySectionProps {
    categories: Category[];
}
export const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
    const { colors } = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    if (categories.length === 0) {
        return null;
    }

    const renderItem = ({ item }: { item: Category }) => (
        <TouchableOpacity
            style={[styles.bannerCard, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('AllCategories', {
                categoryId: item.id,
                categoryName: item.name
            })}
            activeOpacity={0.8}
        >
            <ImageBackground
                source={{ uri: formatImageUrl(item.image) }}
                style={styles.backgroundImage}
                imageStyle={styles.imageRadius}
            >
                <View style={styles.overlay} />

                <View style={[styles.badgeContainer, { backgroundColor: colors.primary }]}>
                    <ThemeText style={[styles.badgeText, { color: colors.surface }]}>
                        {item.subcategory_count || 0} items
                    </ThemeText>
                </View>

                <View style={styles.textContainer}>
                    <ThemeText style={[styles.categoryName, { color: '#FFF' }]} numberOfLines={1}>
                        {item.name}
                    </ThemeText>
                    <View style={[styles.accentLine, { backgroundColor: colors.primary }]} />
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );

    const ViewAllCard = () => (
        <TouchableOpacity
            style={styles.simpleToggle}
            onPress={() => navigation.navigate('AllCategories' as any)}
            activeOpacity={0.7}
        >
            <Ionicons
                name="arrow-forward-circle"
                size={32}
                color={colors.primary}
            />
            <ThemeText style={[styles.simpleToggleText, { color: colors.primary }]}>
                More
            </ThemeText>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ThemeText style={styles.title}>
                    Explore Categories
                </ThemeText>
            </View>

            <FlatList
                data={categories.slice(0, 4)}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                snapToInterval={CARD_WIDTH + GAP}
                decelerationRate="fast"
                ListFooterComponent={ViewAllCard}
                pagingEnabled={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContent: {
        paddingHorizontal: 20,
        gap: GAP,
        paddingRight: 40,
    },
    bannerCard: {
        width: CARD_WIDTH,
        height: CARD_WIDTH * 1.5,
        borderRadius: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        overflow: 'hidden',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 5,
    },
    imageRadius: {
        borderRadius: 20,
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    badgeContainer: {
        alignSelf: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    textContainer: {
        alignItems: 'center',
        paddingBottom: 8,
    },
    categoryName: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    accentLine: {
        height: 3,
        width: 20,
        borderRadius: 2,
        marginTop: 6,
    },
    simpleToggle: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 20,
        width: 60,
        height: CARD_WIDTH * 1.5,
    },
    simpleToggleText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 4,
    },
});
