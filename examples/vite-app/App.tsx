import { IdleCursorBoundary } from "react-idle-cursor-hide";
import "react-idle-cursor-hide/styles.css";

export default function App() {
  return (
    <IdleCursorBoundary
      idleMs={2000}
      target="body"
      wrapperStyle={{ minHeight: "100vh" }}
    >
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div>
          <h1>React idle cursor demo</h1>
          <p>Move the mouse. After 2 seconds of inactivity the cursor hides.</p>
        </div>
      </main>
    </IdleCursorBoundary>
  );
}
