import assert from "node:assert/strict";
import test from "node:test";
import { createBlowDetector } from "../lib/audio/blow-detector.ts";

function calibrated(noise = 0.005) {
  const detector = createBlowDetector();
  for (let i = 0; i < 40; i++) assert.equal(detector(noise, 0.3, 16), false);
  return detector;
}

test("sustained broadband blowing triggers only once", () => {
  const detect = calibrated();
  let count = 0;
  for (let i = 0; i < 60; i++) if (detect(0.12, 0.7, 16)) count++;
  assert.equal(count, 1);
});

test("quiet, short spikes and low-frequency speech-like signals are rejected", () => {
  const detect = calibrated();
  for (let i = 0; i < 90; i++) assert.equal(detect(0.01, 0.5, 16), false);
  for (let i = 0; i < 5; i++) assert.equal(detect(0.2, 0.7, 16), false);
  assert.equal(detect(0.005, 0.1, 16), false);
  for (let i = 0; i < 90; i++) assert.equal(detect(0.12, 0.1, 16), false);
});

test("ambient noise calibration and stalled sampling cannot cause a false blow", () => {
  const detect = calibrated(0.05);
  for (let i = 0; i < 60; i++) assert.equal(detect(0.08, 0.7, 16), false);
  assert.equal(detect(0.3, 0.7, 5000), false);
});
