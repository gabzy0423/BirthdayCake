import Image from "next/image";

import BirthdayCake from "@/components/3d/BirthdayCake";

export default function Home() {
  return (
    <main className="birthday-page">
      <div className="birthday-shell">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/icon.svg" alt="" width={36} height={36} />
            <span className="text-xs font-medium tracking-wide text-muted">
              a little birthday magic
            </span>
          </div>
          <button type="button" disabled aria-describedby="preview-note" className="music-control">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
              <path d="M9 18V5l12-2v13M9 9l12-2" />
              <ellipse cx="6" cy="18" rx="3" ry="2.5" />
              <ellipse cx="18" cy="16" rx="3" ry="2.5" />
            </svg>
            Music
          </button>
        </header>

        <section aria-labelledby="birthday-title" className="birthday-content">
          <div className="text-center">
            <p className="chapter-label">A beautiful new chapter</p>
            <h1 id="birthday-title" className="birthday-title">
              Happy birthday,
              <span className="block italic text-sage-dark">Stephanie.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-72 text-sm leading-relaxed text-muted">
              Twenty years of you.
              <br />
              A whole world of wishes ahead.
            </p>
          </div>

          <figure className="cake-stage" aria-label="Stephanie’s 20th birthday cake">
            <span className="stage-spark stage-spark-left" aria-hidden="true">✧</span>
            <span className="stage-spark stage-spark-right" aria-hidden="true">✧</span>
            <div className="stage-orbit" aria-hidden="true" />
            <BirthdayCake />
            <figcaption className="stage-caption">Made just for you</figcaption>
          </figure>

          <div className="wish-controls">
            <h2 className="font-display text-2xl text-foreground">Make a little wish.</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Close your eyes. Think of something wonderful.
            </p>
            <button type="button" disabled aria-describedby="preview-note" className="microphone-button">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
                <rect x="9" y="3" width="6" height="12" rx="3" />
                <path d="M6 11v1a6 6 0 0 0 12 0v-1M12 18v3m-3 0h6" />
              </svg>
              Enable microphone
            </button>
            <button type="button" disabled aria-describedby="preview-note" className="manual-blow-button">
              Or blow out the candles with a tap
            </button>
            <p id="preview-note" className="mt-2 text-xs leading-relaxed text-muted">
              Music and blowing controls coming soon
            </p>
          </div>
        </section>

        <footer className="birthday-footer">
          A little celebration. A lot of love.
          <span aria-hidden="true" className="footer-flower">✳</span>
        </footer>
      </div>
    </main>
  );
}
