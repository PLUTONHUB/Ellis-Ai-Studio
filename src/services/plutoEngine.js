import {
  addTask,
  getTasks,
  completeTask,
} from "../data/tasks";

import {
  saveMemory,
  getMemory,
} from "../data/memory";

export function processCommand(command) {
  const text = command.toLowerCase();

  // Greeting
  if (text.includes("hello")) {
    return "Hello Jake 👋";
  }

  // Time
  if (text.includes("time")) {
    return new Date().toLocaleTimeString();
  }

  // Date
  if (text.includes("date")) {
    return new Date().toDateString();
  }

  // Remember something
  if (text.startsWith("remember ")) {
    const parts = text.replace("remember ", "").split(" ");

    const key = parts.shift();
    const value = parts.join(" ");

    saveMemory(key, value);

    return `I'll remember that ${key} is ${value}.`;
  }

  // Recall something
  if (text.startsWith("what is my ")) {
    const key = text.replace("what is my ", "");

    const value = getMemory(key);

    if (value) {
      return `Your ${key} is ${value}.`;
    }

    return `I don't know your ${key} yet.`;
  }

  // Create Task
  if (text.startsWith("create task ")) {
    const taskName = command.replace("create task ", "");

    addTask({
      title: taskName,
      completed: false,
    });

    return `Task created: ${taskName}`;
  }

  // Show Tasks
  if (text === "show tasks") {
    const tasks = getTasks();

    if (tasks.length === 0) {
      return "You don't have any tasks yet.";
    }

    return tasks
      .map(
        (task, index) =>
          `${index + 1}. ${task.completed ? "✅" : "⬜"} ${task.title}`
      )
      .join("\n");
  }

  // Complete Task
  if (text.startsWith("complete task ")) {
    const number = parseInt(
      text.replace("complete task ", ""),
      10
    );

    if (isNaN(number)) {
      return "Please provide a valid task number.";
    }

    completeTask(number - 1);

    return `Completed task ${number}.`;
  }

  // Default response
  return "I'm still learning. That feature hasn't been built yet.";
}
