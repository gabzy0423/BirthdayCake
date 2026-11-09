export const blowSettings = { calibrationMs: 600, sustainedMs: 280, minimumRms: 0.045, noiseMultiplier: 3, highBandRatio: 0.22 };

export function createBlowDetector() {
  // shortcut: breathy speech can resemble blowing; tune thresholds after real-device calibration.
  let elapsed = 0;
  let noise = 0;
  let samples = 0;
  let sustained = 0;
  let detected = false;
  return (rms: number, highBandRatio: number, deltaMs: number) => {
    if (detected) return false;
    const delta = Math.min(Math.max(deltaMs, 0), 50);
    elapsed += delta;
    if (elapsed < blowSettings.calibrationMs) {
      noise += rms;
      samples++;
      return false;
    }
    const threshold = Math.max(blowSettings.minimumRms, (noise / Math.max(samples, 1)) * blowSettings.noiseMultiplier);
    sustained = rms >= threshold && highBandRatio >= blowSettings.highBandRatio ? sustained + delta : 0;
    if (sustained < blowSettings.sustainedMs) return false;
    detected = true;
    return true;
  };
}
