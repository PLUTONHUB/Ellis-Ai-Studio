import {
  addTask,
  getTasks,
  completeTask,
} from "../data/tasks";

import {
  saveMemory,
  getMemory,
} from "../data/memory";

import { runBusinessResearch } from "../server/pluto-research";

export async function processCommand(command, dependencies = {}) {
  const text = command.toLowerCase();
  const researchCommand = parseResearchCommand(command);

  if (researchCommand) {
    return runResearchCommand(researchCommand, dependencies.runResearch ?? runBusinessResearch);
  }

  if (text.includes("hello")) return message("Hello Jake 👋");
  if (text.includes("time")) return message(new Date().toLocaleTimeString());
  if (text.includes("date")) return message(new Date().toDateString());

  if (text.startsWith("remember ")) {
    const parts = text.replace("remember ", "").split(" ");
    const key = parts.shift();
    const value = parts.join(" ");
    saveMemory(key, value);
    return message(`I'll remember that ${key} is ${value}.`);
  }

  if (text.startsWith("what is my ")) {
    const key = text.replace("what is my ", "");
    const value = getMemory(key);
    return message(value ? `Your ${key} is ${value}.` : `I don't know your ${key} yet.`);
  }

  if (text.startsWith("create task ")) {
    const taskName = command.replace("create task ", "");
    addTask({ title: taskName, completed: false });
    return message(`Task created: ${taskName}`);
  }

  if (text === "show tasks") {
    const tasks = getTasks();
    if (tasks.length === 0) return message("You don't have any tasks yet.");
    return message(tasks.map((task, index) => `${index + 1}. ${task.completed ? "✅" : "⬜"} ${task.title}`).join("\n"));
  }

  if (text.startsWith("complete task ")) {
    const number = Number.parseInt(text.replace("complete task ", ""), 10);
    if (Number.isNaN(number)) return message("Please provide a valid task number.");
    completeTask(number - 1);
    return message(`Completed task ${number}`);
  }

  return message("I'm still learning. That feature hasn't been built yet.");
}

function message(text) {
  return { kind: "message", message: text };
}

function parseResearchCommand(command) {
  const match = command.trim().match(/^research\s+(.+)$/i);
  if (!match) return null;
  const websiteUrl = match[1].trim();
  try {
    const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(websiteUrl) ? websiteUrl : `https://${websiteUrl}`;
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return { websiteUrl: url.toString(), businessName: url.hostname.replace(/^www\./, "") };
  } catch {
    return null;
  }
}

async function runResearchCommand({ websiteUrl, businessName }, runResearch) {
  try {
    const research = await runResearch({ data: { name: businessName, websiteUrl, idempotencyKey: crypto.randomUUID() } });
    return { kind: "research", message: `Research completed for ${research.businessName}.`, research };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    if (detail.includes("disabled") || detail.includes("SUPABASE_")) {
      return message("Research is not enabled in this environment yet.");
    }
    return message("Research could not be completed. Please confirm the website is reachable and try again.");
  }
}
