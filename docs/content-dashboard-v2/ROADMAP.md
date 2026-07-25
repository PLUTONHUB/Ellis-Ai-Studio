# Content Dashboard V2

## Product architecture

Content Dashboard V2 is organized around five connected systems:

1. Mission Control — prioritizes the best next action across campaigns, publishing, performance, and reuse.
2. Content Pipeline — moves work through Ideas, Research, Outline, Draft, Review, Approved, Scheduled, Published, and Repurpose.
3. Campaign Workspace — holds objective, audience, message, platform plan, assets, timeline, content pieces, and recommendations together.
4. Pluto Intelligence — applies durable business, brand, campaign, performance, and content-memory context to recommendations.
5. Content Intelligence — explains topic performance, consistency, reuse opportunities, and what to make next.

## Interaction flows

### Create content

Mission Control or Pipeline → New content → assign campaign and content type → Pluto proposes an angle and structure → Research/Outline → Draft → Review → Approval → Schedule → Publish → Repurpose.

### Improve a campaign

Campaign Workspace → select campaign → review health and content coverage → ask Pluto → accept a recommendation → generate linked content pieces → track momentum in the timeline.

### Repurpose a winner

Analytics identifies a useful topic → Pluto proposes platform adaptations → editor adapts the core argument → publishing checklist confirms readiness → schedule coordinated distribution.

## Component library

- Application rail and command trigger
- Mission hero, priority rows, score cards, campaign-health rows
- Pipeline board, workflow columns, content cards, filters, and bulk-action controls
- Campaign tabs, campaign hero, timeline, content-piece list, and recommendation card
- Pluto modal, context chips, recommendation choices, and conversational prompt field
- Analytics hero, metric cards, topic bars, and insight panel
- Responsive bottom navigation, keyboard focus states, and reduced-density mobile layouts

## Design system

- Background: warm off-white operating canvas
- Primary ink: near-black for confident hierarchy
- Accent: Ellis lime for active progress and primary actions
- Supporting signals: violet, blue, and orange for differentiated operational states
- Typography: dense editorial headings, compact high-signal labels, and roomy data cards
- Motion: state transitions should use short 160–220ms opacity/transform changes; do not animate core writing surfaces or degrade reduced-motion preferences.

## Delivery roadmap

### Foundation

- Persist campaigns, pipeline stages, platform variants, asset records, and content history in D1.
- Move current content-library records into the new campaign/content-piece model.
- Add authenticated workspace membership and role-based review approval.

### Content operating workflows

- Add pointer and keyboard drag-and-drop with server-side stage persistence.
- Add bulk movement, assignment, due dates, campaign filters, and version history.
- Expand the editor into structured blocks: strategy, research, outline, draft, publishing checklist, and platform adaptations.

### Pluto intelligence

- Store source-grounded business profile, brand voice, offers, audience, campaign, and prior-content memory.
- Add duplicate-angle detection, content-gap detection, recommendation evidence, and a confidence score.
- Require human approval for external publishing actions.

### Publishing and analytics

- Connect platform accounts through the existing publishing adapters.
- Add real scheduling, preview rendering, media-library management, and delivery status.
- Ingest platform metrics; calculate campaign health, topic performance, consistency, reuse value, and recommendation impact.

### Quality bar

- Add visual regression coverage for desktop and mobile states.
- Add keyboard workflow tests for pipeline and publishing.
- Track LCP, INP, and CLS for dashboard routes; lazy-load non-active views and large analytics modules.
