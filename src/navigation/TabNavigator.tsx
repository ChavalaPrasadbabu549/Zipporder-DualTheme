import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, BakerySelection, AllCategories, DecorationScreen, BeveragesScreen } from '../screens';
import { MainTabParamList } from './navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const TabNavigator: React.FC = () => {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = '';

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Bakery') {
                        iconName = focused ? 'pizza' : 'pizza-outline';
                    } else if (route.name === 'Categories') {
                        iconName = focused ? 'folder' : 'folder-outline';
                    } else if (route.name === 'Decoration') {
                        iconName = focused ? 'sparkles' : 'sparkles-outline';
                    } else if (route.name === 'Beverages') {
                        iconName = focused ? 'wine' : 'wine-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    height: 60,
                    paddingBottom: 8,
                },
                headerStyle: {
                    backgroundColor: colors.primary,
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            })}
        >
            <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Tab.Screen name="Bakery" component={BakerySelection} options={{ headerShown: false }} />
            <Tab.Screen name="Categories" component={AllCategories} options={{ headerShown: false }} />
            <Tab.Screen name="Decoration" component={DecorationScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Beverages" component={BeveragesScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};
