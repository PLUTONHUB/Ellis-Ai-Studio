export const siteUrl = "https://ellisaistudio.com";

type PageSeo = { title: string; description: string; path: string; type?: "website" | "article" };

export function pageHead({ title, description, path, type = "website" }: PageSeo) {
  const url = `${siteUrl}${path}`;
  return { meta: [{ title }, { name: "description", content: description }, { property: "og:type", content: type }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:url", content: url }, { property: "og:image", content: `${siteUrl}/logo/ellis-og-acquisition.png` }, { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:title", content: title }, { name: "twitter:description", content: description }, { name: "twitter:image", content: `${siteUrl}/logo/ellis-og-acquisition.png` }] };
}

export function jsonLd(data: Record<string, unknown>) { return [{ type: "application/ld+json", children: JSON.stringify(data) }]; }

// Both founders are listed as peers. `founder` is an array so neither is
// modelled as the organisation's sole principal.
const jacobEllis = { "@type": "Person", "@id": `${siteUrl}/founders/jacob-ellis#person`, name: "Jacob Ellis", jobTitle: "Co-Founder", url: `${siteUrl}/founders/jacob-ellis`, email: "jake@ellisaistudio.com" };
const amberDowling = { "@type": "Person", "@id": `${siteUrl}/founders/amber-dowling#person`, name: "Amber Dowling", jobTitle: "Co-Founder", url: `${siteUrl}/founders/amber-dowling`, email: "amberd@ellisaistudio.com" };

export const organizationSchema = { "@context": "https://schema.org", "@graph": [{ "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "Ellis AI Studio", url: siteUrl, logo: `${siteUrl}/logo/ellis-logo-icon.png`, description: "A founder-led venture studio building AI systems, automation, operational infrastructure and digital products — for clients and as its own ventures.", founder: [{ "@id": jacobEllis["@id"] }, { "@id": amberDowling["@id"] }] }, jacobEllis, amberDowling, { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: "Ellis AI Studio", publisher: { "@id": `${siteUrl}/#organization` } }] };
