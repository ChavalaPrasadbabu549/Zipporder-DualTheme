import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Dimensions,
    ActivityIndicator,
    Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context';
import { Header, Input, ThemeText, ThemedSafeAreaView } from '../components';
import axios from 'axios';
import Config from 'react-native-config';
import api from '../utils/api';
import { Keyboard } from 'react-native';

const { width } = Dimensions.get('window');

const ActionButton = ({ icon, title, subtitle, onPress, colors }: any) => (
    <TouchableOpacity
        style={[styles.actionButton, { borderColor: colors.border }]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={styles.actionIconContainer}>
            <Ionicons name={icon} size={24} color={colors.primary} />
        </View>
        <ThemeText style={styles.actionTitle}>{title}</ThemeText>
        <ThemeText style={styles.actionSubtitle}>{subtitle}</ThemeText>
    </TouchableOpacity>
);

const AddressItem = ({ icon, title, address, distance, selected, colors }: any) => (
    <TouchableOpacity style={styles.addressItem} activeOpacity={0.7}>
        <View style={styles.addressLeft}>
            <View style={[styles.savedIconContainer, { backgroundColor: colors.surface }]}>
                <Ionicons name={icon} size={20} color={colors.textSecondary} />
                <ThemeText style={styles.distanceText}>{distance}</ThemeText>
            </View>
        </View>
        <View style={styles.addressMiddle}>
            <View style={styles.addressTitleRow}>
                <ThemeText style={styles.addressTitle}>{title}</ThemeText>
                {selected && (
                    <View style={styles.selectedBadge}>
                        <ThemeText style={styles.selectedText}>SELECTED</ThemeText>
                    </View>
                )}
            </View>
            <ThemeText style={styles.addressFull} numberOfLines={2}>
                {address}
            </ThemeText>
        </View>
        <TouchableOpacity style={styles.moreIcon}>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
        </TouchableOpacity>
    </TouchableOpacity>
);

export const SelectLocation = () => {
    const navigation = useNavigation<any>();
    const { colors } = useTheme();
    const [search, setSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [predictions, setPredictions] = useState<any[]>([]);
    const [showPredictions, setShowPredictions] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Form state for new address
    const [formData, setFormData] = useState({
        location: '',
        latitude: '',
        longitude: '',
        city: '',
        label: 'Home',
        full_name: '',
        phone: '',
        address_line1: '',
        zip_code: '',
        state: 'Telangana',
        country: 'India'
    });

    const googleApiId = Config.GOGGLE_API;

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Location Search Logic
    const handleLocationInput = async (text: string) => {
        setSearch(text);
        if (text.length > 2) {
            setIsSearching(true);
            try {
                const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
                    {
                        params: {
                            input: text,
                            key: googleApiId,
                            language: 'en',
                        },
                    }
                );

                if (response.data.status === 'OK') {
                    setPredictions(response.data.predictions);
                    setShowPredictions(true);
                } else {
                    setPredictions([]);
                    setShowPredictions(false);
                }
            } catch (error) {
                console.error('Error fetching predictions:', error);
            } finally {
                setIsSearching(false);
            }
        } else {
            setPredictions([]);
            setShowPredictions(false);
        }
    };

    const handleSelectPrediction = async (placeId: string) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/details/json`,
                {
                    params: {
                        place_id: placeId,
                        fields: 'formatted_address,geometry,address_components',
                        key: googleApiId,
                    },
                }
            );

            if (response.data.status === 'OK') {
                const result = response.data.result;
                const { lat, lng } = result.geometry.location;

                let city = '';
                result.address_components.forEach((comp: any) => {
                    if (comp.types.includes('locality')) {
                        city = comp.long_name;
                    }
                });

                if (!city) {
                    result.address_components.forEach((comp: any) => {
                        if (comp.types.includes('administrative_area_level_2')) {
                            city = comp.long_name;
                        }
                    });
                }
                if (!city) {
                    result.address_components.forEach((comp: any) => {
                        if (comp.types.includes('administrative_area_level_1')) {
                            city = comp.long_name;
                        }
                    });
                }

                handleInputChange('location', result.formatted_address);
                handleInputChange('address_line1', result.formatted_address);
                handleInputChange('latitude', lat.toString());
                handleInputChange('longitude', lng.toString());
                handleInputChange('city', city);

                setSearch(result.formatted_address);
                setPredictions([]);
                setShowPredictions(false);
                Keyboard.dismiss();
            }
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    };

    const fetchSavedAddresses = async () => {
        setLoading(true);
        try {
            const response = await api.get('/address');
            setSavedAddresses(response.data.userAddresses || []);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async () => {
        setLoading(true);
        try {
            const response = await api.post('/address', {
                label: formData.label,
                full_name: formData.full_name,
                phone: formData.phone,
                address_line1: formData.address_line1,
                address_line2: '',
                landmark: '',
                latitude: formData.latitude,
                longitude: formData.longitude,
                city: formData.city,
                state: formData.state,
                zip_code: formData.zip_code,
                country: formData.country,
                is_default: true
            });
            if (response.data.success) {
                fetchSavedAddresses();
                Alert.alert('Success', 'Address added successfully');
            }
        } catch (error) {
            console.error('Error adding address:', error);
            Alert.alert('Error', 'Failed to add address');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedAddresses();
    }, []);

    return (
        <ThemedSafeAreaView style={styles.container}>

            <Header
                title="Select Your Location"
                onBack={() => navigation.goBack()}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                <View style={styles.searchContainer}>
                    <Input
                        placeholder="Search an area or address"
                        containerStyle={styles.searchInputContainer}
                        inputStyle={styles.searchInput}
                        value={search}
                        onChangeText={handleLocationInput}
                        leftIcon={
                            <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
                        }
                        rightIcon={
                            <View style={styles.searchRightIcons}>
                                {search.length > 0 && (
                                    <TouchableOpacity onPress={() => setSearch('')}>
                                        <Ionicons name="close-circle" size={20} color={colors.text} />
                                    </TouchableOpacity>
                                )}
                                <View style={styles.divider} />
                                <Ionicons name="mic-outline" size={20} color={colors.primary} />
                            </View>
                        }
                    />

                    {/* Predictions List */}
                    {showPredictions && predictions.length > 0 && (
                        <View style={[styles.predictionsContainer, { backgroundColor: colors.surface }]}>
                            {predictions.map((p, index) => (
                                <TouchableOpacity
                                    key={p.place_id}
                                    style={[styles.predictionItem, index !== predictions.length - 1 && styles.predictionDivider]}
                                    onPress={() => handleSelectPrediction(p.place_id)}
                                >
                                    <View style={[styles.predictionIconBg, { backgroundColor: colors.surface }]}>
                                        <Ionicons name="location-outline" size={18} color={colors.primary} />
                                    </View>
                                    <View style={styles.predictionInfo}>
                                        <ThemeText style={styles.predictionTitle} numberOfLines={1}>
                                            {p.structured_formatting?.main_text || p.description}
                                        </ThemeText>
                                        <ThemeText style={styles.predictionSub} numberOfLines={1}>
                                            {p.structured_formatting?.secondary_text || ''}
                                        </ThemeText>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Quick Actions */}
                <View style={styles.actionsRow}>
                    <ActionButton
                        icon="locate-outline"
                        title="Use Current"
                        subtitle="Location"
                        colors={colors}
                    />
                    <ActionButton
                        icon="add-circle-outline"
                        title="Add New"
                        subtitle="Address"
                        colors={colors}
                        onPress={handleAddAddress}
                    />
                    <ActionButton
                        icon="logo-whatsapp"
                        title="Request"
                        subtitle="Address"
                        colors={colors}
                    />
                </View>

                {/* Saved Addresses */}
                <View style={styles.section}>
                    <ThemeText style={styles.sectionTitle}>SAVED ADDRESSES</ThemeText>
                    <View style={styles.addressCard}>
                        {loading && savedAddresses.length === 0 ? (
                            <ActivityIndicator style={{ padding: 20 }} color={colors.primary} />
                        ) : savedAddresses.length > 0 ? (
                            savedAddresses.map((addr, index) => (
                                <React.Fragment key={addr.id}>
                                    <AddressItem
                                        icon={addr.label?.toLowerCase().includes('home') ? "home-outline" : "briefcase-outline"}
                                        title={addr.label || 'Other'}
                                        selected={addr.is_default}
                                        distance="" // Distance needs calculated if available
                                        address={`${addr.address_line1}, ${addr.city}`}
                                        colors={colors}
                                    />
                                    {index !== savedAddresses.length - 1 && (
                                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <View style={{ padding: 20, alignItems: 'center' }}>
                                <ThemeText style={{ opacity: 0.5 }}>No saved addresses found</ThemeText>
                            </View>
                        )}

                        <TouchableOpacity style={styles.viewAllBtn}>
                            <ThemeText style={styles.viewAllText}>View all</ThemeText>
                            <Ionicons name="chevron-down" size={18} color="#FF004D" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recently Searched */}
                <View style={styles.section}>
                    <ThemeText style={styles.sectionTitle}>RECENTLY SEARCHED</ThemeText>
                    <TouchableOpacity style={styles.addressCard} activeOpacity={0.7}>
                        <View style={styles.recentItem}>
                            <View style={styles.recentIconContainer}>
                                <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
                                <ThemeText style={styles.distanceText}>7.4 km</ThemeText>
                            </View>
                            <View style={styles.recentInfo}>
                                <ThemeText style={styles.recentTitle}>Patrika Nagar</ThemeText>
                                <ThemeText style={styles.recentSub}>Patrika Nagar, Hitec City, Hyderabad, Telangana 500081, India</ThemeText>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ThemedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 30,
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
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    actionButton: {
        width: (width - 32 - 20) / 3,
        borderWidth: 1,
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
    },
    actionIconContainer: {
        marginBottom: 8,
    },
    actionTitle: {
        fontSize: 12,
        fontWeight: '700',
        lineHeight: 14,
    },
    actionSubtitle: {
        fontSize: 12,
        fontWeight: '700',
        lineHeight: 14,
    },
    section: {
        marginTop: 32,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '900',
        opacity: 0.5,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    addressCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    addressItem: {
        flexDirection: 'row',
        padding: 16,
    },
    addressLeft: {
        width: 50,
        alignItems: 'center',
    },
    savedIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    distanceText: {
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 2,
    },
    addressMiddle: {
        flex: 1,
        marginLeft: 12,
    },
    addressTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    addressTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    selectedBadge: {
        backgroundColor: '#d1fae5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginLeft: 8,
    },
    selectedText: {
        color: '#10b981',
        fontSize: 10,
        fontWeight: '900',
    },
    addressFull: {
        fontSize: 14,
        opacity: 0.6,
        lineHeight: 20,
    },
    moreIcon: {
        padding: 4,
    },
    divider: {
        height: 1,
        marginHorizontal: 16,
    },
    viewAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    viewAllText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FF004D',
        marginRight: 4,
    },
    recentItem: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    recentIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    recentInfo: {
        flex: 1,
    },
    recentTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    recentSub: {
        fontSize: 14,
        opacity: 0.6,
    },
    predictionsContainer: {
        borderRadius: 12,
        marginTop: 5,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        zIndex: 1000,
    },
    predictionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 15,
    },
    predictionIconBg: {
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    predictionInfo: {
        flex: 1,
    },
    predictionTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    predictionSub: {
        fontSize: 12,
        opacity: 0.5,
        marginTop: 2,
    },
    predictionDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
});
