export default function CakeFallback({ message }: { message: string }) {
  return (
    <div className="cake-fallback">
      <div className="fallback-cake" role="img" aria-label="Cream birthday cake with white frosting, sage green decorations, and number 20 candles">
        <span className="fallback-candles">20</span>
        <span className="fallback-frosting" />
      </div>
      <p className="cake-fallback-message" role="status">{message}</p>
    </div>
  );
}
