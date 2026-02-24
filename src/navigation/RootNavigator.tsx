import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { TabNavigator } from './TabNavigator';
import { RootStackParamList } from './navigation';
import { useAppSelector, useAppDispatch } from '../hooks';
import { initializeAuth } from '../store/slices/authSlice';
import { Loading } from '../components';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
    const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(initializeAuth());
    }, [dispatch]);

    if (loading && !isAuthenticated) {
        return <Loading />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
                <Stack.Screen name="Main" component={TabNavigator} />
            ) : (
                <Stack.Screen name="Auth" component={AuthNavigator} />
            )}
        </Stack.Navigator>
    );
};
