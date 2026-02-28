import React from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { useTheme } from '../context';
import { OFFERS } from '../utils/helpers';
import ThemeText from './Text';
import { OfferCardProps } from '../utils/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 60;
const GAP = 15;
const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    return (
        <View
            style={[
                styles.offerCard,
                { backgroundColor: offer.color },
            ]}>
            <View style={styles.offerTextContainer}>
                <Text style={styles.offerTitle}>{offer.title}</Text>
                <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>
                <TouchableOpacity
                    style={styles.shopNowButton}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('AllCategories' as any)}
                >
                    <Text style={[styles.shopNowText, { color: offer.color }]}>
                        Shop Now
                    </Text>
                </TouchableOpacity>
            </View>
            <Image source={{ uri: offer.image }} style={styles.offerImage} />
        </View>
    );
};

export const OfferSection: React.FC = () => {
    const { colors } = useTheme();

    if (!OFFERS || OFFERS.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ThemeText style={styles.title}>Special Offers</ThemeText>
            </View>

            <FlatList
                data={OFFERS}
                renderItem={({ item }) => <OfferCard offer={item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                snapToInterval={CARD_WIDTH + GAP}
                decelerationRate="fast"
                pagingEnabled={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContent: {
        paddingHorizontal: 20,
        gap: GAP,
    },
    offerCard: {
        width: CARD_WIDTH,
        height: 150,
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    offerTextContainer: {
        flex: 1,
        justifyContent: 'center',
        zIndex: 1,
    },
    offerTitle: {
        color: '#fff',
        fontSize: 26,
        fontWeight: '900',
    },
    offerSubtitle: {
        color: 'rgba(255,255,255,0.95)',
        fontSize: 14,
        marginBottom: 15,
        fontWeight: '600',
    },
    shopNowButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 25,
        alignSelf: 'flex-start',
    },
    shopNowText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    offerImage: {
        position: 'absolute',
        right: -10,
        bottom: -15,
        width: 150,
        height: 150,
        borderRadius: 75,
        opacity: 0.9,
    },
});
