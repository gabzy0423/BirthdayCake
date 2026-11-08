"use client";

import dynamic from "next/dynamic";
import CakeFallback from "./CakeFallback";

const BirthdayScene = dynamic(() => import("./BirthdayScene"), {
  ssr: false,
  loading: () => <CakeFallback message="Getting your birthday cake ready…" />,
});

export default function BirthdayCake() {
  return <div className="cake-viewport"><BirthdayScene /></div>;
}
