import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './navigation';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import WelcomeScreen from '../screens/Welcome';
import ForgotPasswordScreen from '../screens/ForgotPassword';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
    );
};
