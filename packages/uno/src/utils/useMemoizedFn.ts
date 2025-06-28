import { useMemo, useRef } from "react";

type Fn = (this: any, ...args: any[]) => any;

export function useMemoizedFn<T extends Fn>(fn: T): T {
  const fnRef = useRef<T>(fn);
  fnRef.current = useMemo<T>(() => fn, [fn]);

  const memoizedFn = useRef<T>(null);
  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args);
    } as T;
  }
  return memoizedFn.current!;
}
