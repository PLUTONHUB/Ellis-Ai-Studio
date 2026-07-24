/** Provider-neutral contract for future Meta, X, Threads, and LinkedIn adapters. */
export type SocialPost = { text: string; image?: { dataUrl: string; mimeType: string } };
export type SocialConnection = { provider: string; connected: boolean; displayName?: string; expiresAt?: number; message?: string };
export type PublishedPostMetadata = { shareUrn: string; publicPostUrl?: string; authorUrn?: string; createdAt?: number; visibility?: string; lifecycleState?: string; resolutionStatus: "resolved" | "unavailable" };
export type PublishResult = { id: string; metadata?: PublishedPostMetadata };
export interface SocialProvider { connection(): Promise<SocialConnection>; authorizationUrl(): string; completeAuthorization(code: string, state: string): Promise<void>; publish(post: SocialPost): Promise<PublishResult>; disconnect(): Promise<void>; refreshToken?(): Promise<void>; }
