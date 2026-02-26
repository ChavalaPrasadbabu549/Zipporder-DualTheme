export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    Bakery: undefined;
    Cart: undefined;
    Profile: undefined;
};

export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
    ProductDetail: { productId: number };
    CategoryDetail: { categoryId: number; categoryName: string };
    AllCategories: undefined;
    Cart: undefined;
};
