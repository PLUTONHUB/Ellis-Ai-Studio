import type { LeadProblemCategory } from "~/types/lead";

export const ELLIS_SYSTEMS = {
  lead_intake: { name: "Lead Intake System", description: "Captures and standardizes new business inquiries.", categories: ["acquisition", "conversion", "lead_management"] },
  lead_qualification: { name: "Lead Qualification System", description: "Qualifies inquiries against clear business rules.", categories: ["lead_management", "conversion"] },
  lead_response: { name: "Lead Response + Qualification System", description: "Qualifies, routes, and responds to new inquiries quickly.", categories: ["lead_management", "customer_experience", "conversion"] },
  lead_follow_up: { name: "Lead Follow-Up System", description: "Keeps appropriate prospects moving through a consistent follow-up process.", categories: ["lead_management", "conversion", "customer_experience"] },
  crm_integration: { name: "CRM Integration System", description: "Connects lead and customer data between the tools that teams use.", categories: ["lead_management", "operations", "intelligence"] },
  scheduling: { name: "Scheduling Automation", description: "Reduces back-and-forth and routes customers to the right appointment path.", categories: ["lead_management", "customer_experience"] },
  review_generation: { name: "Review Generation System", description: "Creates a reliable, appropriate review-request process.", categories: ["growth", "customer_experience"] },
  customer_support: { name: "Customer Support System", description: "Improves how customers get answers and handoffs.", categories: ["customer_experience", "operations"] },
  estimate_intake: { name: "Estimate + Quote Intake System", description: "Structures estimate requests before they reach the team.", categories: ["lead_management", "operations", "conversion"] },
  content_operations: { name: "Content Operations System", description: "Organizes repeatable content workflows and approvals.", categories: ["growth", "operations"] },
  reporting: { name: "Business Reporting System", description: "Creates useful visibility from existing business activity.", categories: ["intelligence", "operations", "growth"] },
  executive_intelligence: { name: "Executive Intelligence System", description: "Turns operational data into decision-ready business intelligence.", categories: ["intelligence", "operations"] },
  retention: { name: "Retention Automation System", description: "Supports consistent customer follow-up and retention actions.", categories: ["customer_experience", "growth"] },
  workflow_automation: { name: "Workflow Automation System", description: "Removes repeatable manual handoffs from an operational workflow.", categories: ["operations", "lead_management"] },
  system_integration: { name: "System Integration", description: "Connects fragmented systems so information can move reliably.", categories: ["operations", "intelligence", "lead_management"] },
  custom_system: { name: "Custom Business System", description: "A tailored system that requires discovery before solution design.", categories: ["other"] },
} as const satisfies Record<string, { name: string; description: string; categories: readonly LeadProblemCategory[] }>;
export type EllisSystemKey = keyof typeof ELLIS_SYSTEMS;
export function isEllisSystemKey(value: string): value is EllisSystemKey { return value in ELLIS_SYSTEMS; }
