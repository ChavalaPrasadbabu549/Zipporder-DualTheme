import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeText } from './';
import { useTheme } from '../context';
import { CategoryCardProps } from '../utils/types';
import { formatImageUrl } from '../utils';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const SMALL_CARD_WIDTH = width * 0.48;

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress, size = 'large' }) => {
    const { colors } = useTheme();
    const imageUrl = formatImageUrl(category.image);
    const isSmall = size === 'small';

    return (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    backgroundColor: colors.surface,
                    borderRightColor: colors.border,
                    width: isSmall ? SMALL_CARD_WIDTH : CARD_WIDTH,
                    padding: isSmall ? 12 : 16,
                }
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.header, isSmall && { marginBottom: 8 }]}>
                <View style={[
                    styles.imageContainer,
                    { borderColor: colors.border },
                    isSmall ? { width: 44, height: 44, borderRadius: 10 } : { width: 64, height: 64, borderRadius: 14 }
                ]}>
                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={[styles.letterContainer, { backgroundColor: colors.primary + '15' }]}>
                            <ThemeText style={[styles.letter, { color: colors.primary, fontSize: isSmall ? 18 : 24 }]}>
                                {category.name.charAt(0).toUpperCase()}
                            </ThemeText>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.content}>
                <ThemeText style={[styles.name, isSmall && { fontSize: 14 }]} numberOfLines={1}>
                    {category.name}
                </ThemeText>
                {!isSmall && (
                    <ThemeText style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
                        {category.description || 'Premium selection of products'}
                    </ThemeText>
                )}

                <View style={[styles.footer, isSmall && { marginTop: 8 }]}>
                    <View style={styles.metaItem}>
                        <Ionicons name="list-outline" size={isSmall ? 12 : 14} color={colors.textSecondary} />
                        <ThemeText style={[styles.metaText, { color: colors.textSecondary, fontSize: isSmall ? 10 : 12 }]}>
                            {category.subcategory_count} {isSmall ? 'Sub' : 'Subcategories'}
                        </ThemeText>
                    </View>
                    {!isSmall && (
                        <ThemeText style={[styles.timeAgo, { color: colors.textSecondary }]}>
                            Newest
                        </ThemeText>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        borderRadius: 16,
        padding: 16,
        marginRight: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    header: {
        marginBottom: 12,
    },
    imageContainer: {
        width: 64,
        height: 64,
        borderRadius: 14,
        borderWidth: 1,
        padding: 6,
        backgroundColor: '#FCFCFC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    letterContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    letter: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        marginLeft: 4,
    },
    timeAgo: {
        fontSize: 12,
    },
});
