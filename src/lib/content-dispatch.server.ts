import type { ContentPlatform } from "~/lib/content-publishing";
import type { PublishResult, SocialPost } from "~/lib/social-provider";
export async function publishContent(platform: ContentPlatform, post: SocialPost): Promise<PublishResult> {
  if (platform === "linkedin") return (await import("~/lib/linkedin.server")).linkedinProvider.publish(post);
  throw new Error(platform + " publishing is not connected yet.");
}
