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
export interface Price {
    salePrice?: number;
    listPrice: number;
}
export type ProductVariants = {
    __kind__: "weight";
    weight: Array<WeightVariant>;
} | {
    __kind__: "flavor";
    flavor: Array<FlavorVariant>;
};
export interface ContactFormSubmission {
    id: bigint;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
}
export interface Logo {
    data: Uint8Array;
    mimeType: string;
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
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(name: string, description: string, category: Category, price: Price, image: string, availability: AvailabilityStatus, variants: ProductVariants | null, stock: bigint): Promise<bigint>;
    createProductUpdate(productUpdateType: ProductUpdateType, productId: bigint, message: string): Promise<bigint>;
    deleteProduct(id: bigint): Promise<void>;
    deleteProductUpdate(id: bigint): Promise<void>;
    getAllProductUpdates(): Promise<Array<ProductUpdate>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactFormSubmissions(): Promise<Array<ContactFormSubmission>>;
    getLimitedProducts(): Promise<Array<Product>>;
    getLogo(): Promise<Logo | null>;
    getProduct(id: bigint): Promise<Product | null>;
    getProductUpdatesByProduct(productId: bigint): Promise<Array<ProductUpdate>>;
    getProductUpdatesByType(productUpdateType: ProductUpdateType): Promise<Array<ProductUpdate>>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    promoteToUser(principal: Principal): Promise<void>;
    removeAdmin(adminToRemove: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedProducts(): Promise<SeedProductsResult>;
    submitContactForm(name: string, email: string, message: string): Promise<bigint>;
    updateLogo(mimeType: string, data: Uint8Array): Promise<void>;
    updateProduct(id: bigint, name: string, description: string, category: Category, price: Price, image: string, availability: AvailabilityStatus, variants: ProductVariants | null, stock: bigint): Promise<void>;
}
