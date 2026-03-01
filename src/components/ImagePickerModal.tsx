import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context';
import { ThemeText } from './index';
import { ImagePickerModalProps } from '../utils/types';



const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
    visible,
    onClose,
    onTakePhoto,
    onPickGallery,
}) => {
    const { colors } = useTheme();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <View style={styles.modalOverlay}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                    <View style={styles.modalHeader}>
                        <ThemeText style={[styles.modalTitle, { color: colors.text }]}>Select Profile Picture</ThemeText>
                        <TouchableOpacity
                            style={[styles.closeIconButton, { backgroundColor: colors.primary + '15' }]}
                            onPress={onClose}
                        >
                            <Ionicons name="close" size={22} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.pickerOption} onPress={onTakePhoto}>
                        <Ionicons name="camera" size={20} color={colors.primary} />
                        <ThemeText style={[styles.pickerOptionText, { color: colors.text }]}>Take Photo</ThemeText>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.pickerOption, { borderBottomWidth: 0 }]} onPress={onPickGallery}>
                        <Ionicons name="image" size={20} color={colors.primary} />
                        <ThemeText style={[styles.pickerOptionText, { color: colors.text }]}>Choose from Gallery</ThemeText>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: 'Inter-Medium',
        fontWeight: 'bold',
        marginBottom: 0,
    },
    closeIconButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    pickerOptionText: {
        fontSize: 14,
        lineHeight: 16,
        fontFamily: 'Inter-Medium',
        marginLeft: 15,
        fontWeight: '500',
    },
});

export default ImagePickerModal;
