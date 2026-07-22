# Draft Generation

Every generated draft must reference `marketing/shared/` before it uses a platform-specific format. Required shared inputs are voice, messaging, positioning, hooks, storytelling, CTAs, and hashtags.

Generate only from verified event context. Store the source event ID, chosen classification, shared references, platform module reference, generated timestamp, and status in the draft record. Use the templates in this folder as automation schemas; use the existing platform modules for channel-specific writing rules.
