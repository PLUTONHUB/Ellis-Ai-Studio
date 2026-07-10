const tasks = [];

export function addTask(task) {
  tasks.push(task);
}

export function getTasks() {
  return tasks;
}

export function completeTask(index) {
  if (tasks[index]) {
    tasks[index].completed = true;
  }
}

export default tasks;