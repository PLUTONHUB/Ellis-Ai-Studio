import { useState, type FormEvent } from "react";

const services = [
  { title: "Website Development", intro: "We build", items: ["One-page websites", "Multi-page websites", "Contact forms", "Quote request forms", "Booking pages", "Mobile optimization"] },
  { title: "Automation", intro: "We implement", items: ["Lead follow-up", "Email automation", "SMS automation", "Review requests", "CRM setup", "Customer notifications"] },
  { title: "AI Solutions", intro: "We build", items: ["AI chat assistants", "AI customer support", "AI receptionists", "Knowledge assistants"] },
  { title: "Custom Systems", intro: "Need something specific?", items: ["We’ll build it."] },
];

const process = [
  ["Business Assessment", "We learn how your business operates and identify opportunities to improve efficiency."],
  ["Discovery Call", "We discuss your goals and recommend the best solution for your business."],
  ["Implementation", "We build, test, and launch your new system."],
  ["Support", "We’re here if you need updates or additional improvements."],
];

export function MarketingPage() {
  return <div className="site-shell">
    <header className="site-nav"><a className="wordmark" href="#home">ELLIS <span>AI STUDIO</span></a><nav aria-label="Primary navigation"><a href="#home">Home</a><a href="#services">Services</a><a href="#how-it-works">How It Works</a><a href="#about">About</a><a href="#contact">Contact</a></nav><a className="button nav-cta" href="#contact">Free Assessment</a></header>
    <main>
      <section className="hero" id="home"><div className="wrap hero-content"><p className="eyebrow">Practical systems for service businesses</p><h1>Systems Built for Service Businesses</h1><p className="lede">We help service businesses save time, capture more leads, and automate repetitive work by building the systems they actually need.</p><div className="actions"><a className="button" href="#contact">Get a Free Business Assessment</a><a className="button button-secondary" href="#services">View Services</a></div></div></section>
      <section className="section" id="services"><div className="wrap"><div className="section-heading"><p className="eyebrow">Services</p><h2>What we can build for your business.</h2></div><div className="service-grid">{services.map((service) => <article className="service-card" key={service.title}><h3>{service.title}</h3><p>{service.intro}</p><ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></div></section>
      <section className="section section-tint" id="how-it-works"><div className="wrap"><div className="section-heading"><p className="eyebrow">How it works</p><h2>A simple process from first conversation to support.</h2></div><div className="process-grid">{process.map(([title, description], index) => <article className="process-step" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>
      <section className="section"><div className="wrap"><div className="section-heading"><p className="eyebrow">Industries</p><h2>Built for service businesses.</h2></div><div className="industry-list">{["Roofing", "HVAC", "Plumbing", "Electrical", "Cleaning", "Landscaping", "Construction", "Auto Repair", "Moving", "Home Services", "…and other service businesses."].map((industry) => <span key={industry}>{industry}</span>)}</div></div></section>
      <section className="section section-tint" id="about"><div className="wrap about"><p className="eyebrow">About Ellis AI Studio</p><h2>Practical systems that make work simpler.</h2><p>Ellis AI Studio helps service businesses simplify the way they work by building practical systems that save time, improve customer experience, and reduce repetitive work.</p></div></section>
      <section className="callout"><div className="wrap"><div><p className="eyebrow">Ready to get started?</p><h2>Let’s find the next practical improvement for your business.</h2></div><a className="button button-light" href="#contact">Get a Free Business Assessment</a></div></section>
      <section className="section" id="contact"><div className="wrap contact-grid"><div><p className="eyebrow">Contact</p><h2>Tell us about your business.</h2><p className="lede">Share what you would like to improve. We’ll follow up to schedule a discovery call.</p></div><InquiryForm /></div></section>
    </main>
    <footer className="site-footer"><div className="wrap"><span>© {new Date().getFullYear()} Ellis AI Studio</span><div><a href="#services">Services</a><a href="#how-it-works">How It Works</a><a href="#contact">Contact</a><a href="#privacy">Privacy Policy</a></div></div></footer>
  </div>;
}

function InquiryForm() {
  const [message, setMessage] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Discovery Call — ${form.get("business")}`);
    const body = encodeURIComponent(`Name: ${form.get("name")}\nBusiness: ${form.get("business")}\nPhone: ${form.get("phone")}\nEmail: ${form.get("email")}\n\n${form.get("message")}`);
    setMessage("Opening your email app to send your message.");
    window.location.href = `mailto:hello@ellisaistudio.com?subject=${subject}&body=${body}`;
  }
  return <form className="inquiry" onSubmit={submit}><label>Name<input name="name" required autoComplete="name" /></label><label>Business Name<input name="business" required autoComplete="organization" /></label><label>Phone<input name="phone" required type="tel" autoComplete="tel" /></label><label>Email<input name="email" required type="email" autoComplete="email" /></label><label className="full">Message<textarea name="message" required placeholder="Tell us about your business" rows={5} /></label><button className="button" type="submit">Schedule Discovery Call</button><p className="form-note" role="status">{message}</p></form>;
}
