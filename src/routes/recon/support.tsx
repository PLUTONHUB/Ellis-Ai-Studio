import { createFileRoute } from "@tanstack/react-router";

import {
  ReconContactCard,
  ReconLegalPage,
  type ReconLegalSection,
} from "~/components/recon-legal";
import { pageHead } from "~/lib/seo";

const sections: ReconLegalSection[] = [
  {
    title: "Get support",
    children: (
      <p>
        For help with RECON, send a message to{" "}
        <a href="mailto:support@ellisaistudio.com">support@ellisaistudio.com</a>.
        Include the name of your store only if it is needed to help us identify
        your installation. Do not send customer information in support
        messages.
      </p>
    ),
  },
  {
    title: "What RECON does",
    children: (
      <p>
        RECON analyzes approved Shopify products, inventory, and order
        financial data to surface prioritized stockout, inventory,
        concentration, discount, refund, and basket opportunities. It also
        provides scan history and before-and-after measurement where the data
        supports it.
      </p>
    ),
  },
  {
    title: "Read-only by design",
    children: (
      <p>
        RECON does not change products, prices, inventory, orders, or customer
        records. A scan reads supported Shopify data, calculates deterministic
        metrics, and returns you to your Opportunities view.
      </p>
    ),
  },
  {
    title: "If a scan cannot complete",
    children: (
      <p>
        Confirm that RECON remains installed with its approved read-only
        permissions, then try the scan again. If the issue continues, contact
        support with the time of the attempt and a description of what you saw;
        avoid including customer information or screenshots of sensitive data.
      </p>
    ),
  },
  {
    title: "Understanding results",
    children: (
      <p>
        RECON separates observed amounts, exposure, operational risk, and
        growth estimates so they are not presented as one combined amount.
        Review each opportunity&apos;s evidence and recommended next action before
        deciding what to do.
      </p>
    ),
  },
];

export const Route = createFileRoute("/recon/support")({
  head: () =>
    pageHead({
      title: "RECON Support | Ellis AI Studio",
      description:
        "Support and data-use guidance for the read-only RECON Shopify app.",
      path: "/recon/support",
    }),
  component: ReconSupportPage,
});

function ReconSupportPage() {
  return (
    <ReconLegalPage
      label="RECON · SUPPORT"
      title="Support for RECON"
      lede="Practical help for using RECON's read-only Shopify intelligence and understanding what its findings mean."
      sections={sections}
      aside={<ReconContactCard />}
    />
  );
}
