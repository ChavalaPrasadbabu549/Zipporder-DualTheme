import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../components';

export const Profile: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <View style={styles.info}>
                <Text>Name: User</Text>
                <Text>Email: user@example.com</Text>
            </View>
            <Button title="Logout" onPress={() => { }} style={styles.logoutBtn} />
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
    info: {
        marginBottom: 30,
    },
    logoutBtn: {
        backgroundColor: '#FF3B30',
    },
});
