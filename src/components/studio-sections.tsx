import { useState, type FormEvent } from "react";
import "../styles/studio-pricing-promo.css";

const bookingUrl = "https://calendar.app.google/YytWSVvdNyPhCBK58";

const promotionalPrices = [
  ["Landing Pages", "From $750", "From $300", "Focused conversion pages for a single offer or campaign."],
  ["Multi-page Websites", "From $1,800", "From $720", "Custom websites with clear journeys, connected systems, and conversion paths."],
  ["Website Redesigns", "From $1,200", "From $480", "A thoughtful visual and conversion upgrade for an existing website."],
  ["SEO Foundations", "From $500", "From $200", "Technical and on-page essentials for a stronger search starting point."],
  ["Local SEO Setup", "From $650", "From $260", "Google Business Profile, local structure, and service-area essentials."],
  ["AI Chat Assistants", "From $900", "From $360", "Always-on website assistance for customer questions and lead routing."],
  ["Appointment Booking Systems", "From $450", "From $180", "Simple booking flows that make it easier for customers to choose a time."],
  ["Lead Capture Systems", "From $500", "From $200", "Quote forms and follow-up paths designed to keep leads moving."],
  ["Business Automation", "From $1,000", "From $400", "Practical workflows that reduce repetitive admin work."],
  ["CRM Integrations", "From $1,200", "From $480", "Connected customer, estimate, and job information in one place."],
  ["Review Management", "From $250/mo", "From $100/mo", "A clean process for requesting and organizing customer feedback."],
  ["Maintenance Plans", "From $149/mo", "From $59.60/mo", "Ongoing website care, updates, and small improvements."],
];
const foundingPrices = promotionalPrices;

type ReviewSubmission = { name: string; rating: string; message: string };
const reviewNotice = "No client reviews yet. This section will display verified customer feedback as projects are completed.";

export function StudioPricing() {
  return (
    <section className="studio-pricing" id="pricing">
      <div className="wrap">
        <div className="studio-section-heading">
          <p className="eyebrow">60% Promotional Pricing</p>
          <h2>Practical growth systems—now 60% off.</h2>
          <p>Every service below is currently discounted by 60%. Final scope and pricing are confirmed before work begins.</p>
        </div>
        <div className="pricing-grid">
          {promotionalPrices.map(([service, originalPrice, promotionalPrice, description]) => (
            <article key={service}>
              <p>{service}</p>
              <span className="price-original">{originalPrice}</span>
              <strong>{promotionalPrice}</strong>
              <small className="price-discount">60% off</small>
              <span>{description}</span>
            </article>
          ))}
        </div>
        <a className="button" href={bookingUrl} target="_blank" rel="noreferrer">Request a Business Assessment <span aria-hidden="true">→</span></a>
      </div>
    </section>
  );
}

export function LegacyStudioPricing() {
  return <section className="studio-pricing" id="pricing"><div className="wrap"><div className="studio-section-heading"><p className="eyebrow">Founding Client Pricing</p><h2>Launch pricing for practical systems that move your business forward.</h2><p>Available while Ellis AI Studio builds its initial portfolio. Every project is scoped around your goals, so final pricing is confirmed before work begins.</p></div><div className="pricing-grid">{foundingPrices.map(([service, price, description]) => <article key={service}><p>{service}</p><strong>{price}</strong><span>{description}</span></article>)}</div><a className="button" href={bookingUrl} target="_blank" rel="noreferrer">Request a Business Assessment <span aria-hidden="true">→</span></a></div></section>;
}

export function StudioReviews() {
  const [submissions, setSubmissions] = useState<ReviewSubmission[]>([]);
  const [message, setMessage] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); setSubmissions((reviews) => [...reviews, { name: String(form.get("name")), rating: String(form.get("rating")), message: String(form.get("message")) }]); setMessage("Thank you. This review has been saved as a local preview submission and must be verified before publication."); event.currentTarget.reset(); };
  return <section className="studio-reviews" id="reviews"><div className="wrap"><div className="studio-reviews-top"><div><p className="eyebrow">Reviews</p><h2>Verified feedback will live here.</h2><p>{reviewNotice}</p></div><div className="rating-summary" aria-label="No client reviews yet"><strong>—</strong><span>Average rating</span><small>Verified reviews only</small></div></div><div className="review-grid"><article className="review-placeholder"><span>Verified review</span><p>“Client feedback will appear here after a completed project has been verified.”</p><small>No published reviews yet</small></article><article className="review-placeholder"><span>Project outcome</span><p>“Future customers will be able to see the details that mattered to each client.”</p><small>No published reviews yet</small></article><article className="review-placeholder"><span>Working relationship</span><p>“This space is intentionally reserved for real, attributable customer feedback.”</p><small>No published reviews yet</small></article></div>{submissions.length > 0 && <div className="review-preview" aria-live="polite"><p>Preview submissions awaiting verification: {submissions.length}</p></div>}<form className="review-form" onSubmit={submit}><div><p className="eyebrow">Leave feedback</p><h3>Review submission</h3><p>Submissions are held for verification before they can be published.</p></div><label>Name<input name="name" required autoComplete="name" /></label><label>Rating<select name="rating" required defaultValue=""><option value="" disabled>Select rating</option><option value="5">5 — Excellent</option><option value="4">4 — Very good</option><option value="3">3 — Good</option><option value="2">2 — Needs improvement</option><option value="1">1 — Poor</option></select></label><label className="review-message">Your feedback<textarea name="message" required rows={4} /></label><button className="button" type="submit">Submit for Verification <span aria-hidden="true">→</span></button><p className="review-status" role="status">{message}</p></form></div></section>;
}
