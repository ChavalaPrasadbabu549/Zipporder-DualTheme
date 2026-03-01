import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchCategories, fetchProducts } from '../store/slices/catalogSlice';
import { ThemeText, ThemedSafeAreaView, Loading, CategorySection, BannerSection, OfferSection, Input, VoiceSearchModal } from '../components';
import { useTheme } from '../context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation';
import { formatImageUrl } from '../utils/helpers';


export const Home: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useAppDispatch();
    const { categories, products, loading } = useAppSelector((state) => state.catalog);
    const { user } = useAppSelector((state) => state.auth);
    const { colors } = useTheme();
    const [search, setSearch] = useState('');
    const [showVoiceSearch, setShowVoiceSearch] = useState(false);

    useEffect(() => {
        dispatch(fetchCategories({}));
        dispatch(fetchProducts({ limit: 100 }));
    }, [dispatch]);

    const onRefresh = React.useCallback(() => {
        dispatch(fetchCategories({}));
        dispatch(fetchProducts({ limit: 100 }));
    }, [dispatch]);

    const filteredSuggestions = search.trim().length > 0
        ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 10)
        : [];

    if (loading && categories.length === 0) {
        return <Loading />;
    }

    return (
        <ThemedSafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[0]}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={onRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
            >
                <View style={[styles.header, { backgroundColor: colors.background }]}>
                    <View style={styles.headerTop}>
                        <View style={styles.logoAndLocation}>
                            <View style={styles.logoContainer}>
                                {/* <ThemeText style={styles.logoText}>Z</ThemeText> */}
                                <Image source={require('../asssets/app-logo.png')} style={styles.logoIcon} />
                            </View>
                            <TouchableOpacity
                                style={styles.locationContainer}
                                activeOpacity={0.7}
                                onPress={() => navigation.navigate('SelectLocation' as any)}
                            >
                                <View style={styles.locationInfo}>
                                    <View style={styles.locationLabelRow}>
                                        <ThemeText style={styles.locationTitle}>Home</ThemeText>
                                        <Ionicons name="chevron-down" size={14} color={colors.text} style={styles.chevronIcon} />
                                    </View>
                                    <ThemeText style={styles.locationAddress} numberOfLines={1}>
                                        KPHB Colony, Hyderabad 500072
                                    </ThemeText>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={[styles.profileButton, { backgroundColor: colors.primary + '15' }]}
                            onPress={() => navigation.navigate('Profile' as any)}
                        >
                            {user?.profile_picture ? (
                                <Image
                                    source={{ uri: formatImageUrl(user.profile_picture) }}
                                    style={styles.profileImage}
                                />
                            ) : (
                                <Ionicons name="person-outline" size={22} color={colors.primary} />
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <Input
                            placeholder="Search for 'Cakes' or 'Pizza'"
                            editable={true}
                            value={search}
                            onChangeText={setSearch}
                            containerStyle={styles.searchInputContainer}
                            inputStyle={styles.searchInput}
                            leftIcon={
                                <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
                            }
                            rightIcon={
                                <View style={styles.searchRightIcons}>
                                    {search.length > 0 && (
                                        <TouchableOpacity onPress={() => setSearch('')}>
                                            <Ionicons name="close-outline" size={20} color={colors.text} />
                                        </TouchableOpacity>
                                    )}
                                    <View style={styles.divider} />
                                    <TouchableOpacity onPress={() => setShowVoiceSearch(true)}>
                                        <Ionicons name="mic-outline" size={20} color={colors.primary} />
                                    </TouchableOpacity>
                                </View>
                            }
                        />
                    </View>
                </View>

                {/* Search Suggestions Overlay/List */}
                {search.trim().length > 0 && (
                    <View style={[styles.suggestionsWrapper, { backgroundColor: colors.background }]}>
                        {filteredSuggestions.length > 0 ? (
                            filteredSuggestions.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.suggestionItem, { borderBottomColor: colors.border }]}
                                    onPress={() => {
                                        setSearch('');
                                        navigation.navigate('ProductDetail', { productId: item.id });
                                    }}
                                >
                                    <Ionicons name="search-outline" size={18} color={colors.textSecondary} style={styles.suggestionIcon} />
                                    <View style={styles.suggestionTextContainer}>
                                        <ThemeText style={styles.suggestionName}>{item.name}</ThemeText>
                                        <ThemeText style={styles.suggestionCategory}>in {item.category?.name || 'General'}</ThemeText>
                                    </View>
                                    <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.noResultContainer}>
                                <ThemeText style={styles.noResultText}>No products found for "{search}"</ThemeText>
                            </View>
                        )}
                    </View>
                )}

                {!search && (
                    <>
                        {/* Banner & Promo Section */}
                        <BannerSection />

                        {/* Special Offers Section */}
                        <OfferSection />

                        {/* Category Section */}
                        <CategorySection categories={categories} />
                    </>
                )}

            </ScrollView>

            {/* Voice Search Modal */}
            <VoiceSearchModal
                visible={showVoiceSearch}
                onClose={() => setShowVoiceSearch(false)}
                onSpeechResult={(text) => {
                    setSearch(text);
                    setShowVoiceSearch(false);
                }}
            />
        </ThemedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 15,
        paddingHorizontal: 16,
        paddingBottom: 5,
        zIndex: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    logoAndLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    logoContainer: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#FF004D',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    // logoText: {
    //     color: '#FFF',
    //     fontSize: 22,
    //     fontWeight: '900',
    // },
    logoIcon: {
        width: 30,
        height: 30,
        borderRadius: 12,
        resizeMode: 'contain',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 15,
    },
    locationInfo: {
        flex: 1,
    },
    locationLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationTitle: {
        fontSize: 16,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    chevronIcon: {
        marginLeft: 4,
        opacity: 0.6,
    },
    locationAddress: {
        fontSize: 13,
        opacity: 0.6,
        marginTop: 1,
    },
    profileButton: {
        width: 42,
        height: 42,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 21,
    },
    searchContainer: {
        marginTop: 5,
    },
    searchInputContainer: {
        marginBottom: 8,
    },
    searchInput: {
        fontSize: 14,
    },
    searchRightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: '#ccc',
        marginHorizontal: 10,
        opacity: 0.5,
    },
    suggestionsWrapper: {
        paddingHorizontal: 16,
        minHeight: 300,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    suggestionIcon: {
        marginRight: 12,
    },
    suggestionTextContainer: {
        flex: 1,
    },
    suggestionName: {
        fontSize: 15,
        fontWeight: '600',
    },
    suggestionCategory: {
        fontSize: 12,
        opacity: 0.5,
        marginTop: 2,
    },
    noResultContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    noResultText: {
        opacity: 0.5,
        fontSize: 14,
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
});
