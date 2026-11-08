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
      </g>
      <path d="M9 31h5v5H8v-3h1zM18 31h5v2h1v3h-6z" className="cat-paws" />
      <path d="M14 28h1v8h-1zM17 28h1v8h-1z" className="cat-paw-lines" />
    </svg>
  );
}

export default function BirthdayCats() {
  return (
    <footer className="cat-footer">
      <div className="cat-trio" aria-hidden="true">
        <PixelCat coat="black" />
        <PixelCat coat="siamese" />
        <PixelCat coat="calico" />
      </div>
      <label className="cat-pause-control">
        <input type="checkbox" className="cat-pause" />
        Pause animations
      </label>
    </footer>
  );
}
