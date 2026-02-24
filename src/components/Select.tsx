import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList,
} from 'react-native';
import { SelectProps, } from '../utils/types';

const Select: React.FC<SelectProps> = ({
    label,
    placeholder = 'Select an option',
    options,
    value,
    onSelect,
    error,
    containerStyle,
    selectStyle,
    labelStyle,
    errorStyle,
    required = false,
    disabled = false,
}) => {
    const [isVisible, setIsVisible] = useState(false);

    const selectedOption = options.find((option) => option.value === value);

    const handleSelect = (selectedValue: string | number) => {
        onSelect(selectedValue);
        setIsVisible(false);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={[styles.label, labelStyle]}>
                    {label}
                    {required && <Text style={styles.required}> *</Text>}
                </Text>
            )}

            <TouchableOpacity
                style={[
                    styles.select,
                    error && styles.selectError,
                    disabled && styles.selectDisabled,
                    selectStyle,
                ]}
                onPress={() => !disabled && setIsVisible(true)}
                disabled={disabled}
            >
                <Text
                    style={[
                        styles.selectText,
                        !selectedOption && styles.selectPlaceholder,
                    ]}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>

            {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}

            <Modal
                visible={isVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {label || 'Select an option'}
                            </Text>
                            <TouchableOpacity onPress={() => setIsVisible(false)}>
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.option,
                                        item.value === value && styles.optionSelected,
                                    ]}
                                    onPress={() => handleSelect(item.value)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            item.value === value && styles.optionTextSelected,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                    {item.value === value && (
                                        <Text style={styles.checkmark}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    required: {
        color: '#F44336',
    },
    select: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    selectError: {
        borderColor: '#F44336',
    },
    selectDisabled: {
        backgroundColor: '#e0e0e0',
        opacity: 0.6,
    },
    selectText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    selectPlaceholder: {
        color: '#999',
    },
    arrow: {
        fontSize: 12,
        color: '#666',
        marginLeft: 8,
    },
    error: {
        fontSize: 12,
        color: '#F44336',
        marginTop: 4,
        marginLeft: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        width: '85%',
        maxHeight: '70%',
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        fontSize: 24,
        color: '#666',
        fontWeight: '300',
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    optionSelected: {
        backgroundColor: '#E3F2FD',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    optionTextSelected: {
        color: '#007AFF',
        fontWeight: '600',
    },
    checkmark: {
        fontSize: 18,
        color: '#007AFF',
        fontWeight: 'bold',
    },
});

export default Select;
