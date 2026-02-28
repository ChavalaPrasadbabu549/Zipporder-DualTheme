import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context';
import ThemeText from './Text';
import { SegmentedTabsProps } from '../utils/types';

export const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
    options,
    activeTab,
    onTabChange,
    containerStyle
}) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.tabsContainer, { backgroundColor: colors.surface }, containerStyle]}>
            {options.map((option) => {
                const isActive = activeTab === option.value;
                return (
                    <TouchableOpacity
                        key={option.value}
                        onPress={() => onTabChange(option.value)}
                        style={[
                            styles.tab,
                            isActive && { backgroundColor: colors.primary }
                        ]}
                        activeOpacity={0.8}
                    >
                        <ThemeText style={[
                            styles.tabText,
                            isActive ? { color: '#FFF' } : { color: colors.text + '80' }
                        ]}>
                            {option.label}
                        </ThemeText>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabsContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 4,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
    },
    tabText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});
