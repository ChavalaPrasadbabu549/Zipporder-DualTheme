import Config from "react-native-config";

// Format image URL
export const formatImageUrl = (imageStr: string): string | undefined => {
    if (!imageStr) return undefined;

    const baseUrl = Config.IMAGE_BASE_URL || Config.BASE_API_URL || Config.BASE_URL || '';

    let path = imageStr;

    if (path.startsWith('{') || path.includes('{"')) {
        path = path.replace(/[{}"]/g, '').replace(/\\/g, '');
    }

    path = path.replace(/^"|"$/g, '');

    if (path.startsWith('http')) return path;

    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${cleanBaseUrl}${cleanPath}`;
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


export const banners = [
    {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
        title: 'Healthy Bowls',
    },
    {
        id: '2',
        imageUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        isVideo: true,
        title: 'Live Kitchen',
    },
    {
        id: '3',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80',
        title: 'BBQ Special',
    },
    {
        id: '4',
        imageUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        isVideo: true,
        title: 'Morning Brew',
    },
    {
        id: '5',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
        title: 'Sushi Feast',
    },
    {
        id: '6',
        imageUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        isVideo: true,
        title: 'Chef Special',
    },
    {
        id: '7',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80',
        title: 'Italian Pizza',
    },
    {
        id: '8',
        imageUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        isVideo: true,
        title: 'Sizzling Wok',
    },
    {
        id: '9',
        imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&q=80',
        title: 'Sweet Donuts',
    },
    {
        id: '10',
        imageUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        isVideo: true,
        title: 'Nature Drinks',
    },
    {
        id: '11',
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80',
        title: 'Steak House',
    },
    {
        id: '12',
        imageUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        isVideo: true,
        title: 'Juicy Burgers',
    }
];

export const OFFERS = [
    {
        id: '1',
        title: '50% OFF',
        subtitle: 'On all chocolate cakes',
        color: '#FF4B3A',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: '2',
        title: 'Free Delivery',
        subtitle: 'On orders above $20',
        color: '#F59E0B',
        image: 'https://images.unsplash.com/photo-1551024601-5637ade8a331?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: '3',
        title: 'BOGO',
        subtitle: 'Buy one get one free',
        color: '#10B981',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop'
    },
];

export const ORDERS = [
    {
        id: '1',
        orderNumber: 'ZP-8829-X0',
        date: '20 Oct 2023, 10:30 AM',
        status: 'on_the_way',
        totalAmount: 1250,
        deliveryAddress: '123 Baker Street, New Delhi',
        items: [
            { id: 101, name: 'Chocolate Truffle', quantity: 1, price: 850, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200' },
            { id: 102, name: 'Vanilla Cupcake', quantity: 2, price: 200, image: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=200' }
        ]
    },
    {
        id: '2',
        orderNumber: 'ZP-9912-A1',
        date: '18 Oct 2023, 04:15 PM',
        status: 'preparing',
        totalAmount: 450,
        deliveryAddress: '45 Green Park, Mumbai',
        items: [
            { id: 103, name: 'Spicy Burger', quantity: 1, price: 450, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200' }
        ]
    },
    {
        id: '3',
        orderNumber: 'ZP-1123-B2',
        date: '15 Oct 2023, 08:00 PM',
        status: 'delivered',
        totalAmount: 2100,
        deliveryAddress: 'Apartment 4B, Sector 62, Noida',
        items: [
            { id: 104, name: 'Party Pizza Combo', quantity: 1, price: 1500, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200' },
            { id: 105, name: 'Cold Coffee', quantity: 2, price: 300, image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=200' }
        ]
    }
];