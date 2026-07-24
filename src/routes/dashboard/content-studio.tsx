import { useEffect, useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";

const load = createServerFn({ method: "GET" }).handler(async () => (await import("~/lib/content-library.server")).listContent());
const schedule = createServerFn({ method: "POST" }).validator((d: { id: string; scheduledFor: string; approved: boolean }) => d).handler(async ({ data }) => (await import("~/lib/content-library.server")).saveSchedule(data));
const saveDraft = createServerFn({ method: "POST" }).validator((d: { id: string; title: string; body: string }) => d).handler(async ({ data }) => (await import("~/lib/content-library.server")).saveContentDraft(data));
const createDraft = createServerFn({ method: "POST" }).validator((d: { title: string; body: string; topic?: string }) => d).handler(async ({ data }) => (await import("~/lib/content-library.server")).createContentDraft(data));
const generateDraft = createServerFn({ method: "POST" }).validator((d: { topic: string }) => d).handler(async ({ data }) => (await import("~/lib/content-ai.server")).generateLinkedInDraft(data.topic));
const repurpose = createServerFn({ method: "POST" }).validator((d: { body: string; platform: "x" | "instagram" | "facebook" | "email" }) => d).handler(async ({ data }) => (await import("~/lib/content-ai.server")).repurposeForPlatform(data.body, data.platform));
const publish = createServerFn({ method: "POST" }).validator((d: { id: string; body: string }) => d).handler(async ({ data }) => { const text = data.body.replace(/^---[\s\S]*?---\s*/, "").split("## Supporting assets")[0].trim(); const result = await (await import("~/lib/content-dispatch.server")).publishContent("linkedin", { text }); if (result.metadata) await (await import("~/lib/content-library.server")).savePublishedMetadata(data.id, result.metadata); return result; });

type StudioPost = Awaited<ReturnType<typeof load>>[number];
const stripFrontmatter = (value: string) => value.replace(/^---[\s\S]*?---\s*/, "").split("## Supporting assets")[0].trim();
const words = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;
const Icon = ({ children }: { children: string }) => <span aria-hidden="true" className="cs-icon">{children}</span>;

export const Route = createFileRoute("/dashboard/content-studio")({ loader: () => load(), component: ContentStudio });

function ContentStudio() {
  const library = Route.useLoaderData();
  const publishPost = useServerFn(publish);
  const schedulePost = useServerFn(schedule);
  const persistDraft = useServerFn(saveDraft);
  const createNewDraft = useServerFn(createDraft);
  const generateNewDraft = useServerFn(generateDraft);
  const repurposeContent = useServerFn(repurpose);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "draft" | "scheduled" | "published">("all");
  const [selectedId, setSelectedId] = useState(library[0]?.id ?? "");
  const selected = library.find((item) => item.id === selectedId) ?? library[0];
  const [title, setTitle] = useState(selected?.title ?? "");
  const [body, setBody] = useState(selected?.body ?? "");
  const [scheduleAt, setScheduleAt] = useState(selected?.scheduledFor ?? "");
  const [platform, setPlatform] = useState("linkedin");
  const [notice, setNotice] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [published, setPublished] = useState(selected?.published);
  const content = stripFrontmatter(body);
  const totalWords = words(content);
  const reading = Math.max(1, Math.ceil(totalWords / 220));
  const score = Math.min(100, Math.round((Math.min(totalWords, 900) / 9) * 0.65 + (content.includes("#") ? 17 : 0) + (content.includes("?") ? 8 : 0) + (content.split("\n\n").length > 5 ? 10 : 0)));
  const visible = useMemo(() => library.filter((item) => { const haystack = (item.title + " " + item.topic).toLowerCase(); const matchesQuery = haystack.includes(query.toLowerCase()); const matchesFilter = filter === "all" || (filter === "published" ? Boolean(item.published) : filter === "scheduled" ? Boolean(item.scheduledFor) : !item.published && !item.scheduledFor); return matchesQuery && matchesFilter; }), [library, query, filter]);

  useEffect(() => { if (!selected) return; setTitle(selected.title); setBody(selected.body); setScheduleAt(selected.scheduledFor ?? ""); setPublished(selected.published); setNotice(""); }, [selectedId]);
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setCommandOpen(true); } if (event.key === "Escape") { setCommandOpen(false); setShowPublish(false); } }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, []);
  useEffect(() => { if (!selected || (title === selected.title && body === selected.body)) return; const timer = window.setTimeout(() => void persistDraft({ data: { id: selected.id, title, body } }).then(() => setNotice("All changes saved")).catch((error: Error) => setNotice(error.message)), 850); return () => window.clearTimeout(timer); }, [title, body, selectedId]);
  if (!selected) return <main className="cs-empty">No content has been added yet.</main>;
  const choose = (post: StudioPost) => setSelectedId(post.id);
  const copy = (value: string) => void navigator.clipboard.writeText(value).then(() => setNotice("Copied to clipboard")).catch(() => setNotice("Copy unavailable"));
  const confirmPublish = () => { setShowPublish(false); setPublishing(true); setNotice("Publishing through LinkedIn…"); void publishPost({ data: { id: selected.id, body } }).then((result) => { setPublished(result.metadata); setNotice("Published to LinkedIn · " + result.id); }).catch((error: Error) => setNotice(error.message)).finally(() => setPublishing(false)); };
  const saveSchedule = () => void schedulePost({ data: { id: selected.id, scheduledFor: scheduleAt, approved: true } }).then(() => setNotice("Approved and scheduled")).catch((error: Error) => setNotice(error.message));
  const createBlank = () => void createNewDraft({ data: { title: "Untitled growth system", body: "Start with the business outcome.\n\n" } }).then((item) => { window.location.assign("/dashboard/content-studio"); return item; }).catch((error: Error) => setNotice(error.message));
  const generate = () => { setNotice("Pluto is generating a draft…"); void generateNewDraft({ data: { topic: aiTopic || "AI-powered growth infrastructure" } }).then((draft) => createNewDraft({ data: { title: draft.title, body: draft.body, topic: "ai" } })).then(() => window.location.assign("/dashboard/content-studio")).catch((error: Error) => setNotice(error.message)).finally(() => setShowAi(false)); };
  const adapt = (destination: "x" | "instagram" | "facebook" | "email") => { setNotice("Pluto is adapting this post…"); void repurposeContent({ data: { body: content, platform: destination } }).then((draft) => { setTitle(draft.title); setBody(draft.body); setNotice("Adapted for " + destination + ". Review and save when ready."); }).catch((error: Error) => setNotice(error.message)); };
  const status = published ? "Published" : scheduleAt ? "Scheduled" : "Draft";

  return <main className="cs-app">
    <aside className="cs-sidebar" aria-label="Studio navigation">
      <Link to="/" className="cs-brand"><span className="cs-brand-mark">E</span><span>ELLIS <small>AI STUDIO</small></span></Link>
      <button className="cs-command" onClick={() => setCommandOpen(true)}><Icon>⌘</Icon> Search <kbd>⌘ K</kbd></button>
      <nav className="cs-nav" aria-label="Primary"><Link to="/dashboard/content-studio" className="cs-nav-active"><Icon>✦</Icon>Content Studio</Link><a href="#calendar"><Icon>▦</Icon>Calendar</a><a href="#campaigns"><Icon>◌</Icon>Campaigns</a><a href="#assets"><Icon>▣</Icon>Assets</a><a href="#analytics"><Icon>⌁</Icon>Analytics</a><a href="#approvals"><Icon>✓</Icon>Approvals</a><a href="#templates"><Icon>◇</Icon>Templates</a></nav>
      <div className="cs-nav-label">WORKSPACE</div><nav className="cs-nav"><a href="#pluto"><Icon>✺</Icon>AI Workspace <span className="cs-badge">Pluto</span></a><Link to="/dashboard/social-accounts"><Icon>◉</Icon>Social Accounts</Link><a href="#settings"><Icon>⚙</Icon>Settings</a></nav>
      <div className="cs-sidebar-user"><span>EA</span><div><strong>Ellis AI Studio</strong><small>Publishing workspace</small></div><button aria-label="Workspace settings">•••</button></div>
    </aside>
    <section className="cs-library" aria-label="Content library">
      <header><div><p className="cs-kicker">LIBRARY</p><h1>Content</h1></div><button className="cs-round" aria-label="Create new post" onClick={createBlank}>+</button></header>
      <label className="cs-search"><Icon>⌕</Icon><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search content" aria-label="Search content" /></label>
      <div className="cs-filter-tabs" role="tablist"><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All <span>{library.length}</span></button><button className={filter === "draft" ? "active" : ""} onClick={() => setFilter("draft")}>Drafts</button><button className={filter === "scheduled" ? "active" : ""} onClick={() => setFilter("scheduled")}>Scheduled</button><button className={filter === "published" ? "active" : ""} onClick={() => setFilter("published")}>Published</button></div>
      <div className="cs-collection"><span>COLLECTIONS</span><button className="active"><Icon>□</Icon>All LinkedIn posts <em>{library.length}</em></button><button><Icon>▱</Icon>Founder notes</button><button><Icon>◈</Icon>AI education</button><button><Icon>△</Icon>Growth systems</button><button><Icon>✺</Icon>Pluto</button></div>
      <div className="cs-card-list">{visible.map((post) => { const postText = stripFrontmatter(post.body); const postStatus = post.published ? "Published" : post.scheduledFor ? "Scheduled" : "Draft"; return <button key={post.id} onClick={() => choose(post)} className={post.id === selected.id ? "cs-content-card selected" : "cs-content-card"}><div className="cs-card-cover"><span>{post.topic.slice(0, 1).toUpperCase()}</span><i className={postStatus.toLowerCase()}>{postStatus}</i></div><div className="cs-card-copy"><strong>{post.title}</strong><small><span className="cs-linkedin">in</span> LinkedIn · {Math.max(1, Math.ceil(words(postText) / 220))} min read</small><footer>{post.lastModified ? "Edited just now" : post.scheduledFor ? "Scheduled" : "Ready to edit"}<span>→</span></footer></div></button>; })}</div>
    </section>
    <section className="cs-editor" aria-label="Content editor">
      <header className="cs-editor-head"><div className="cs-breadcrumb">Content <span>/</span> {selected.topic} <span>/</span> <b>{status}</b></div><div className="cs-editor-actions"><button title="Version history" aria-label="Version history">◴</button><button title="Comments" aria-label="Comments">◌</button><button title="More options" aria-label="More options">•••</button></div></header>
      <div className="cs-editor-scroll"><div className="cs-editor-toolbar" role="toolbar" aria-label="Editor formatting"><button aria-label="Bold"><b>B</b></button><button aria-label="Italic"><i>I</i></button><button aria-label="Heading">H1</button><button aria-label="List">☷</button><button aria-label="Link">⌁</button><span></span><button aria-label="Add image">▧</button><button aria-label="Add carousel">▱</button><button aria-label="Insert hashtag">#</button></div><input className="cs-title-input" value={title} onChange={(event) => setTitle(event.target.value)} aria-label="Post title" /><div className="cs-editor-meta"><span className="cs-avatar">EA</span> Ellis AI Studio <span>·</span> {notice || "Autosave enabled"}</div><textarea className="cs-rich-editor" value={body} onChange={(event) => setBody(event.target.value)} aria-label="Post content" spellCheck />
        <div className="cs-editor-footer"><span>{totalWords} words · {reading} min read</span><button onClick={() => setShowAi(true)}><Icon>✺</Icon> Ask Pluto</button></div>
      </div>
    </section>
    <aside className="cs-inspector" aria-label="Publishing inspector">
      <header><div className="cs-platform-tabs"><button className={platform === "linkedin" ? "active" : ""} onClick={() => setPlatform("linkedin")}>in</button><button onClick={() => setNotice("Connect additional social accounts to enable this preview.")}>𝕏</button><button onClick={() => setNotice("Connect additional social accounts to enable this preview.")}>◎</button></div><button aria-label="Close inspector">×</button></header>
      <div className="cs-preview-label"><span>LIVE PREVIEW</span><button onClick={() => setNotice("Preview is using your current editor content.")}>↗</button></div>
      <article className="cs-linkedin-preview"><div className="cs-preview-profile"><span className="cs-avatar large">EA</span><div><strong>Ellis AI Studio</strong><small>AI-powered growth infrastructure</small><small>Just now · ◉</small></div><button>•••</button></div><p>{content.slice(0, 520)}{content.length > 520 ? "…see more" : ""}</p><div className="cs-preview-actions"><span>♡ Like</span><span>◌ Comment</span><span>↗ Repost</span><span>↥ Send</span></div></article>
      <section className="cs-checklist"><header><h2>Publishing checklist</h2><span>{published ? "Complete" : score >= 72 ? "Ready" : "Review"}</span></header><div><i className="done">✓</i> LinkedIn account connected</div><div><i className={totalWords >= 120 ? "done" : ""}>{totalWords >= 120 ? "✓" : "!"}</i> Clear post structure</div><div><i className={content.includes("#") ? "done" : ""}>{content.includes("#") ? "✓" : "!"}</i> Hashtags included</div><div><i className={published ? "done" : ""}>{published ? "✓" : "○"}</i> Approval and publish</div></section>
      <section className="cs-insight"><div className="cs-score"><strong>{score}</strong><span>Content score</span></div><div><strong>Clear and structured</strong><p>{totalWords >= 500 ? "Reading length is well suited to LinkedIn." : "Consider expanding the practical takeaway."}</p></div></section>
      <section className="cs-checklist"><header><h2>Repurpose</h2><span>AI</span></header><div><button onClick={() => adapt("x")}>Adapt for X</button><button onClick={() => adapt("instagram")}>Adapt for Instagram</button></div><div><button onClick={() => adapt("facebook")}>Adapt for Facebook</button><button onClick={() => adapt("email")}>Adapt for email</button></div></section>
      <section className="cs-schedule"><label>Schedule for<input type="datetime-local" value={scheduleAt} onChange={(event) => setScheduleAt(event.target.value)} /></label><button onClick={saveSchedule}>Save schedule</button></section>
      {published ? <section className="cs-published"><span className="cs-success">✓</span><div><strong>Published</strong><small>{published.shareUrn}</small></div><button onClick={() => copy(published.shareUrn)}>Copy</button>{published.publicPostUrl && <a href={published.publicPostUrl} target="_blank" rel="noreferrer">Open</a>}</section> : <button className="cs-publish" disabled={publishing} onClick={() => setShowPublish(true)}>{publishing ? "Publishing…" : "Publish"}<span>↗</span></button>}
    </aside>
    {showPublish && <div className="cs-modal-backdrop" role="presentation"><section className="cs-publish-modal" role="dialog" aria-modal="true" aria-labelledby="publish-heading"><button className="cs-modal-close" onClick={() => setShowPublish(false)} aria-label="Close">×</button><span className="cs-modal-orb">in</span><p className="cs-kicker">READY TO PUBLISH</p><h2 id="publish-heading">Publish to LinkedIn?</h2><p>This sends the current approved content through your connected LinkedIn account. The returned Share URN and publish metadata will be saved to the local content history.</p><div><button className="cs-modal-cancel" onClick={() => setShowPublish(false)}>Keep editing</button><button className="cs-publish" onClick={confirmPublish}>Publish now <span>↗</span></button></div></section></div>}
    {showAi && <div className="cs-modal-backdrop" role="presentation"><section className="cs-publish-modal" role="dialog" aria-modal="true" aria-labelledby="ai-heading"><button className="cs-modal-close" onClick={() => setShowAi(false)} aria-label="Close">×</button><span className="cs-modal-orb">✺</span><p className="cs-kicker">PLUTO WORKSPACE</p><h2 id="ai-heading">Generate a production-ready draft</h2><p>Pluto will create original LinkedIn content using the Ellis AI Studio systems-engineering voice.</p><label className="cs-search"><input value={aiTopic} onChange={(event) => setAiTopic(event.target.value)} placeholder="Topic or business system" autoFocus /></label><div><button className="cs-modal-cancel" onClick={() => setShowAi(false)}>Cancel</button><button className="cs-publish" onClick={generate}>Generate <span>✺</span></button></div></section></div>}
    {commandOpen && <div className="cs-command-backdrop" onClick={() => setCommandOpen(false)}><section className="cs-command-menu" role="dialog" aria-modal="true" aria-label="Command palette" onClick={(event) => event.stopPropagation()}><label><Icon>⌕</Icon><input autoFocus placeholder="Search content, commands, or settings…" /></label><p>QUICK ACTIONS</p><button onClick={() => { setCommandOpen(false); setShowPublish(true); }}><Icon>↗</Icon> Publish current post <kbd>↵</kbd></button><button onClick={() => { setCommandOpen(false); setNotice("Pluto is ready to help with the selected post."); }}><Icon>✺</Icon> Ask Pluto to improve this post</button><button onClick={() => { setCommandOpen(false); setFilter("draft"); }}><Icon>□</Icon> Show drafts</button></section></div>}
  </main>;
}
