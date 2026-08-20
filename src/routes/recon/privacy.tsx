import { createFileRoute } from "@tanstack/react-router";

import {
  ReconContactCard,
  ReconLegalPage,
  type ReconLegalSection,
} from "~/components/recon-legal";
import { pageHead } from "~/lib/seo";

const sections: ReconLegalSection[] = [
  {
    title: "What RECON reads",
    children: (
      <>
        <p>
          RECON uses the Shopify permissions <code>read_products</code>,{" "}
          <code>read_inventory</code>, and <code>read_orders</code>. It reads
          the product, inventory, and order-financial information needed to
          calculate store metrics, identify supported opportunities, and show
          scan history.
        </p>
        <p>
          This can include product and variant identifiers, titles, SKUs,
          prices, inventory quantities, order timestamps, line-item quantities,
          discounts, refunds, and financial totals. Order and financial data is
          protected customer data under Shopify&apos;s requirements.
        </p>
      </>
    ),
  },
  {
    title: "What RECON does not request for intelligence",
    children: (
      <>
        <p>
          RECON&apos;s intelligence workflows do not request direct customer
          names, email addresses, phone numbers, or mailing addresses. It does
          not use Shopify data to change products, prices, inventory, or
          orders.
        </p>
      </>
    ),
  },
  {
    title: "How information is used",
    children: (
      <>
        <p>
          RECON uses normalized commerce information to calculate
          deterministic metrics, maintain scan and opportunity history, and
          present the evidence behind each finding. Financial values are shown
          as observed amounts, exposure, or estimates where applicable; they
          are not guarantees of financial outcomes.
        </p>
        <p>
          AI explanations are supplemental. They receive only the sanitized
          opportunity evidence needed to explain a finding, while deterministic
          evidence remains authoritative.
        </p>
      </>
    ),
  },
  {
    title: "Shopify privacy requests",
    children: (
      <>
        <p>
          RECON implements Shopify&apos;s <code>customers/data_request</code>,{" "}
          <code>customers/redact</code>, and <code>shop/redact</code> privacy
          webhooks. The <code>shop/redact</code> workflow performs cascading
          deletion of RECON-owned shop data.
        </p>
      </>
    ),
  },
  {
    title: "Retention and questions",
    children: (
      <>
        <p>
          RECON does not promise a fixed retention period on this page. It
          retains the service data needed to operate the product and meet
          applicable privacy obligations. For questions or requests about your
          data, contact support.
        </p>
      </>
    ),
  },
];

export const Route = createFileRoute("/recon/privacy")({
  head: () =>
    pageHead({
      title: "RECON Privacy | Ellis AI Studio",
      description:
        "How RECON uses read-only Shopify commerce data to provide financial intelligence.",
      path: "/recon/privacy",
    }),
  component: ReconPrivacyPage,
});

function ReconPrivacyPage() {
  return (
    <ReconLegalPage
      label="RECON · PRIVACY"
      title="Privacy for RECON"
      lede="RECON is a read-only embedded Shopify app that analyzes store performance to surface prioritized financial risks and opportunities."
      sections={sections}
      aside={<ReconContactCard />}
    />
  );
}
