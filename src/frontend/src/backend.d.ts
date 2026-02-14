import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface FlavorVariant {
    weight: bigint;
    flavor: string;
    description: string;
    price: Price;
}
export type Time = bigint;
export interface WeightVariant {
    weight: bigint;
    description: string;
    price: Price;
}
export interface ProductUpdate {
    id: bigint;
    productUpdateType: ProductUpdateType;
    productId: bigint;
    message: string;
    timestamp: Time;
}
export interface OrderItem {
    productId: bigint;
    flavorVariant?: FlavorVariant;
    quantity: bigint;
    weightVariant?: WeightVariant;
}
export type CustomerIdentifier = {
    __kind__: "email";
    email: string;
} | {
    __kind__: "phone";
    phone: string;
};
export interface OrderType {
    id: bigint;
    status: OrderStatus;
    customerIdentifier: CustomerIdentifier;
    createdAt: Time;
    updatedAt: Time;
    address: DeliveryAddress;
    items: Array<OrderItem>;
    totalPrice: number;
}
export type ProductVariants = {
    __kind__: "weight";
    weight: Array<WeightVariant>;
} | {
    __kind__: "flavor";
    flavor: Array<FlavorVariant>;
};
export interface Price {
    salePrice?: number;
    listPrice: number;
}
export interface SiteSettings {
    certificationsContent: string;
    backgroundImage?: string;
    mapUrl: string;
    aboutContent: string;
    certificationsImage?: string;
    contactDetails: string;
}
export interface Logo {
    data: Uint8Array;
    mimeType: string;
}
export interface ContactFormSubmission {
    id: bigint;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
}
export interface DeliveryAddress {
    country: string;
    city: string;
    postalCode: string;
    name: string;
    state: string;
    addressLine1: string;
    addressLine2: string;
    phoneNumber: string;
}
export interface Product {
    id: bigint;
    created: Time;
    isDeleted: boolean;
    name: string;
    description: string;
    variants?: ProductVariants;
    availability: AvailabilityStatus;
    stock: bigint;
    timestamp: Time;
    category: Category;
    image: string;
    price: Price;
}
export type SeedProductsResult = {
    __kind__: "seeded";
    seeded: {
        count: bigint;
    };
} | {
    __kind__: "alreadySeeded";
    alreadySeeded: null;
};
export enum AvailabilityStatus {
    inStock = "inStock",
    outOfStock = "outOfStock",
    limited = "limited"
}
export enum Category {
    beeProducts = "beeProducts",
    rawHoney = "rawHoney",
    naturalHoney = "naturalHoney"
}
export enum OrderStatus {
    pending = "pending",
    transit = "transit",
    delivered = "delivered",
    inProgress = "inProgress"
}
export enum ProductUpdateType {
    seasonalAvailability = "seasonalAvailability",
    priceUpdate = "priceUpdate",
    newHarvest = "newHarvest",
    limitedTimeOffer = "limitedTimeOffer"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAdmin(newAdmin: Principal): Promise<void>;
    adminLogin(username: string, password: string): Promise<string | null>;
    adminLogout(sessionId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrder(sessionId: string, items: Array<OrderItem>, totalPrice: number, address: DeliveryAddress): Promise<bigint>;
    createProduct(sessionId: string, name: string, description: string, category: Category, price: Price, image: string, availability: AvailabilityStatus, variants: ProductVariants | null, stock: bigint): Promise<bigint>;
    createProductUpdate(sessionId: string, productUpdateType: ProductUpdateType, productId: bigint, message: string): Promise<bigint>;
    customerLogin(identifier: CustomerIdentifier): Promise<string | null>;
    customerLogout(sessionId: string): Promise<void>;
    deleteProduct(sessionId: string, id: bigint): Promise<void>;
    deleteProductUpdate(sessionId: string, id: bigint): Promise<void>;
    getAllOrders(sessionId: string): Promise<Array<OrderType>>;
    getAllProductUpdates(): Promise<Array<ProductUpdate>>;
    getAllProducts(): Promise<Array<Product>>;
    getAllProductsAdmin(sessionId: string): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactFormSubmissions(sessionId: string): Promise<Array<ContactFormSubmission>>;
    getCustomerOrders(sessionId: string): Promise<Array<OrderType>>;
    getCustomerSessionInfo(sessionId: string): Promise<CustomerIdentifier | null>;
    getDeliveryAddress(sessionId: string): Promise<DeliveryAddress | null>;
    getLimitedProducts(): Promise<Array<Product>>;
    getLogo(): Promise<Logo | null>;
    getOrder(sessionId: string, orderId: bigint): Promise<OrderType | null>;
    getProduct(id: bigint): Promise<Product | null>;
    getProductAdmin(sessionId: string, id: bigint): Promise<Product | null>;
    getProductUpdatesByProduct(productId: bigint): Promise<Array<ProductUpdate>>;
    getProductUpdatesByType(productUpdateType: ProductUpdateType): Promise<Array<ProductUpdate>>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    getSiteSettings(): Promise<SiteSettings>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    promoteToUser(principal: Principal): Promise<void>;
    removeAdmin(adminToRemove: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveDeliveryAddress(sessionId: string, address: DeliveryAddress): Promise<void>;
    seedProducts(sessionId: string): Promise<SeedProductsResult>;
    submitContactForm(name: string, email: string, message: string): Promise<bigint>;
    updateLogo(sessionId: string, mimeType: string, data: Uint8Array): Promise<void>;
    updateOrderStatus(sessionId: string, orderId: bigint, newStatus: OrderStatus): Promise<void>;
    updateProduct(sessionId: string, id: bigint, name: string, description: string, category: Category, price: Price, image: string, availability: AvailabilityStatus, variants: ProductVariants | null, stock: bigint): Promise<void>;
    updateSiteSettings(sessionId: string, newSettings: SiteSettings): Promise<void>;
    validateAdminSession(sessionId: string): Promise<boolean>;
    validateCustomerSession(sessionId: string): Promise<boolean>;
}
