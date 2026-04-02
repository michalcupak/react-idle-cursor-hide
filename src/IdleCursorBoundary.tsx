import type { CSSProperties, PropsWithChildren } from "react";
import { useCallback, useState } from "react";
import {
  type UseIdleCursorHideOptions,
  useIdleCursorHide,
} from "./useIdleCursorHide";

export interface IdleCursorBoundaryProps
  extends Omit<UseIdleCursorHideOptions, "element">,
    PropsWithChildren {
  /**
   * Optional className for the wrapping element when target is "element".
   */
  wrapperClassName?: string;

  /**
   * Optional inline styles for the wrapping element when target is "element".
   */
  wrapperStyle?: CSSProperties;
}

export function IdleCursorBoundary({
  children,
  target = "element",
  wrapperClassName,
  wrapperStyle,
  ...options
}: IdleCursorBoundaryProps) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const ref = useCallback((node: HTMLDivElement | null) => {
    setElement(node);
  }, []);

  useIdleCursorHide({
    ...options,
    target,
    element: target === "element" ? element : null,
  });

  if (target === "body") {
    return <>{children}</>;
  }

  return (
    <div ref={ref} className={wrapperClassName} style={wrapperStyle}>
      {children}
    </div>
  );
}
