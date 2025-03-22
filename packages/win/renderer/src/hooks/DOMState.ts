import { type RefObject, useEffect, useRef, useState } from "react";

export function useHovered<T extends HTMLElement>(
  ref: RefObject<T> | (() => T),
) {
  const [hovered, setHovered] = useState(false);
  useEvents(
    ref,
    ["pointerenter", "pointerleave", "touchend", "pointercancel"],
    (event, e) => {
      setHovered("pointerenter" === event);
    },
    [],
  );
  return hovered;
}

export function useActivated<T extends HTMLElement>(
  ref: RefObject<T> | (() => T),
) {
  const [activated, setActivated] = useState(false);
  useEvents(
    ref,
    [
      "pointerdown",
      "touchstart",
      "pointerup",
      "pointerleave",
      "touchend",
      "pointercancel",
    ],
    (event, e) => {
      setActivated(["pointerdown", "touchstart"].includes(event));
    },
    [],
  );

  return activated;
}

export function useFocused<T extends HTMLElement>(
  ref: RefObject<T> | (() => T),
) {
  const [focused, setFocused] = useState<boolean | "visible">(false);
  const focusVisibleRef = useRef<"touchstart" | boolean>(true);
  useEvents(
    ref,
    ["pointerdown", "pointerup", "touchstart", "pointerleave", "focus", "blur"],
    (event, e) => {
      if (event === "pointerdown") {
        focusVisibleRef.current = false;
      } else if (event === "touchstart") {
        focusVisibleRef.current = "touchstart";
      } else if (["pointerup", "pointerleave"].includes(event)) {
        if (focusVisibleRef.current === "touchstart") return;
        focusVisibleRef.current = true;
      }

      if (event === "focus") {
        if (focusVisibleRef.current === "touchstart") {
          setFocused(true);
        } else {
          setFocused(focusVisibleRef.current ? "visible" : true);
        }
      } else if (event === "blur") {
        if (focusVisibleRef.current === "touchstart") {
          focusVisibleRef.current = true;
        }
        setFocused(false);
      }
    },
    [],
  );

  return focused;
}

function useEvents<T extends HTMLElement>(
  ref: RefObject<T> | (() => T),
  events: string[],
  cb: (name: string, e: any) => unknown,
  deps?: unknown[],
) {
  useEffect(() => {
    const el = typeof ref === "function" ? ref() : ref.current;
    if (!el) return;
    const removeHandlers = events.map((event) => {
      const handler = (e: any) => {
        cb(event, e);
      };
      el.addEventListener(event, handler);
      return () => el.removeEventListener(event, handler);
    });
    return () => {
      removeHandlers.forEach((fn) => fn());
    };
  }, deps);
}
