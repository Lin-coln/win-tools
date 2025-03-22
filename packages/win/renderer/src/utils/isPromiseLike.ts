export function isPromiseLike(a: unknown): a is PromiseLike<unknown> {
  return Boolean(
    (typeof a === "function" || typeof a === "object") &&
      a &&
      "then" in a &&
      typeof a.then === "function",
  );
}
