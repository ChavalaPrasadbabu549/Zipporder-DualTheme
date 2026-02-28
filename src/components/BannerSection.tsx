import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useTheme } from '../context';
import ThemeText from './Text';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BannerItemProps } from '../utils/types';
import Video from 'react-native-video';
import { banners } from '../utils';

const { width } = Dimensions.get('window');
const GAP = 15;
const PADDING = 20;
const CARD_WIDTH = (width - (PADDING * 2) - GAP) / 2;

const BannerCard: React.FC<BannerItemProps> = ({ imageUrl, isVideo, title }) => {
    const { colors } = useTheme();
    const [paused, setPaused] = useState(true);

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface }]}
            onPress={() => isVideo && setPaused(!paused)}
            activeOpacity={0.9}
        >
            {isVideo ? (
                <Video
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    paused={paused}
                    repeat={true}
                    muted={false}
                    resizeMode="cover"
                />
            ) : (
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                />
            )}

            <View style={styles.overlay} />

            {isVideo && (
                <View style={[styles.videoTag, { backgroundColor: colors.primary }]}>
                    <Ionicons name={paused ? "play" : "pause"} size={12} color="#FFF" />
                    <ThemeText style={styles.videoText}>VIDEO</ThemeText>
                </View>
            )}

            {isVideo && paused && (
                <View style={styles.playIconContainer}>
                    <View style={styles.playCircle}>
                        <Ionicons name="play" size={24} color="#FFF" />
                    </View>
                </View>
            )}

            <View style={styles.textContainer}>
                <ThemeText style={[styles.bannerTitle, { color: colors.surface }]} numberOfLines={1}>{title}</ThemeText>
            </View>
        </TouchableOpacity>
    );
};

export const BannerSection: React.FC = () => {
    const { colors } = useTheme();
    const [showAll, setShowAll] = useState(false);

    if (!banners || banners.length === 0) {
        return null;
    }

    const renderItem = ({ item }: { item: BannerItemProps }) => (
        <BannerCard {...item} />
    );

    const ViewAllCard = () => (
        <TouchableOpacity
            style={styles.simpleToggle}
            onPress={() => setShowAll(!showAll)}
            activeOpacity={0.7}
        >
            <Ionicons
                name={showAll ? "arrow-back-circle" : "arrow-forward-circle"}
                size={34}
                color={colors.primary}
            />
            <ThemeText style={[styles.simpleToggleText, { color: colors.primary }]}>
                {showAll ? 'Less' : 'More'}
            </ThemeText>
        </TouchableOpacity>
    );

    return (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <ThemeText style={[styles.sectionTitle, { color: colors.text }]}>
                    {showAll ? 'All Promos & Offers' : 'Top Banners & Promos'}
                </ThemeText>
            </View>

            <FlatList
                data={showAll ? banners : banners.slice(0, 4)}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                snapToInterval={CARD_WIDTH + GAP}
                decelerationRate="fast"
                ListFooterComponent={ViewAllCard}
                removeClippedSubviews={true}
                initialNumToRender={4}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginVertical: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: PADDING,
        paddingRight: PADDING + GAP,
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_WIDTH * 1.5,
        borderRadius: 20,
        marginRight: GAP,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    videoTag: {
        position: 'absolute',
        top: 10,
        left: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 2,
    },
    videoText: {
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    playIconContainer: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    playCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    bannerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
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
