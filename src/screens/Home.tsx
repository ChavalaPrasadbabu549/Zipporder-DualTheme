import React, { useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchCategories } from '../store/slices/catalogSlice';
import { ThemeText, ThemedSafeAreaView, Loading, CategorySection, BannerSection, OfferSection } from '../components';
import { useTheme } from '../context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation';


export const Home: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useAppDispatch();
    const { categories, loading } = useAppSelector((state) => state.catalog);
    const { colors } = useTheme();

    useEffect(() => {
        dispatch(fetchCategories({}));
    }, [dispatch]);

    const onRefresh = React.useCallback(() => {
        dispatch(fetchCategories({}));
    }, [dispatch]);

    if (loading && categories.length === 0) {
        return <Loading />;
    }

    return (
        <ThemedSafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={onRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
            >
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View>
                            <ThemeText style={styles.greeting}>Hello there!</ThemeText>
                            <ThemeText style={styles.title}>Welcome to Zipporder</ThemeText>
                        </View>
                        <TouchableOpacity
                            style={[styles.profileButton, { backgroundColor: colors.primary + '15' }]}
                            onPress={() => navigation.navigate('Profile' as any)}
                        >
                            <Ionicons name="person" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Banner & Promo Section */}
                <BannerSection />

                {/* Special Offers Section */}
                <OfferSection />

                {/* Category Section */}
                <CategorySection categories={categories} />

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
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
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
