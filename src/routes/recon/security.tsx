import { createFileRoute } from "@tanstack/react-router";

import {
  ReconContactCard,
  ReconLegalPage,
  type ReconLegalSection,
} from "~/components/recon-legal";
import { pageHead } from "~/lib/seo";

const sections: ReconLegalSection[] = [
  {
    title: "Production data protection",
    children: (
      <p>
        Production data stored in RECON&apos;s Railway-hosted PostgreSQL database
        is encrypted at rest by the hosting provider. Data in transit is
        protected using secure protocols, including TLS/SSL, and Railway
        encrypts private service-to-service traffic with WireGuard.
      </p>
    ),
  },
  {
    title: "Backups and recovery",
    children: (
      <p>
        RECON&apos;s production PostgreSQL service uses scheduled volume backups
        and point-in-time recovery. Railway&apos;s PITR system continuously archives
        PostgreSQL WAL data and maintains rolling base backups to support
        recovery within the available restore window.
      </p>
    ),
  },
  {
    title: "Data minimization",
    children: (
      <p>
        RECON requests only <code>read_products</code>,{" "}
        <code>read_inventory</code>, and <code>read_orders</code> for its
        intelligence workflows. It does not request direct customer names,
        email addresses, phone numbers, or mailing addresses for those
        workflows.
      </p>
    ),
  },
  {
    title: "Privacy controls",
    children: (
      <p>
        RECON implements Shopify&apos;s privacy compliance webhooks for data
        requests and redaction, including cascading deletion of RECON-owned
        shop data when Shopify sends a shop redaction request.
      </p>
    ),
  },
  {
    title: "Evidence before explanation",
    children: (
      <p>
        RECON&apos;s deterministic evidence and financial semantics remain
        authoritative. AI explanations are optional, validated presentation
        support; they do not replace the underlying finding or invent financial
        values, causes, or recovery claims.
      </p>
    ),
  },
  {
    title: "Report a concern",
    children: (
      <p>
        To report a security or privacy concern, contact{" "}
        <a href="mailto:support@ellisaistudio.com">support@ellisaistudio.com</a>.
      </p>
    ),
  },
];

export const Route = createFileRoute("/recon/security")({
  head: () =>
    pageHead({
      title: "RECON Security | Ellis AI Studio",
      description:
        "Security and data-protection practices for the read-only RECON Shopify app.",
      path: "/recon/security",
    }),
  component: ReconSecurityPage,
});

function ReconSecurityPage() {
  return (
    <ReconLegalPage
      label="RECON · SECURITY"
      title="Security for RECON"
      lede="How RECON protects production service data while keeping its Shopify intelligence read-only."
      sections={sections}
      aside={<ReconContactCard />}
    />
  );
}
