import React from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    Dimensions,
    StatusBar,
    TouchableOpacity,
    Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/navigation';
import { useTheme } from '../context';
import { ThemeText, Button } from '../components';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
type WelcomeScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
interface WelcomeScreenProps {
    navigation: WelcomeScreenNavigationProp;
}
const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <ImageBackground
                source={require('../asssets/auth_bg.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.overlay} />

                <View style={styles.content}>
                    <View style={styles.logoSection}>
                        {/* <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
                            <Ionicons name="cart" size={40} color="#fff" />
                        </View> */}
                        <Image source={require('../asssets/app-logo.png')} style={styles.logoIcon} />
                        <ThemeText style={[styles.appName, { color: colors.surface }]}>ZippOrder</ThemeText>
                    </View>

                    <View style={styles.textSection}>
                        <ThemeText style={[styles.title, { color: colors.surface }]}>All Your Needs, Delivered Fast</ThemeText>
                        <ThemeText style={[styles.subtitle, { color: colors.surface }]}>
                            Experience the fastest delivery service for your daily essentials and favorite products.
                        </ThemeText>
                    </View>

                    <View style={styles.buttonSection}>
                        <Button
                            title="Get Started"
                            onPress={() => navigation.navigate('Login')}
                            rightIcon={<Ionicons name="arrow-forward" size={20} color={colors.surface} />}
                        />

                        <View style={styles.footer}>
                            <ThemeText style={[styles.footerText, { color: colors.surface }]}>Already have an account? </ThemeText>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <ThemeText style={[styles.footerLink, { color: colors.primary }]}>Login</ThemeText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        width: width,
        height: height,
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'space-between',
        paddingTop: height * 0.15,
        paddingBottom: 50,
    },
    logoSection: {
        alignItems: 'center',
    },
    logoIcon: {
        width: 80,
        height: 80,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    appName: {
        fontSize: 36,
        fontWeight: '900',
        fontFamily: 'Inter-Bold',
    },
    textSection: {
        marginTop: 50,
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        fontFamily: 'Inter-Bold',
        lineHeight: 52,
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
    },
    buttonSection: {
        width: '100%',
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    footerText: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
    },
    footerLink: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '800',
        fontFamily: 'Inter-Bold',
    },
});

export default WelcomeScreen;
