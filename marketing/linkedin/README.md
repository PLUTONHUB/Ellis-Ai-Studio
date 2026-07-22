# LinkedIn Content Workflow

This folder turns meaningful engineering work into reviewable LinkedIn content. Use the files here as modular building blocks: templates shape the message, prompts generate a first draft, examples preserve strong references, and drafts and published posts record the lifecycle.

## Folder guide

- `templates/` — Post structures for common announcement types.
- `prompts/` — Copy-and-use instructions for generating posts from GitHub activity.
- `drafts/` — Generated or hand-written posts awaiting review.
- `published/` — Final, published versions kept for reuse and learning.
- `examples/` — High-quality examples and annotated references.

## Workflow

```text
GitHub Commit or Pull Request -> LinkedIn Draft -> Review -> Publish
```

1. Select a significant commit or merged pull request with a clear audience benefit.
2. Choose the closest post template and the matching generation prompt.
3. Paste the commit or PR details into the prompt, then save the generated post in `drafts/` with a descriptive, dated filename.
4. Review for accuracy, customer value, voice, claims, links, and hashtags. Edit until the post is concise and evidence-based.
5. Publish through the team's approved LinkedIn process, then move the final copy to `published/` and preserve any useful examples or assets.

Do not publish secrets, internal-only context, unverified metrics, or customer details without approval.
