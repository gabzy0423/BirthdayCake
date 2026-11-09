"use client";

import dynamic from "next/dynamic";

const BirthdayScene = dynamic(() => import("./BirthdayScene"), {
  ssr: false,
  loading: () => (
    <div className="cake-fallback" role="status">
      <p className="cake-fallback-message">Getting your birthday cake ready…</p>
    </div>
  ),
});

export default function BirthdayCake() {
  return <div className="cake-viewport"><BirthdayScene /></div>;
}
