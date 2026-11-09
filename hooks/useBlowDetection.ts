"use client";

import { useEffect, useState } from "react";
import { createBlowDetector } from "@/lib/audio/blow-detector";

export function useBlowDetection(active: boolean, onBlow: () => void) {
  const [status, setStatus] = useState<"idle" | "requesting" | "listening" | "error">("idle");
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let stream: MediaStream | undefined;
    let context: AudioContext | undefined;
    let source: MediaStreamAudioSourceNode | undefined;
    let analyser: AnalyserNode | undefined;
    let frame = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      source?.disconnect();
      analyser?.disconnect();
      stream?.getTracks().forEach((track) => track.stop());
      if (context && context.state !== "closed") void context.close().catch(() => {});
    };
    async function start() {
      await Promise.resolve();
      if (cancelled) return;
      setStatus("requesting");
      try {
        if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia || !window.AudioContext) throw new Error("Microphone unavailable");
        stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
        if (cancelled) { stop(); return; }
        context = new AudioContext();
        await context.resume();
        if (cancelled) { stop(); return; }
        if (context.state !== "running") throw new Error("Microphone audio unavailable");
        source = context.createMediaStreamSource(stream);
        analyser = context.createAnalyser();
        analyser.fftSize = 1024;
        source.connect(analyser);
        const waveform = new Float32Array(analyser.fftSize);
        const spectrum = new Uint8Array(analyser.frequencyBinCount);
        const highStart = Math.floor(1000 * analyser.fftSize / context.sampleRate);
        const detect = createBlowDetector();
        let previous = performance.now();
        setStatus("listening");
        const sample = (now: number) => {
          if (cancelled || !analyser) return;
          analyser.getFloatTimeDomainData(waveform);
          analyser.getByteFrequencyData(spectrum);
          let energy = 0;
          for (const value of waveform) energy += value * value;
          let total = 0;
          let high = 0;
          for (let i = 0; i < spectrum.length; i++) {
            total += spectrum[i];
            if (i >= highStart) high += spectrum[i];
          }
          const blown = detect(Math.sqrt(energy / waveform.length), total ? high / total : 0, now - previous);
          previous = now;
          if (blown) { stop(); onBlow(); return; }
          frame = requestAnimationFrame(sample);
        };
        frame = requestAnimationFrame(sample);
      } catch {
        stop();
        if (!cancelled) setStatus("error");
      }
    }
    void start();
    return () => { cancelled = true; stop(); };
  }, [active, onBlow]);
  return active ? status : "idle";
}
