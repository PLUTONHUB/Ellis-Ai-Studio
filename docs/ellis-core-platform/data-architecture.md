# Phase C — Data Architecture (Design Only)

This is a design, not an implementation. The relational system of record uses immutable IDs, timestamps, ownership fields, explicit foreign keys, and `business_id` tenant isolation. Deactivation/soft deletion is default; retention is defined by data class.

| Entity | Owning domain | Relationships |
| --- | --- | --- |
| Businesses | Sales CRM | prospects, clients, websites, brand profiles, projects |
| Prospects / Clients / Contacts | Sales CRM | business, conversations, outreach, services/projects |
| Services | Operations | package/version, project scope |
| Projects / Tasks | Client Delivery | client, service, deliverables |
| Websites / Website Snapshots | Website Intelligence | business, immutable snapshots, audit reports |
| Portfolio / Demos / Case Studies | Client Delivery | approved client/project outcomes and media |
| Content Assets | Content Intelligence | reusable source briefs/assets |
| Campaigns | Campaign Intelligence | business, generated content, analytics |
| Generated Content | Copy Studio | content asset/campaign/prompt version provenance |
| Media Assets | Creative Studio | brief/brand, generated content |
| Publishing Jobs | Publishing Engine | content/media, channel, results |
| Analytics | Analytics Engine | campaign/content/job/time dimensions |
| Brand Profiles | Operations | business, version, workers |
| Knowledge | Knowledge | source/version/access classification |
| Automation Jobs | Automation | workflow, trigger event, subject entity |
| Audit Reports | Website Intelligence | website snapshot/project |
| Recommendations / Memory | Learning Engine | evidence/provenance, scoped expiry |
| Conversations | Sales CRM | contact, outreach/delivery context |
| System Events | Platform | append-only envelope for any aggregate |

Services, brand profiles, prompt templates, campaign templates, and design tokens are referenced by ID/version, never copied. Generated output retains inputs, template/prompt version, model/provider, and worker run ID. External IDs are a separate provider-identity mapping. Cross-domain reporting uses projections, not shared ownership.
