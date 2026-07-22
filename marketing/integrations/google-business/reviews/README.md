# Review Workflow

1. Retrieve authorized reviews with author, rating, review text, and date.
2. Store a minimal, access-controlled review record with source ID and retrieval timestamp; do not add sensitive customer context.
3. Create a response draft using `marketing/shared/` voice and `marketing/google-business/templates/review-response-templates.md`.
4. Route the draft to `marketing/automation/approval-queue/` for fact, privacy, and tone review.
5. A human sends the response through the approved Business Profile interface or a future explicitly enabled API action.

No review reply is sent automatically. Never expose private service, account, or project details in a public response.
