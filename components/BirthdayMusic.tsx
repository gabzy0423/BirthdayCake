"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createBirthdayMusic } from "@/lib/audio/birthday-music";

const MusicContext = createContext<{
  enabled: boolean;
  introComplete: boolean;
  prepare: () => void;
  land: () => void;
  toggle: () => void;
  setListening: (listening: boolean) => void;
} | null>(null);

export function BirthdayMusicProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);
  const engine = useRef<ReturnType<typeof createBirthdayMusic> | null>(null);
  const preference = useRef(true);

  useEffect(() => {
    const music = createBirthdayMusic(() => {
      preference.current = false;
      setEnabled(false);
      setIntroComplete(true);
    }, () => {
      preference.current = false;
      setEnabled(false);
      setIntroComplete(true);
    });
    engine.current = music;
    music.setVisible(!document.hidden);
    const visibility = () => music.setVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      music.dispose();
      engine.current = null;
    };
  }, []);

  const prepare = useCallback(() => { void engine.current?.prepare(); }, []);
  const land = useCallback(() => engine.current?.land(), []);
  const setListening = useCallback((value: boolean) => engine.current?.setListening(value), []);
  const toggle = useCallback(() => {
    preference.current = !preference.current;
    setEnabled(preference.current);
    if (!preference.current) setIntroComplete(true);
    engine.current?.setEnabled(preference.current);
  }, []);

  return <MusicContext.Provider value={{ enabled, introComplete, prepare, land, toggle, setListening }}>{children}</MusicContext.Provider>;
}

export function useBirthdayMusic() {
  const music = useContext(MusicContext);
  if (!music) throw new Error("Birthday music requires its provider");
  return music;
}

export function MusicToggle() {
  const { enabled, toggle } = useBirthdayMusic();
  return (
    <button type="button" role="switch" aria-checked={enabled} aria-label="Birthday music" onClick={toggle} className="music-control">
      <span>Music</span>
      <span className="music-switch-track" aria-hidden="true"><span className="music-switch-thumb" /></span>
    </button>
  );
}
