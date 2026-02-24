import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../components';

export const Home: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home</Text>
            <Card>
                <Text>Welcome to Zipporder!</Text>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F8F9FA',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
});
