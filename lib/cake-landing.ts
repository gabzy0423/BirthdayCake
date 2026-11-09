export function cakeLandingY(progress: number): number {
  const t = Math.max(0, Math.min(1, progress));
  if (t < 0.72) return 2.4 * (1 - t / 0.72) ** 3;
  return 0.08 * Math.sin(((t - 0.72) / 0.28) * Math.PI);
}
