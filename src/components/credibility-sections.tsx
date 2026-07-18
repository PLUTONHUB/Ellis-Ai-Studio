import { m } from "framer-motion";

const reasons = [
  ["Diagnosis Before Implementation", "Every engagement begins with identifying the highest-impact business friction before recommending solutions."],
  ["Built for Service Businesses", "Designed for service businesses that want stronger lead generation, operations, customer experience, and growth systems."],
  ["Modern Conversion Systems", "Every website and automation is built to generate more leads, improve customer experience, and increase conversions."],
  ["Intelligent Operations", "Implement practical systems that reduce manual work, improve response times, and streamline business operations."],
  ["Transparent Recommendations", "No unnecessary upsells. Every recommendation is tied directly to measurable business value."],
] as const;

const deliverables = ["Business Friction Audit", "Revenue Opportunity Analysis", "AI Opportunity Assessment", "Custom Growth Roadmap", "Prioritized Action Plan"] as const;

function ReasonIcon({ index }: { index: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.65, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (index === 0) return <svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="5" {...common}/><path d="m14 14 5 5M10 7v6M7 10h6" {...common}/></svg>;
  if (index === 1) return <svg viewBox="0 0 24 24"><path d="M4 20V8l8-4 8 4v12M8 20v-6h8v6M2 20h20" {...common}/></svg>;
  if (index === 2) return <svg viewBox="0 0 24 24"><path d="M4 18V8M10 18V4M16 18v-7M22 18H2" {...common}/><path d="m15 7 3-3 3 3" {...common}/></svg>;
  if (index === 3) return <svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9" {...common}/><path d="M12 7v5l3 2M18 4v4h-4" {...common}/></svg>;
  return <svg viewBox="0 0 24 24"><path d="M12 3 19 6v5c0 4.3-2.8 7.7-7 10-4.2-2.3-7-5.7-7-10V6l7-3Z" {...common}/><path d="m9 12 2 2 4-4" {...common}/></svg>;
}

export function CredibilitySections() {
  return <><section className="why-ellis"><div className="wrap"><div className="why-ellis-intro"><p className="eyebrow">Our approach</p><h2>Why Businesses Choose Ellis AI Studio</h2><p>Clarity first. Then systems designed around the outcomes that matter to your business.</p></div><div className="why-ellis-grid">{reasons.map(([title, description], index) => <m.article key={title} className="why-ellis-card" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .45, delay: index * .045 }}><div className="why-icon"><ReasonIcon index={index}/></div><h3>{title}</h3><p>{description}</p></m.article>)}</div></div></section><section className="receive"><div className="wrap receive-inner"><div className="receive-copy"><p className="eyebrow">The audit deliverable</p><h2>What You’ll Receive</h2><p>A concise, useful view of the opportunities hiding in your current customer journey and operations.</p></div><div className="receive-list">{deliverables.map((item, index) => <m.div key={item} initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .4, delay: index * .05 }}><span aria-hidden="true">✓</span>{item}</m.div>)}</div></div></section></>;
}
