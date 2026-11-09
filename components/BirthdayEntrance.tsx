"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function BirthdayEntrance({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<"invitation" | "opening" | "entered">("invitation");
  const celebration = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== "opening") return;
    const transition = window.setTimeout(() => setPhase("entered"), 500);
    return () => window.clearTimeout(transition);
  }, [phase]);

  useEffect(() => {
    if (phase !== "entered") return;
    const heading = celebration.current?.querySelector("h1");
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
  }, [phase]);

  if (phase === "entered") return <div ref={celebration}>{children}</div>;

  return (
    <main className="birthday-page birthday-invitation">
      <section className={`invitation-card${phase === "opening" ? " invitation-opening" : ""}`} aria-labelledby="invitation-title">
        <h1 id="invitation-title" className="invitation-title">For Stephanie</h1>
        <svg className="invitation-gift" viewBox="0 0 128 128" shapeRendering="crispEdges" aria-hidden="true">
          <path fill="var(--border)" d="M24 111h84v6H24z" />
          <path fill="var(--sage-dark)" d="M25 53h78v56H25z" />
          <path fill="var(--sage)" d="M29 57h70v48H29z" />
          <path fill="var(--white)" d="M57 57h14v48H57z" />
          <g className="gift-lid">
            <path fill="var(--sage-dark)" d="M19 43h90v20H19z" />
            <path fill="var(--sage)" d="M23 47h82v12H23z" />
            <path fill="var(--white)" d="M57 47h14v12H57z" />
            <path fill="var(--sage-dark)" d="M37 19h18v6h8v8h2v-8h8v-6h18v18H73v6H55v-6H37z" />
            <path fill="var(--cream)" d="M43 25h8v6h6v6H43zM77 25h8v12H71v-6h6z" />
          </g>
        </svg>
        <button
          type="button"
          className="invitation-button"
          disabled={phase === "opening"}
          onClick={() => {
            if (phase !== "invitation") return;
            setPhase(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "entered" : "opening");
          }}
        >
          Let’s celebrate
        </button>
      </section>
    </main>
  );
}
