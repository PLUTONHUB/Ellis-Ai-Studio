/** Provider-neutral contract for future Meta, X, Threads, and LinkedIn adapters. */
export type SocialPost = { text: string; image?: { dataUrl: string; mimeType: string } };
export type SocialConnection = { provider: string; connected: boolean; displayName?: string; expiresAt?: number; message?: string };
export interface SocialProvider { connection(): Promise<SocialConnection>; authorizationUrl(): string; completeAuthorization(code: string, state: string): Promise<void>; publish(post: SocialPost): Promise<{ id: string }>; disconnect?(): Promise<void>; refreshToken?(): Promise<void>; }
