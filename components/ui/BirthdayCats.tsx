"use client";

import { catGreetings, useBirthdayExperience } from "../BirthdayExperience";

function PixelCat({ coat }: { coat: "black" | "siamese" | "calico" }) {
  return (
    <svg viewBox="0 0 32 40" fill="currentColor" shapeRendering="crispEdges" className={`pixel-cat pixel-cat-${coat}`}>
      <path d="M23 29h5v-8h3v12h-8z" className="cat-tail" />
      <path d="M10 20h12v4h2v12H8V24h2z" />
      {coat === "calico" && <path d="M8 26h6v9H8z" className="cat-orange-patches" />}
      <g className="cat-head">
        <path d="M6 4h4v3h3v2h6V7h3V4h4v16h-3v3H9v-3H6z" />
        {coat === "siamese" && <path d="M6 4h4v6H6zM22 4h4v6h-4zM10 12h12v8h-3v3h-6v-3h-3z" className="cat-dark-points" />}
        {coat === "calico" && <>
          <path d="M6 4h4v3h3v8H6z" className="cat-orange-patches" />
          <path d="M22 4h4v13h-6v-7h2z" className="cat-dark-points" />
        </>}
        <g className="cat-eyes">
          <path d="M9 14h4v2H9zM19 14h4v2h-4z" className="cat-eye" />
        </g>
        <path d="M15 18h2v2h-2z" className="cat-nose" />
        <g className={`cat-party-hat cat-party-hat-${coat}`}>
          <path fill="var(--sage-dark)" d="M15-10h2v3h1v3h1v3h1v3h1v3h1v3h1v3H9V8h1V5h1V2h1V-1h1V-4h1V-7h1z" />
          <path fill={coat === "calico" ? "var(--cream)" : "var(--sage)"} d="M15-5h2v4h1v3h1v3h1v3h1v1H11V8h1V5h1V2h1V-1h1z" />
          {coat === "black" && <path fill="var(--cream)" d="M14-1h4v2h-4zM12 5h8v2h-8z" />}
          {coat === "siamese" && <path fill="var(--white)" d="M15-2h2v2h-2zM13 3h2v2h-2zM17 6h2v2h-2z" />}
          <path fill="var(--sage-dark)" d="M14-13h4v4h-4z" />
          <path fill="var(--white)" d="M15-12h2v2h-2z" />
          <path fill="var(--sage-dark)" d="M9 10h14v1H9z" />
        </g>
      </g>
      <path d="M9 31h5v5H8v-3h1zM18 31h5v2h1v3h-6z" className="cat-paws" />
      <path d="M14 28h1v8h-1zM17 28h1v8h-1z" className="cat-paw-lines" />
    </svg>
  );
}

export default function BirthdayCats() {
  const { greetingIndex, paused, setPaused, showBlowPrompt, extinguish, microphoneStatus, stopListening } = useBirthdayExperience();
  return (
    <footer className="cat-footer">
      <div role="status" aria-live="polite" aria-atomic="true">
        {greetingIndex !== null && <p className={`cat-greeting cat-greeting-${greetingIndex}`}>
          <span className="sr-only">{["Black cat", "Siamese cat", "Calico cat"][greetingIndex]} says: </span>
          {catGreetings[greetingIndex]}
        </p>}
      </div>
      <div className="cat-trio" aria-hidden="true">
        <PixelCat coat="black" />
        <PixelCat coat="siamese" />
        <PixelCat coat="calico" />
      </div>
      <div className="blow-prompt" role="status" aria-live="polite">
        {showBlowPrompt && <>
          <p>make a wish, then blow out the candles!</p>
          <p className="microphone-status">{microphoneStatus === "requesting" ? "Allow microphone access to blow out the candles. Audio stays on your device." : microphoneStatus === "listening" ? "Listening… gently blow toward your microphone." : microphoneStatus === "error" ? "Microphone unavailable. You can blow out the candles with a tap." : "Microphone stopped. Use the button below."}</p>
        </>}
      </div>
      {showBlowPrompt && <div className="blow-controls">
        <button type="button" className="manual-blow" onClick={extinguish}>Blow candles</button>
        {(microphoneStatus === "listening" || microphoneStatus === "requesting") && <button type="button" className="stop-listening" onClick={stopListening}>Stop listening</button>}
      </div>}
      <label className="cat-pause-control">
        <input type="checkbox" className="cat-pause" checked={paused} onChange={(event) => setPaused(event.target.checked)} />
        Pause animations
      </label>
    </footer>
  );
}
