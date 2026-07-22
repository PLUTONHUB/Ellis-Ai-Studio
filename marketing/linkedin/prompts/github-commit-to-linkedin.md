# Generate a LinkedIn Post from a GitHub Commit

Use this prompt with the commit message, diff summary, and any approved context.

```text
Write a LinkedIn post from the GitHub commit below.

Audience: [target audience]
Post type: [Project Launch | Feature Update | Case Study | Founder Update | Milestone Announcement]
Voice: clear, credible, conversational, and concise
Goal: explain the audience benefit, not the implementation details alone

Commit message:
[paste commit message]

Diff summary or release notes:
[paste summary]

Approved context, metrics, links, or claims:
[paste context]

Constraints:
- Do not invent facts, metrics, customer names, or timelines.
- Exclude secrets, internal-only details, and unverified claims.
- Use a strong hook, short paragraphs, and 3–5 relevant hashtags.
- Include a specific call to action.
- Return the finished post only, followed by a one-line fact-check list.
```
