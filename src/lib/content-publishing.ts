export type ContentPlatform = "linkedin" | "x" | "facebook" | "instagram" | "threads";
export type ScheduledContent = { id: string; body: string; publishAt: number; platforms: ContentPlatform[]; assets?: Array<{ url: string; alt: string }> };
export type PublishReceipt = { platform: ContentPlatform; externalId: string; publishedAt: number };
export interface ContentPublisher { publish(item: ScheduledContent, platform: ContentPlatform): Promise<PublishReceipt>; }
export interface ContentScheduler { schedule(item: ScheduledContent): Promise<void>; due(now?: number): Promise<ScheduledContent[]>; markPublished(id: string, receipts: PublishReceipt[]): Promise<void>; }
export type ContentAnalytics = { contentId: string; platform: ContentPlatform; collectedAt: number; impressions?: number; engagements?: number; clicks?: number; comments?: number; shares?: number };
export interface ContentAnalyticsProvider { collect(receipt: PublishReceipt): Promise<ContentAnalytics>; }
