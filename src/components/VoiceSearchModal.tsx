import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Animated,
    Dimensions,
    PermissionsAndroid,
    Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context';
import Voice from '@react-native-voice/voice';
import { VoiceSearchModalProps } from '../utils/types';

const { width, height } = Dimensions.get('window');
const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ visible, onClose, onSpeechResult }) => {
    const { colors } = useTheme();
    const [isListening, setIsListening] = useState(false);
    const [partialResult, setPartialResult] = useState('');
    const [pulseAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        Voice.onSpeechStart = () => setIsListening(true);
        Voice.onSpeechEnd = () => setIsListening(false);
        Voice.onSpeechPartialResults = (e: any) => {
            if (e.value && e.value.length > 0) {
                setPartialResult(e.value[0]);
            }
        };
        Voice.onSpeechResults = (e: any) => {
            if (e.value && e.value.length > 0) {
                onSpeechResult(e.value[0]);
                onClose();
            }
        };
        Voice.onSpeechError = (e: any) => {
            console.error('Speech Error:', e);
            setIsListening(false);
        };

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    useEffect(() => {
        if (visible) {
            startListening();
        } else {
            stopListening();
        }
    }, [visible]);

    useEffect(() => {
        if (isListening) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isListening]);

    const startListening = async () => {
        setPartialResult('');
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    {
                        title: 'Microphone Permission',
                        message: 'Speech recognition needs access to your microphone.',
                        buttonPositive: 'OK',
                    }
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.warn('Microphone permission denied');
                    return;
                }
            }
            if (Voice) {
                const isAvailable = await Voice.isAvailable();
                if (!isAvailable) {
                    console.warn('Speech recognition engine not available');
                    return;
                }
                await Voice.start('en-US');
            } else {
                console.error('Voice module import failed');
            }
        } catch (e) {
            console.error('Voice Start Error:', e);
            setIsListening(false);
        }
    };

    const stopListening = async () => {
        try {
            await Voice.stop();
            setIsListening(false);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>

                    <Text style={[styles.title, { color: colors.text }]}>
                        {isListening ? 'Listening...' : 'Hold on...'}
                    </Text>

                    <Animated.View
                        style={[
                            styles.micButton,
                            {
                                backgroundColor: colors.primary,
                                transform: [{ scale: pulseAnim }],
                            },
                        ]}
                    >
                        <Ionicons name="mic" size={40} color="#fff" />
                    </Animated.View>

                    <Text style={[styles.partialText, { color: colors.textSecondary }]}>
                        {partialResult || 'Say the name of a product...'}
                    </Text>

                    {isListening && (
                        <TouchableOpacity
                            style={[styles.stopButton, { borderColor: colors.primary }]}
                            onPress={stopListening}
                        >
                            <Text style={[styles.stopButtonText, { color: colors.primary }]}>Stop</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
        alignItems: 'center',
        minHeight: height * 0.4,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        padding: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 40,
        fontFamily: 'Inter-Bold',
    },
    micButton: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        marginBottom: 30,
    },
    partialText: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'Inter-Medium',
        marginBottom: 30,
        minHeight: 50,
        paddingHorizontal: 20,
    },
    stopButton: {
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 1.5,
    },
    stopButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
    },
});

export default VoiceSearchModal;
