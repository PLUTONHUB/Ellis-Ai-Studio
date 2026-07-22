# Google Posts Workflow

Eligible source events may produce drafts for:

- Feature updates
- Website launches
- Portfolio launches
- Service announcements
- Seasonal promotions

Automation reads the event from `marketing/automation/`, applies `marketing/shared/`, and uses the relevant template under `marketing/google-business/templates/`. Drafts are stored in `marketing/content-library/drafts/`, reviewed in the approval queue, and scheduled through `marketing/scheduling/`. The integration must never create a Local Post automatically.

Reference: [Create Posts on Google](https://developers.google.com/my-business/content/posts-data).
