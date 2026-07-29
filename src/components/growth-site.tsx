import { BrandLogo } from "./brand-logo";
import { PromoCountdown } from "./promo-countdown";
import { StudioPricing } from "./studio-sections";
import type { ReactNode } from "react";
import "~/styles/brand.css";
import "~/styles/page-back.css";
import "~/styles/studio-sections.css";

export const bookingUrl = "https://calendar.app.google/YytWSVvdNyPhCBK58";
export const services = [
  ["Intelligent Websites", "Web experiences designed to connect customer journeys, insight, and measurable demand."],
  ["AI Systems", "Practical intelligence for customer conversations, knowledge, decisions, and operational support."],
  ["Automation Systems", "Connected workflows that reduce manual handoffs and keep critical work moving."],
  ["Custom Software", "Purpose-built portals, dashboards, and internal tools for the way your organization operates."],
  ["SEO Infrastructure", "Technical foundations, search visibility, content systems, and continuous performance monitoring."],
  ["Business Intelligence", "Clear reporting and recommendations that turn operating signals into better decisions."],
];
export const process = ["Research", "Architecture", "Planning", "Engineering", "Deployment", "Monitoring", "Optimization", "Continuous Improvement"];

function Nav() {
  return <header className="site-nav">
    <a className="brand-link" href="/" aria-label="Ellis AI Studio home"><BrandLogo variant="icon" className="brand-logo brand-logo-nav" /><span className="brand-wordmark">ELLIS AI STUDIO</span></a>
    <details className="site-menu"><summary aria-label="Open site navigation"><span>Menu</span><b aria-hidden="true">⌄</b></summary><nav aria-label="Primary navigation"><a href="/services">Infrastructure</a><a href="/#pricing">Pricing</a><a href="/process">Process</a><a href="/about">About</a><a href="/contact">Contact</a></nav></details>
    <a className="button nav-cta" href={bookingUrl} target="_blank" rel="noreferrer">Schedule a consultation</a>
  </header>;
}

function Footer() { return <footer className="site-footer"><div className="wrap"><span>© {new Date().getFullYear()} Ellis AI Studio</span></div></footer>; }

export function PublicPage({ children }: { children: ReactNode }) { return <div className="site-shell"><PromoCountdown /><Nav /><main id="main-content">{children}</main><Footer /></div>; }

export function GrowthHome() {
  const outcomes = [["Create a connected experience", "Design websites, communications, and content systems that give customers a clear path forward."], ["Engineer better operations", "Connect CRM, automation, custom software, and workflows so important work moves with context."], ["Improve with intelligence", "Use AI, analytics, and operating signals to make better decisions and continuously strengthen the system."]];
  const layers = [["Digital presence", "Website, SEO, content, and communications designed as a coherent experience."], ["Operational systems", "CRM, automation, custom software, integrations, and workflows engineered around the work."], ["Intelligence layer", "AI systems, analytics, reporting, and business intelligence that turn signals into action."], ["Continuous improvement", "Monitoring, maintenance, iteration, and disciplined optimization after deployment."]];
  return <PublicPage>
    <section className="hero"><div className="hero-orbit" aria-hidden="true"/><div className="wrap hero-content"><p className="eyebrow">Intelligent business infrastructure</p><h1>Build the connected systems your organization runs on.</h1><p className="lede">Ellis AI Studio researches, designs, engineers, deploys, and improves the digital infrastructure behind customer experience, operations, intelligence, and growth.</p><div className="actions"><a className="button" href={bookingUrl} target="_blank" rel="noreferrer">Schedule a consultation</a><a className="button button-secondary" href="/services">Explore infrastructure</a></div></div></section>
    <section className="section"><div className="wrap"><div className="section-heading"><p className="eyebrow">Connected by design</p><h2>Customer experience, operations, and intelligence—built to work together.</h2></div><div className="service-grid">{outcomes.map(([title, description], index) => <article className="service-card" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>
    <section className="section section-tint"><div className="wrap"><div className="section-heading"><p className="eyebrow">Infrastructure layers</p><h2>Every capability is part of one operating foundation.</h2></div><div className="service-grid">{layers.map(([title, description], index) => <article className="service-card" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>
    <StudioPricing />
    <section className="callout"><div className="wrap"><div><p className="eyebrow">Build the next system</p><h2>Plan the infrastructure your organization will rely on next.</h2></div><a className="button button-light" href={bookingUrl} target="_blank" rel="noreferrer">Schedule a consultation</a></div></section>
  </PublicPage>;
}

export function StandardPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return <PublicPage><section className="hero"><div className="wrap hero-content"><a className="page-back" href="/" onClick={(event) => { if (typeof window !== "undefined" && document.referrer.startsWith(window.location.origin)) { event.preventDefault(); window.history.back(); } }}><span aria-hidden="true">←</span> Back</a><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="lede">{intro}</p></div></section><section className="section"><div className="wrap">{children}</div></section><section className="callout"><div className="wrap"><div><p className="eyebrow">Next step</p><h2>Discuss your business goals with Ellis AI Studio.</h2></div><a className="button button-light" href={bookingUrl} target="_blank" rel="noreferrer">Schedule a consultation</a></div></section></PublicPage>;
}
