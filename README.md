# react-idle-cursor-hide

Small React utility package that hides the mouse cursor after a period of inactivity.

It provides:

- `useIdleCursorHide()` hook
- `IdleCursorBoundary` wrapper component

Useful for kiosk apps, signage players, fullscreen dashboards, media viewers, and touch-first interfaces.

## Installation

```bash
npm install react-idle-cursor-hide
```

## Required CSS

Import the packaged CSS once in your app:

```tsx
import "react-idle-cursor-hide/styles.css";
```

## Quick start

### Apply to the entire page

```tsx
import { useIdleCursorHide } from "react-idle-cursor-hide";
import "react-idle-cursor-hide/styles.css";

export default function App() {
  useIdleCursorHide({
    idleMs: 2000,
    target: "body",
  });

  return <main>My app</main>;
}
```

### Apply only inside a container

```tsx
import { IdleCursorBoundary } from "react-idle-cursor-hide";
import "react-idle-cursor-hide/styles.css";

export default function App() {
  return (
    <IdleCursorBoundary idleMs={1500} wrapperStyle={{ minHeight: "100vh" }}>
      <main>My app</main>
    </IdleCursorBoundary>
  );
}
```

## API

### `useIdleCursorHide(options)`

Returns a boolean `hidden` state.

#### Options

- `idleMs?: number` — inactivity timeout in milliseconds, default `2000`
- `disabled?: boolean` — disable behavior, default `false`
- `initiallyHidden?: boolean` — start hidden, default `false`
- `className?: string` — class applied when hidden, default `idle-cursor-hidden`
- `target?: "body" | "element"` — where to apply the class, default `body`
- `element?: HTMLElement | null` — target element when `target: "element"`
- `events?: Array<keyof WindowEventMap>` — events that reset inactivity timer

### `IdleCursorBoundary`

Props are the same as the hook options except `element`, plus:

- `wrapperClassName?: string`
- `wrapperStyle?: React.CSSProperties`

By default, the component wraps children in a `div` and hides the cursor on that container.

## Advanced example

```tsx
import { useRef } from "react";
import { useIdleCursorHide } from "react-idle-cursor-hide";
import "react-idle-cursor-hide/styles.css";

export default function Player() {
  const ref = useRef<HTMLDivElement>(null);

  const hidden = useIdleCursorHide({
    idleMs: 3000,
    target: "element",
    element: ref.current,
    events: ["mousemove", "mousedown", "touchstart", "keydown"],
  });

  return (
    <div ref={ref} style={{ minHeight: "100vh" }}>
      Cursor hidden: {String(hidden)}
    </div>
  );
}
```

## Build

```bash
npm install
npm run build
```

Output goes to `dist/`.

## Notes

- The package is SSR-safe because DOM access happens inside `useEffect`.
- This hides the cursor via CSS inside the browser window. It does not control the operating system cursor outside the browser.
- For Raspberry Pi kiosk deployments, browser-level hiding is often enough, but compositor-level cursor suppression can still be more robust.

## License

MIT
