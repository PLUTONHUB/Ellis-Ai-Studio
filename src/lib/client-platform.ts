export const clientPlatform = {
  brand: "Ellis AI Studio",
  positioning: "Business Growth Partner for service businesses",
  workspaceLabel: "Business Growth Workspace",
  workspaceDescription: "An executive view of business health, growth priorities, implementation progress, and results.",
  journey: ["Business Intelligence", "Friction Audit", "Growth Opportunities", "Deliverables", "Results"],
  navigation: ["Dashboard", "Business Intelligence", "Friction Audit", "Growth Opportunities", "Executive Reports", "Deliverables", "Integrations", "Documents", "Meetings", "Messages", "Invoices", "Settings"],
  pillars: ["Discovery", "Conversion", "Response Speed", "Operations", "Customer Experience", "Business Intelligence", "Growth Systems"],
  scoreLegend: [
    { label: "Optimized", range: "90–100" },
    { label: "Healthy", range: "75–89" },
    { label: "Needs Improvement", range: "60–74" },
    { label: "Significant Friction", range: "40–59" },
    { label: "Critical", range: "Below 40" },
  ],
} as const;

export type ClientWorkspaceSection = (typeof clientPlatform.navigation)[number];

export function workspaceSectionDescription(section: ClientWorkspaceSection): string {
  const descriptions: Record<ClientWorkspaceSection, string> = {
    Dashboard: clientPlatform.workspaceDescription,
    "Business Intelligence": "Understand current business health, positioning, and the conditions affecting growth.",
    "Friction Audit": "Review the seven business systems that influence revenue, customer experience, and scalable execution.",
    "Growth Opportunities": "Prioritize the next actions by business impact, implementation effort, and expected return.",
    "Executive Reports": "Review concise decision-ready summaries of progress, priorities, and outcomes.",
    Deliverables: "Track the approved systems, assets, and implementation work moving your business forward.",
    Integrations: "Connect only the business systems needed for the approved work in progress.",
    Documents: "Keep agreements, reports, meeting notes, and implementation materials organized in one place.",
    Meetings: "Stay aligned on decisions, milestones, and next actions.",
    Messages: "Keep project communication and decisions clear, focused, and easy to find.",
    Invoices: "Review engagement billing, receipts, and upcoming milestones.",
    Settings: "Manage your business profile and workspace communication preferences.",
  };
  return descriptions[section];
}
