export type AuthStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    Bakery: { categoryId: number | string; categoryName: string };
    Categories: undefined;
    Decorators: { categoryId: number | string; categoryName: string };
    Beverages: { categoryId: number | string; categoryName: string };
};

export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
    CategoryDetail: { categoryId: number | string; categoryName: string };
    ProductDetail: { productId: number };
    AllCategories: { categoryId?: number; categoryName?: string };
    Cart: undefined;
    Profile: undefined;
    Wishlist: undefined;
    Orders: undefined;
    TrackOrder: { orderId: string };
};
