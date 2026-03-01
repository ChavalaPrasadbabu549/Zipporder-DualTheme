import { launchCamera, launchImageLibrary, Asset, ImagePickerResponse } from 'react-native-image-picker';
import { Platform, PermissionsAndroid, Alert, Linking, ToastAndroid } from 'react-native';

const showToast = (message: string) => {
    if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    }
};

export const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera Permission',
                    message: 'ZippOrder needs camera permission to take photos.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );

            if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                Alert.alert(
                    'Permission Blocked',
                    'You have permanently denied camera permissions. Please enable it in the App Settings to take photos.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() },
                    ]
                );
            }

            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    }
    return true;
};

export const takePhotoAction = async (onHandleImage: (asset: Asset) => void) => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result: ImagePickerResponse = await launchCamera({
        mediaType: 'photo',
        quality: 0.7,
        maxWidth: 1024,
        maxHeight: 1024,
    });

    if (result.didCancel) {
        showToast('Camera cancelled');
    } else if (result.errorCode) {
        showToast(`Camera Error: ${result.errorMessage}`);
    } else if (result.assets && result.assets.length > 0) {
        showToast('Photo captured successfully');
        onHandleImage(result.assets[0]);
    }
};

export const pickFromGalleryAction = async (onHandleImage: (asset: Asset) => void) => {
    const result: ImagePickerResponse = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.7,
        maxWidth: 1024,
        maxHeight: 1024,
    });

    if (result.didCancel) {
        showToast('Gallery cancelled');
    } else if (result.errorCode) {
        showToast(`Gallery Error: ${result.errorMessage}`);
    } else if (result.assets && result.assets.length > 0) {
        showToast('Image selected successfully');
        onHandleImage(result.assets[0]);
    }
};
