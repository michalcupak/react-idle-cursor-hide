import { useEffect, useMemo, useState } from "react";

export type IdleCursorTarget = "body" | "element";

export interface UseIdleCursorHideOptions {
  /**
   * Delay in milliseconds before the cursor is hidden.
   * @default 2000
   */
  idleMs?: number;

  /**
   * Disable the behavior entirely.
   * @default false
   */
  disabled?: boolean;

  /**
   * Start with the cursor hidden.
   * @default false
   */
  initiallyHidden?: boolean;

  /**
   * CSS class toggled on the target element when hidden.
   * @default "idle-cursor-hidden"
   */
  className?: string;

  /**
   * Whether to apply the class on document.body or on a custom element.
   * @default "body"
   */
  target?: IdleCursorTarget;

  /**
   * The element to target when target is "element".
   */
  element?: HTMLElement | null;

  /**
   * Events that reset the idle timer.
   */
  events?: Array<keyof WindowEventMap>;
}

const DEFAULT_EVENTS: Array<keyof WindowEventMap> = [
  "mousemove",
  "mousedown",
  "mouseup",
  "keydown",
  "keyup",
  "touchstart",
  "touchmove",
  "wheel",
  "pointermove",
];

function getTargetElement(
  target: IdleCursorTarget,
  element?: HTMLElement | null,
): HTMLElement | null {
  if (typeof document === "undefined") {
    return null;
  }

  if (target === "body") {
    return document.body;
  }

  return element ?? null;
}

export function useIdleCursorHide(
  options: UseIdleCursorHideOptions = {},
): boolean {
  const {
    idleMs = 2000,
    disabled = false,
    initiallyHidden = false,
    className = "idle-cursor-hidden",
    target = "body",
    element,
    events = DEFAULT_EVENTS,
  } = options;

  const [hidden, setHidden] = useState(initiallyHidden);

  const stableEvents = useMemo(() => [...events], [events]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const targetElement = getTargetElement(target, element);

    if (!targetElement) {
      return;
    }

    let timerId: number | null = null;

    const clearHideTimer = (): void => {
      if (timerId !== null) {
        window.clearTimeout(timerId);
        timerId = null;
      }
    };

    const applyHidden = (value: boolean): void => {
      targetElement.classList.toggle(className, value);
      setHidden(value);
    };

    const scheduleHide = (): void => {
      clearHideTimer();
      timerId = window.setTimeout(() => {
        applyHidden(true);
      }, idleMs);
    };

    const resetIdleState = (): void => {
      applyHidden(false);
      scheduleHide();
    };

    if (disabled) {
      applyHidden(false);
      return () => {
        clearHideTimer();
        targetElement.classList.remove(className);
      };
    }

    if (initiallyHidden) {
      applyHidden(true);
      scheduleHide();
    } else {
      resetIdleState();
    }

    for (const eventName of stableEvents) {
      window.addEventListener(eventName, resetIdleState, { passive: true });
    }

    return () => {
      clearHideTimer();

      for (const eventName of stableEvents) {
        window.removeEventListener(eventName, resetIdleState);
      }

      targetElement.classList.remove(className);
    };
  }, [
    className,
    disabled,
    element,
    idleMs,
    initiallyHidden,
    stableEvents,
    target,
  ]);

  return hidden;
}
