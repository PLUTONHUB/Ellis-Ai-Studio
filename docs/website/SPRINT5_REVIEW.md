# Sprint 5 — Website Messaging, SEO, and Conversion Review

## Scope and current-state audit

Current public routes are `/` and `/portfolio`; internal dashboards are excluded. The homepage is the primary Ellis marketing page. Portfolio contains fictional demonstrations and should remain clearly labeled as such. Dedicated Services, About, Process, Contact, legal, and 404 pages are absent and should be planned before publication. No public-site change is made by this review.

## Canonical message

**Ellis AI Studio designs and builds AI-powered growth systems that help businesses acquire more customers, convert more leads, and operate more efficiently.** Technology is the mechanism; business outcomes are the product.

Primary audience: established service businesses with a valuable offer, growth ambition, and a measurable acquisition, conversion, or operating constraint. Primary action: **Book a Growth Strategy Call**.

## Information architecture recommendation

`Home → Services → Process → Portfolio → About → Growth Strategy Call`, with persistent primary CTA and a utility footer containing Contact, Privacy, Terms, and accessibility contact. Add a helpful 404 page that returns visitors to Services, Portfolio, or the booking action.

## Page copy and side-by-side direction

| Page | Current / gap | Review-ready replacement |
| --- | --- | --- |
| Home hero | Lead with a generic studio introduction where present. | **H1:** Build a growth system that earns more customers. **Body:** Ellis designs AI-powered systems that improve customer acquisition, lead conversion, and operational efficiency for service businesses. **CTA:** Book a Growth Strategy Call. **Secondary:** Explore Growth Opportunities. |
| Home benefits | Technology/services can lead the story. | **H2:** Growth becomes easier to measure—and easier to repeat. Use three outcome cards: acquire qualified demand, convert more of the demand you have, operate with less manual follow-up. |
| Home process | Not presented as the canonical journey. | **H2:** From business intelligence to continuous growth. Discovery → Business Intelligence → Growth Strategy → System Design → Implementation → Optimization → Continuous Growth. |
| Services | Dedicated page absent. | **H1:** Growth systems built around your next business outcome. For each service: ideal client, outcome/problem, system, deliverables, success metrics, CTA: Discuss Your Business Goals. Source service names/scopes from [Service Packages](../foundation/SERVICE_PACKAGES.md). |
| Portfolio | Strong visual work but project descriptions need explicit business framing. | Every item: Challenge, Objective, Solution, Expected/Measured Outcome, Implementation Highlights, Relevant Technologies, and **CTA:** Build Your Growth System. Keep “fictional demo” label conspicuous where applicable. |
| About | Dedicated page absent. | **H1:** Your long-term partner for AI-powered growth. Explain mission, operating philosophy, how Ellis works, and commitment to measurable outcomes. Link [Mission](../foundation/MISSION.md) and [Core Values](../foundation/CORE_VALUES.md). |
| Process | Dedicated page absent. | **H1:** A clear path from insight to continuous growth. Give each canonical stage a client input, Ellis output, measurable checkpoint, and next step. |
| Contact / booking | Dedicated page absent; existing calendar link is the conversion destination. | **H1:** Let’s identify your next growth opportunity. Capture name, business, website, primary goal, and preferred contact method; explain what happens after booking. |

## Services page content model

For Growth Systems, Lead Recovery System, Website Systems, AI Automation Systems, Content Engine, Growth Engine, and Business Intelligence: lead with the client outcome; then ideal client, business situation, expected impact, implementation approach, deliverables, success measures, and CTA. Never lead with tools, model names, or technical architecture.

## SEO and metadata recommendations

- Homepage title: `AI-Powered Growth Systems for Service Businesses | Ellis AI Studio`.
- Homepage description: `Ellis AI Studio designs growth systems that help service businesses acquire more customers, convert more leads, and operate more efficiently.`
- Use one H1 per route, descriptive H2s, canonical URLs, unique title/description, semantic landmarks, and accessible image alt text.
- Add Organization, ProfessionalService, WebSite, Service, BreadcrumbList, and Portfolio/CreativeWork JSON-LD only after legal business/address/contact facts are confirmed.
- Add page-specific Open Graph title, description, canonical image, and `twitter:card=summary_large_image`.
- Build internal links among Services, Process, Portfolio, About, and booking. Target service-business, local-market, growth-system, lead-conversion, and business-automation intent without keyword stuffing.

## Conversion, trust, and mobile recommendations

- Place the primary CTA after hero, benefits, process, and final section; preserve a visible mobile CTA.
- Add proof only when verified: client outcomes, approved testimonials, relevant experience, project evidence, and clearly marked demonstrations.
- Clarify booking expectations, response time, privacy, and no-obligation status near forms.
- Keep forms short; validate fields accessibly; provide an alternate contact path; measure form-start, form-complete, calendar-click, and booking-complete events.
- Test reading order, contrast, keyboard navigation, focus styles, tap targets, image performance, and Core Web Vitals on mobile before launch.

## Review checklist

- [ ] Confirm legal entity, contact details, privacy policy, terms, and cookie/analytics requirements.
- [ ] Confirm approved case studies, testimonials, metrics, and portfolio permissions.
- [ ] Confirm booking-flow owner, routing, and measurement.
- [ ] Approve page copy before implementation.
- [ ] Implement structured data only with verified facts.
- [ ] Run accessibility, metadata, mobile, and conversion-event QA before publishing.
