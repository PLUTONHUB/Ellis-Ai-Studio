export const siteUrl = "https://ellisaistudio.com";

type PageSeo = { title: string; description: string; path: string; type?: "website" | "article" };

export function pageHead({ title, description, path, type = "website" }: PageSeo) {
  const url = `${siteUrl}${path}`;
  return { meta: [{ title }, { name: "description", content: description }, { property: "og:type", content: type }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:url", content: url }, { property: "og:image", content: `${siteUrl}/logo/ellis-og-acquisition.png` }, { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:title", content: title }, { name: "twitter:description", content: description }, { name: "twitter:image", content: `${siteUrl}/logo/ellis-og-acquisition.png` }] };
}

export function jsonLd(data: Record<string, unknown>) { return [{ type: "application/ld+json", children: JSON.stringify(data) }]; }

export const organizationSchema = { "@context": "https://schema.org", "@graph": [{ "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "Ellis AI Studio", url: siteUrl, logo: `${siteUrl}/logo/ellis-logo-icon.png`, description: "Business systems consulting and implementation across customer experience, operations automation, integrations, and practical AI." }, { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: "Ellis AI Studio", publisher: { "@id": `${siteUrl}/#organization` } }] };
