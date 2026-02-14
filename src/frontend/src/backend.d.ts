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
export interface UpdateProductPayload {
    id: bigint;
    name: string;
    description: string;
    variants?: ProductVariants;
    availability: AvailabilityStatus;
    stock: bigint;
    category: Category;
    image: string;
    price: Price;
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
export interface StoreSettings {
    certificationsContent: string;
    backgroundImage?: string;
    mapUrl: string;
    aboutContent: string;
    certificationsImage?: string;
    contactDetails: string;
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
export interface Logo {
    data: Uint8Array;
    mimeType: string;
}
export interface CreateProductPayload {
    name: string;
    description: string;
    variants?: ProductVariants;
    availability: AvailabilityStatus;
    stock: bigint;
    category: Category;
    image: string;
    price: Price;
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
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrder(sessionId: string, items: Array<OrderItem>, totalPrice: number, address: DeliveryAddress): Promise<{
        __kind__: "success";
        success: bigint;
    }>;
    createProduct(payload: CreateProductPayload): Promise<{
        __kind__: "error";
        error: string;
    } | {
        __kind__: "success";
        success: Product;
    }>;
    createProductUpdate(productUpdateType: ProductUpdateType, productId: bigint, message: string): Promise<bigint>;
    deleteCustomerAddress(sessionId: string, addressIndex: bigint): Promise<void>;
    deleteProduct(productId: bigint): Promise<{
        __kind__: "error";
        error: string;
    } | {
        __kind__: "success";
        success: null;
    }>;
    getAllContactSubmissions(): Promise<Array<ContactFormSubmission>>;
    getAllOrders(): Promise<Array<OrderType>>;
    getAllProductUpdates(): Promise<Array<ProductUpdate>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomerAddresses(sessionId: string): Promise<Array<DeliveryAddress>>;
    getCustomerOrders(sessionId: string): Promise<Array<OrderType>>;
    getLogo(): Promise<Logo | null>;
    getProduct(productId: bigint): Promise<Product | null>;
    getProductUpdatesByProduct(productId: bigint): Promise<Array<ProductUpdate>>;
    getProductUpdatesByType(productUpdateType: ProductUpdateType): Promise<Array<ProductUpdate>>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    getStoreSettings(): Promise<StoreSettings>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveCustomerAddress(sessionId: string, address: DeliveryAddress): Promise<void>;
    setLogo(newLogo: Logo): Promise<void>;
    submitContactForm(name: string, email: string, message: string): Promise<bigint>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
    updateProduct(payload: UpdateProductPayload): Promise<{
        __kind__: "error";
        error: string;
    } | {
        __kind__: "success";
        success: Product;
    }>;
    updateStoreSettings(settings: StoreSettings): Promise<void>;
}
