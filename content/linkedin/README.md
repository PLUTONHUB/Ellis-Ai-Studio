# Ellis AI Studio LinkedIn Content System

Run node scripts/generate-linkedin-content.mjs to generate the versioned post library and 90-day calendar.

Posts are provider-neutral Markdown. A scheduler reads frontmatter, hands a ScheduledContent item to a ContentPublisher, and records outcomes through ContentAnalyticsProvider. Adding a platform requires an adapter, never edits to post files.
