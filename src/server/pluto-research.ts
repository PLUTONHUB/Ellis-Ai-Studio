import { createServerFn } from "@tanstack/react-start";

import type { RunResearchInput } from "~/types/research";

export const runBusinessResearch = createServerFn({ method: "POST" })
  .validator((data: RunResearchInput) => {
    if (!data || typeof data.name !== "string" || typeof data.websiteUrl !== "string" || typeof data.idempotencyKey !== "string") {
      throw new Error("Research requests require name, websiteUrl, and idempotencyKey strings.");
    }
    return data;
  })
  .handler(async ({ data }) => {
    if (process.env.PLUTO_RESEARCH_ENABLED !== "true") {
      throw new Error("Pluto Research Engine is disabled. Set PLUTO_RESEARCH_ENABLED=true only in the protected server environment.");
    }
    const [{ BusinessResearchService }, { SupabaseResearchRepository }] = await Promise.all([
      import("~/services/business-research-service"),
      import("~/lib/supabase/research-repository.server"),
    ]);
    return new BusinessResearchService(SupabaseResearchRepository.fromEnvironment()).research(data);
  });
