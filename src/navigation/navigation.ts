export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    Bakery: undefined;
    Categories: undefined;
    Decoration: undefined;
    Beverages: undefined;
};

export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
    ProductDetail: { productId: number };
    AllCategories: { categoryId?: number; categoryName?: string };
    Cart: undefined;
    Profile: undefined;
    Wishlist: undefined;
};
