import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactFormSubmission {
    id: bigint;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
}
export type Time = bigint;
export interface ProductUpdate {
    id: bigint;
    productUpdateType: ProductUpdateType;
    productId: bigint;
    message: string;
    timestamp: Time;
}
export interface Product {
    id: bigint;
    created: Time;
    name: string;
    description: string;
    availability: AvailabilityStatus;
    timestamp: Time;
    category: Category;
    price: number;
    images: Array<string>;
}
export interface UserProfile {
    name: string;
}
export enum AvailabilityStatus {
    inStock = "inStock",
    outOfStock = "outOfStock",
    limited = "limited"
}
export enum Category {
    organicWild = "organicWild",
    rawForest = "rawForest",
    herbalInfused = "herbalInfused",
    honeyComb = "honeyComb"
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
    createProduct(name: string, description: string, category: Category, price: number, images: Array<string>, availability: AvailabilityStatus): Promise<bigint>;
    createProductUpdate(productUpdateType: ProductUpdateType, productId: bigint, message: string): Promise<bigint>;
    deleteProduct(id: bigint): Promise<void>;
    deleteProductUpdate(id: bigint): Promise<void>;
    getAllProductUpdates(): Promise<Array<ProductUpdate>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactFormSubmissions(): Promise<Array<ContactFormSubmission>>;
    getProduct(id: bigint): Promise<Product | null>;
    getProductUpdatesByProduct(productId: bigint): Promise<Array<ProductUpdate>>;
    getProductUpdatesByType(productUpdateType: ProductUpdateType): Promise<Array<ProductUpdate>>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactForm(name: string, email: string, message: string): Promise<bigint>;
    updateProduct(id: bigint, name: string, description: string, category: Category, price: number, images: Array<string>, availability: AvailabilityStatus): Promise<void>;
}
