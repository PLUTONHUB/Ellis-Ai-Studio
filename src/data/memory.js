const memory = {};

export function saveMemory(key, value) {
  memory[key] = value;
}

export function getMemory(key) {
  return memory[key];
}

export default memory;