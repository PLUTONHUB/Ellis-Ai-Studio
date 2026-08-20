import { createFileRoute } from "@tanstack/react-router";

import {
  ReconContactCard,
  ReconLegalPage,
  type ReconLegalSection,
} from "~/components/recon-legal";
import { pageHead } from "~/lib/seo";

const sections: ReconLegalSection[] = [
  {
    title: "A read-only intelligence service",
    children: (
      <p>
        RECON is an embedded Shopify app that reads approved product,
        inventory, and order information to provide store intelligence. It does
        not change products, prices, inventory, or orders.
      </p>
    ),
  },
  {
    title: "Findings and estimates",
    children: (
      <>
        <p>
          RECON ranks observed risks and opportunities using deterministic
          evidence. Labels such as revenue at risk, discount exposure, refund
          exposure, retail inventory exposure, and growth opportunity estimate
          describe the applicable signal; they do not guarantee recovery,
          savings, profit, or revenue growth.
        </p>
        <p>
          RECON does not provide accounting, tax, legal, or investment advice.
          Merchants remain responsible for evaluating findings and deciding
          what action, if any, to take.
        </p>
      </>
    ),
  },
  {
    title: "AI explanations",
    children: (
      <p>
        When available, AI explanations help make an opportunity easier to
        understand. They are supplemental to the underlying deterministic
        evidence. If an AI explanation is unavailable or does not pass
        validation, RECON shows its deterministic fallback instead.
      </p>
    ),
  },
  {
    title: "Your Shopify store",
    children: (
      <p>
        You are responsible for ensuring that you are authorized to connect a
        Shopify store and grant the approved read-only permissions. RECON uses
        only the Shopify access necessary for the service&apos;s current
        intelligence workflows.
      </p>
    ),
  },
  {
    title: "Questions",
    children: (
      <p>
        For questions about using RECON, its data use, or these service terms,
        contact support.
      </p>
    ),
  },
];

export const Route = createFileRoute("/recon/terms")({
  head: () =>
    pageHead({
      title: "RECON Terms | Ellis AI Studio",
      description:
        "Terms for using RECON's read-only Shopify financial intelligence service.",
      path: "/recon/terms",
    }),
  component: ReconTermsPage,
});

function ReconTermsPage() {
  return (
    <ReconLegalPage
      label="RECON · TERMS"
      title="Terms for using RECON"
      lede="RECON helps Shopify merchants review observed financial risks and opportunities without making changes to their stores."
      sections={sections}
      aside={<ReconContactCard />}
    />
  );
}
