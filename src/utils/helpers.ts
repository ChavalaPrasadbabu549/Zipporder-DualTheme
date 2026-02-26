import Config from "react-native-config";

// Format image URL
export const formatImageUrl = (imageStr: string) => {
    if (!imageStr) return null;

    const baseUrl = Config.IMAGE_BASE_URL || '';

    let path = imageStr;

    if (path.startsWith('{') || path.includes('{"')) {
        path = path.replace(/[{}"]/g, '').replace(/\\/g, '');
    }

    path = path.replace(/^"|"$/g, '');

    const fullUrl = path.startsWith('http') ? path : `${baseUrl}${path}`;
    return fullUrl;
};

// Format currency
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount);
};

// Format date
export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-IN');
};

// Format phone number
export const formatPhone = (phone: string): string => {
    return phone.replace(/(\d{5})(\d{5})/, '$1-$2');
};

