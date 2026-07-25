# Recurring SEO workflow

Run this workflow after every deployment and record the result in a release note.

1. Crawl the production sitemap and flag non-200 URLs, redirect chains, broken internal links, duplicate titles, duplicate descriptions, missing canonical URLs, and heading-order errors.
2. Run Lighthouse on the homepage plus one service, industry, and contact page. Track Performance, Accessibility, Best Practices, and SEO; investigate any regression rather than treating a single score as a ranking signal.
3. Validate every JSON-LD block with Google’s Rich Results Test and Schema.org Validator. Confirm business facts such as address, phone, hours, and service areas before publishing them.
4. Regenerate `public/sitemap.xml` whenever a public route is added or removed. Keep private dashboard routes excluded from the sitemap and blocked in `robots.txt`.
5. Review Search Console: queries, impressions, clicks, CTR, indexed pages, coverage errors, and Core Web Vitals. Use GA4 to review engagement and conversion paths. Do not infer rankings, traffic, or business performance without these sources.
6. Add content only where Search Console, sales conversations, or customer questions show a real buyer need. Prioritize service pages, industry proof, case studies, and FAQs over broad “AI” thought-leadership topics.

## Next content cluster

- AI automation for roofing companies: lead response, estimates, storm-season follow-up
- AI websites for HVAC companies: emergency service, maintenance plans, seasonal demand
- AI systems for plumbers: dispatch, intake, customer communications
- AI systems for electricians: service-page architecture and commercial lead qualification
- Custom CRM automation: implementation guide, integrations, cost and timeline FAQ

Before creating a city page, confirm a real service area, local proof, and a unique buyer benefit. Never create thin location pages only to capture search terms.
