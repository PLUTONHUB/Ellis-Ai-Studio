export const LEAD_ANALYSIS_FAILURE_CODE = "lead_analysis_unavailable";
export const LEAD_DUPLICATE_RECEIVED_CODE = "lead_submission_already_received";

export const LEAD_ANALYSIS_FAILURE_MESSAGE =
  "We received your inquiry, but could not complete the analysis right now. Please try again shortly.";
export const LEAD_DUPLICATE_RECEIVED_MESSAGE =
  "We already received this submission and are reviewing it. There is no need to send it again.";
export const LEAD_SUBMISSION_FAILURE_MESSAGE =
  "We could not complete your submission right now. Please try again in a moment.";

/** Server functions throw codes, never visitor copy. Clients map only this allowlist. */
export function publicLeadSubmissionMessage(reason: unknown): string {
  const code = reason instanceof Error ? reason.message : "";
  if (code === LEAD_ANALYSIS_FAILURE_CODE) return LEAD_ANALYSIS_FAILURE_MESSAGE;
  if (code === LEAD_DUPLICATE_RECEIVED_CODE) return LEAD_DUPLICATE_RECEIVED_MESSAGE;
  return LEAD_SUBMISSION_FAILURE_MESSAGE;
}
