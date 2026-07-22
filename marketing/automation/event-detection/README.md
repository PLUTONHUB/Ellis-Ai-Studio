# Event Detection

Automation v1 accepts only verified, source-linked events. Capture the event type, source URL or ID, timestamp, author/owner, summary, changed files or deployment details, and approval/visibility constraints.

| Event | Minimum usable source context |
| --- | --- |
| GitHub Commit | Commit SHA, message, changed-area summary |
| Pull Request Opened | PR URL, title, description, draft/ready status |
| Pull Request Merged | PR URL, merge SHA, approved summary |
| Website Deployment | Deployment URL, environment, release notes |
| Portfolio Demo Completed | Demo ID, approved screenshots, project summary |
| Client Project Completed | Permission status, approved scope, verified outcome |

Events missing verified context are logged for follow-up, not drafted.
