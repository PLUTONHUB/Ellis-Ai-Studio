import type { Business, ExtractedFact, IntelligencePriority, IntelligenceReport, WebsiteSnapshot } from "~/types/research";

const pillarDefinitions = [
  ["Discovery", "Clear services and trust signals help qualified buyers understand the offer.", "Clarify service positioning and add proof near primary offers."],
  ["Conversion", "A visible call-to-action turns interest into a next step.", "Add a prominent quote, booking, or consultation CTA."],
  ["Response", "Reachable contact paths prevent high-intent prospects from leaving.", "Publish and monitor phone and email contact paths."],
  ["Operations", "Scheduling and intake reduce manual handoffs.", "Add a structured inquiry or scheduling workflow."],
  ["Customer Experience", "Clear navigation and proof reduce buyer uncertainty.", "Make service, contact, and trust content easy to reach."],
  ["Intelligence", "Measurement-ready conversion paths support better decisions.", "Instrument form, call, and booking conversions."],
  ["Growth", "A repeatable digital journey makes demand easier to scale.", "Create dedicated service and location pages with clear CTAs."],
] as const;

export class IntelligenceService {
  analyze(business: Business, facts: ExtractedFact[], snapshots: WebsiteSnapshot[]): IntelligenceReport {
    const values = (type: ExtractedFact["factType"]) => facts.filter((fact) => fact.factType === type).map((fact) => String(fact.value));
    const text = snapshots.map((snapshot) => snapshot.bodyText).join(" ").toLowerCase();
    const services = values("service"); const phones = values("phone"); const emails = values("email"); const socialLinks = values("social_profile");
    const detected = (pattern: RegExp) => pattern.test(text);
    const industry = inferIndustry(services, text);
    const missingPhone = phones.length === 0; const missingEmail = emails.length === 0;
    const hasCta = detected(/get (a )?(quote|estimate)|book (now|online|a)|schedule (a|your)|contact us|request (a )?(quote|estimate|consultation)/);
    const hasBooking = detected(/book|schedule|appointment/); const hasTrust = detected(/review|testimonial|certified|award|licensed|insured|guarantee/);
    const conversionOpportunities = [missingPhone && "Missing phone number", missingEmail && "Missing email address", !hasCta && "Weak or missing call to action", !detected(/form|request.*quote|free estimate/) && "Missing quote request", !hasBooking && "Missing online scheduling", !hasTrust && "Missing trust elements"].filter((value): value is string => Boolean(value));
    const evidence = (condition: boolean, positive: string, negative: string) => [condition ? positive : negative];
    const frictionAnalysis = pillarDefinitions.map(([pillar, whyItMatters, recommendedFix]) => {
      const condition = pillar === "Conversion" ? hasCta : pillar === "Response" ? !missingPhone || !missingEmail : pillar === "Customer Experience" ? hasTrust : services.length > 0;
      return { pillar, score: condition ? 75 : 38, evidence: evidence(condition, `Research detected support for ${pillar.toLowerCase()}.`, `Research did not find strong ${pillar.toLowerCase()} signals.`), whyItMatters, estimatedBusinessImpact: condition ? "Moderate opportunity to improve consistency." : "High risk of lost demand and lower conversion.", recommendedFix };
    });
    const priorityRecommendations = conversionOpportunities.map((title, index) => ({ priority: (index === 0 ? "Critical" : index < 3 ? "High" : "Medium") as IntelligencePriority, title, estimatedRevenueImpact: index < 2 ? "High: captures otherwise unreachable prospects." : "Medium: reduces conversion friction.", estimatedImplementationEffort: index < 2 ? "Low" : "Medium", supportingEvidence: [title], action: recommendationAction(title) }));
    return { executiveSummary: { businessName: business.name, industry, description: String(snapshots[0]?.metadata.description ?? `${business.name} provides ${services.slice(0, 3).join(", ") || "business services"}.`), confidence: Math.min(0.95, 0.5 + facts.length / 100) }, businessProfile: { services: { "Website services": services }, products: extractMatches(text, /(?:products?|solutions?)\s*[:\-]?\s*([^.!]{3,100})/g), serviceAreas: extractMatches(text, /(?:serving|service areas?)\s+([^.!]{3,100})/g), locations: values("address"), contacts: { phones, emails }, socialLinks, operatingHours: extractMatches(text, /(?:hours|open)\s*[:\-]?\s*([^.!]{3,80})/g) }, trustSignals: { reviews: detected(/review/) ? ["Review language detected"] : [], certifications: detected(/certified|licensed|insured/) ? ["Certification or credential language detected"] : [], awards: detected(/award/) ? ["Award language detected"] : [], testimonials: detected(/testimonial/) ? ["Testimonial language detected"] : [], guarantees: detected(/guarantee|warranty/) ? ["Guarantee language detected"] : [], yearsInBusiness: extractMatches(text, /(?:since|over)\s+(\d{4}|\d+ years)/g) }, digitalPresence: { websiteQuality: [`${snapshots.length} researched page(s) returned HTML successfully.`], mobileFriendliness: [detected(/viewport/) ? "Viewport metadata detected." : "Mobile viewport metadata was not detected."], navigation: [services.length ? "Service-oriented headings were discovered." : "Limited service navigation signals found."], missingPages: [detected(/contact/) ? null : "Contact page/link not detected", detected(/about/) ? null : "About page/link not detected"].filter((value): value is string => value !== null), contactAccessibility: [...evidence(!missingPhone, "Phone contact found.", "Phone contact missing."), ...evidence(!missingEmail, "Email contact found.", "Email contact missing.")] }, conversionOpportunities, frictionAnalysis, priorityRecommendations };
  }
}
function inferIndustry(services: string[], text: string) { if (/plumb|hvac|electric|landscap|cleaning/.test(`${services.join(" ")} ${text}`.toLowerCase())) return "Home services"; if (/legal|attorney/.test(text)) return "Legal services"; if (/dental|medical|clinic/.test(text)) return "Healthcare"; return services[0] ? "Professional services" : "Not confidently identified"; }
function extractMatches(text: string, pattern: RegExp) { return [...new Set(Array.from(text.matchAll(pattern), (match) => match[1]?.trim()).filter((value): value is string => Boolean(value)))].slice(0, 8); }
function recommendationAction(title: string) { return `Address ${title.toLowerCase()} on the primary conversion paths.`; }
