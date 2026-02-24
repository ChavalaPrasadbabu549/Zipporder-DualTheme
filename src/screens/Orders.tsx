import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card } from '../components';

export const Orders: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Orders</Text>
            <FlatList
                data={[]}
                renderItem={null}
                ListEmptyComponent={<Text>No orders yet.</Text>}
            />
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
