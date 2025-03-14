import process from "node:process";

type Target = NodeJS.Process;
const map = new WeakMap<Target, Set<() => unknown>>();

export default function useCleanup(cb: () => unknown, target: Target) {
  target ??= process;

  if (!map.has(target)) {
    map.set(target, new Set());
    setupCleanup(target);
  }

  const callbacks = map.get(target)!;
  callbacks.add(cb);
}

function setupCleanup(process: Target) {
  process.on("SIGINT", async () => {
    await cleanup();
    if (process.exit) {
      process.exit(0);
    } else {
      process.kill(0);
    }
  });
  process.on("SIGTERM", async () => {
    await cleanup();
    if (process.exit) {
      process.exit(0);
    } else {
      process.kill(0);
    }
  });
  process.on("uncaughtException", async (error) => {
    console.error(error);
    await cleanup();
    if (process.exit) {
      process.exit(1);
    } else {
      process.kill(1);
    }
  });
  async function cleanup() {
    if (!map.has(process)) return;
    for (const callback of map.get(process)!) {
      await callback();
    }
  }
}
