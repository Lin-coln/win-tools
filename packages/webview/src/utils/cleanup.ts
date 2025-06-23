export function registerCleanup(cleanup: () => Promise<void> | void) {
  let cleanPromise: Promise<void> | null = null;

  process.on("exit", runCleanup);
  process.on("beforeExit", runCleanup);
  process.on("SIGINT", runCleanup);
  process.on("SIGTERM", runCleanup);
  process.on("uncaughtException", runCleanup);

  async function runCleanup() {
    if (!cleanPromise) {
      cleanPromise = Promise.resolve().then(() => cleanup());
    }
    return cleanPromise;
  }
}
