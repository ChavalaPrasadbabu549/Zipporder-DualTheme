import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import ThemeText from './Text';
import { HeaderProps } from '../utils/types';


const Header: React.FC<HeaderProps> = ({
    title,
    subtitle,
    showBackButton = true,
    onBack,
    rightComponent
}) => {
    const navigation = useNavigation();
    const { colors } = useTheme();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigation.goBack();
        }
    };

    return (
        <View style={styles.header}>
            <View style={styles.leftContainer}>
                {showBackButton && (
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.titleContainer}>
                <ThemeText style={styles.headerTitle}>{title}</ThemeText>
                {subtitle && <ThemeText style={styles.subtitleText}>{subtitle}</ThemeText>}
            </View>
            <View style={styles.rightContainer}>
                {rightComponent ? rightComponent : <View style={{ width: 32 }} />}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    leftContainer: {
        width: 50,
        alignItems: 'flex-start',
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    rightContainer: {
        width: 50,
        alignItems: 'flex-end',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        fontFamily: 'Inter-Medium',
    },
    subtitleText: {
        fontSize: 14,
        opacity: 0.5,
        fontFamily: 'Inter-Regular',
    },
});

export default Header;
