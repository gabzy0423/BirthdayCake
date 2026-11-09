"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useBirthdayMusic } from "./BirthdayMusic";
import { useBlowDetection } from "@/hooks/useBlowDetection";

export const catGreetings = ["happy birthday mom", "happy bday mommy!", "happy birthday mowm!"] as const;
const Experience = createContext<{
  land: () => void;
  paused: boolean;
  setPaused: (value: boolean) => void;
  greetingIndex: number | null;
  showBlowPrompt: boolean;
  extinguished: boolean;
  extinguish: () => void;
  microphoneStatus: string;
  stopListening: () => void;
} | null>(null);
function subscribe(notify: () => void) {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
}
const visibleNow = () => !document.hidden;
const serverVisible = () => true;

export default function BirthdayExperience({ children }: { children: ReactNode }) {
  const { introComplete, setListening } = useBirthdayMusic();
  const [extinguished, setExtinguished] = useState(false);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [landed, setLanded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = useState(0);
  const remaining = useRef(2000);
  const visible = useSyncExternalStore(subscribe, visibleNow, serverVisible);
  const land = useCallback(() => setLanded(true), []);
  const extinguish = useCallback(() => setExtinguished(true), []);
  const showBlowPrompt = landed && index >= catGreetings.length && introComplete && !extinguished;
  const active = showBlowPrompt && visible && microphoneEnabled;
  const microphoneStatus = useBlowDetection(active, extinguish);
  useEffect(() => {
    setListening(active && microphoneStatus !== "error");
    return () => setListening(false);
  }, [active, microphoneStatus, setListening]);
  useEffect(() => {
    if (!landed || paused || !visible || index >= catGreetings.length) return;
    const started = performance.now();
    let finished = false;
    const timer = window.setTimeout(() => {
      finished = true;
      remaining.current = 2000;
      setIndex((current) => current + 1);
    }, remaining.current);
    return () => {
      window.clearTimeout(timer);
      if (!finished) remaining.current = Math.max(0, remaining.current - (performance.now() - started));
    };
  }, [landed, paused, visible, index]);
  return <Experience.Provider value={{ land, paused, setPaused, greetingIndex: landed && index < catGreetings.length ? index : null, showBlowPrompt, extinguished, extinguish, microphoneStatus, stopListening: () => setMicrophoneEnabled(false) }}>{children}</Experience.Provider>;
}

export function useBirthdayExperience() {
  const experience = useContext(Experience);
  if (!experience) throw new Error("Birthday experience requires its provider");
  return experience;
}
