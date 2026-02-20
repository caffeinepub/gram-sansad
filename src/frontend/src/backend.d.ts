import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type ChatMessageContent = {
    __kind__: "video";
    video: ExternalBlob;
} | {
    __kind__: "text";
    text: string;
} | {
    __kind__: "photo";
    photo: ExternalBlob;
};
export interface UserRegistration {
    age: bigint;
    name: string;
    mobileNumber: string;
    district: string;
    whatsappNumber: string;
    state: string;
    fatherName: string;
    village: string;
    aadharPhoto: ExternalBlob;
}
export interface PollOption {
    id: bigint;
    text: string;
}
export interface Announcement {
    id: bigint;
    message: string;
}
export interface UserProfile {
    age: bigint;
    name: string;
    mobileNumber: string;
    district: string;
    whatsappNumber: string;
    state: string;
    fatherName: string;
    village: string;
    aadharPhoto: ExternalBlob;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPoll(question: string, options: Array<PollOption>): Promise<bigint>;
    getAnnouncements(): Promise<Array<Announcement>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChat(): Promise<Array<ChatMessageContent>>;
    getPollResults(pollId: bigint): Promise<{
        question: string;
        votes: Array<[bigint, bigint]>;
        options: Array<PollOption>;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    postAnnouncement(message: string): Promise<void>;
    registerUser(data: UserRegistration): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(content: ChatMessageContent): Promise<void>;
    voteInPoll(pollId: bigint, optionId: bigint): Promise<void>;
}
