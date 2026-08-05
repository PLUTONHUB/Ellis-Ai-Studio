import { runAutonomousVideoCycle } from "../src/lib/video-operations.server";
const interval = Number(process.env.CONTENT_VIDEO_INTERVAL_MS ?? 30000);
console.log(JSON.stringify({ runner: "content-video", intervalMs: interval, status: "started" }));
while (true) { try { console.log(JSON.stringify({ at: new Date().toISOString(), ...(await runAutonomousVideoCycle()) })); } catch (error) { console.error(error instanceof Error ? error.message : String(error)); } await new Promise((resolve) => setTimeout(resolve, interval)); }
