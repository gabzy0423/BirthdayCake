import assert from "node:assert/strict";
import test from "node:test";
import { createBirthdayMusic } from "../lib/audio/birthday-music.ts";
import { cakeLandingY } from "../lib/cake-landing.ts";

// Node.js 24 loads the TypeScript helpers directly; audio nodes are simulated here.
let contexts = [];
class FakeContext {
  state = "suspended";
  currentTime = 0;
  destination = {};
  voices = [];
  constructor() { contexts.push(this); }
  async resume() { this.state = "running"; }
  async close() { this.state = "closed"; }
  createOscillator() {
    const node = { frequency: {}, cancelled: false, connect() {}, disconnect() {}, start() {}, stop(when) { if (when === undefined) this.cancelled = true; } };
    this.voices.push(node);
    return node;
  }
  createGain() {
    return { gain: { setValueAtTime() {}, linearRampToValueAtTime() {} }, connect() {}, disconnect() {} };
  }
}

test("music is silent before landing, starts once, stops and cleans up", async () => {
  const original = globalThis.AudioContext;
  globalThis.AudioContext = FakeContext;
  contexts = [];
  const music = createBirthdayMusic(() => assert.fail("unexpected playback failure"), () => {});
  try {
    music.setVisible(true);
    assert.equal(contexts.length, 0, "initial visibility must not request audio");
    await music.prepare();
    const context = contexts[0];
    assert.equal(context.voices.length, 0);
    music.land();
    assert.equal(context.voices.length, 25);
    music.land();
    assert.equal(context.voices.length, 25, "repeated landing cannot overlap melodies");
    music.setEnabled(false);
    assert.ok(context.voices.every(v => v.cancelled));
    music.dispose();
    assert.equal(context.state, "closed");
  } finally { music.dispose(); globalThis.AudioContext = original; }
});

test("muting before landing survives pending audio unlock", async () => {
  const original = globalThis.AudioContext;
  globalThis.AudioContext = FakeContext;
  contexts = [];
  const music = createBirthdayMusic(() => assert.fail("unexpected playback failure"), () => {});
  try {
    const unlocking = music.prepare();
    music.setEnabled(false);
    music.land();
    await unlocking;
    assert.equal(contexts[0].voices.length, 0);
  } finally { music.dispose(); globalThis.AudioContext = original; }
});

test("unsupported audio reports failure without throwing into the page", async () => {
  const original = globalThis.AudioContext;
  globalThis.AudioContext = undefined;
  let blocked = false;
  const music = createBirthdayMusic(() => { blocked = true; }, () => {});
  try { await music.prepare(); assert.ok(blocked); }
  finally { music.dispose(); globalThis.AudioContext = original; }
});

test("landing descends to the plate then makes one small upward bounce", () => {
  assert.equal(cakeLandingY(0), 2.4);
  assert.equal(cakeLandingY(0.72), 0);
  assert.ok(Math.abs(cakeLandingY(0.86) - 0.08) < 0.00001);
  assert.ok(Math.abs(cakeLandingY(1)) < 0.00001);
  assert.ok(cakeLandingY(0.36) < cakeLandingY(0.18));
});

test("microphone listening keeps music silent and restores only the prior on preference", async () => {
  const original = globalThis.AudioContext;
  globalThis.AudioContext = FakeContext;
  contexts = [];
  const music = createBirthdayMusic(() => assert.fail("unexpected failure"), () => {});
  try {
    await music.prepare();
    music.setListening(true);
    music.land();
    music.setEnabled(true);
    await Promise.resolve();
    assert.equal(contexts[0].voices.length, 0);
    music.setEnabled(false);
    music.setListening(false);
    await Promise.resolve();
    assert.equal(contexts[0].voices.length, 0, "an off choice must survive listening");
    music.setEnabled(true);
    await Promise.resolve();
    assert.equal(contexts[0].voices.length, 25);
  } finally { music.dispose(); globalThis.AudioContext = original; }
});

test("natural final note completes once, while interrupted notes never complete the song", async () => {
  const original = globalThis.AudioContext;
  globalThis.AudioContext = FakeContext;
  contexts = [];
  let completed = 0;
  const music = createBirthdayMusic(() => assert.fail("unexpected failure"), () => { completed++; });
  try {
    await music.prepare();
    music.land();
    const context = contexts[0];
    context.voices[0].onended();
    assert.equal(completed, 0);
    music.setVisible(false);
    context.voices[24].onended();
    assert.equal(completed, 0, "hiding the page is not a finished rendition");
    music.setVisible(true);
    await Promise.resolve();
    assert.equal(context.voices.length, 50);
    context.voices[49].onended();
    context.voices[49].onended();
    assert.equal(completed, 1);
    await music.prepare();
    music.setVisible(true);
    assert.equal(context.voices.length, 50, "completed music never automatically restarts");
  } finally { music.dispose(); globalThis.AudioContext = original; }
});

test("post-blow celebration resumes only when enabled and loops until stopped", async () => {
  const original = globalThis.AudioContext;
  globalThis.AudioContext = FakeContext;
  contexts = [];
  const music = createBirthdayMusic(() => assert.fail("unexpected failure"), () => {});
  try {
    await music.prepare();
    music.land();
    const context = contexts[0];
    context.voices[24].onended();
    music.startCelebration();
    await Promise.resolve();
    assert.equal(context.voices.length, 50);
    context.voices[49].onended();
    assert.equal(context.voices.length, 75, "the celebration starts another rendition");
    music.stopCelebration();
    assert.ok(context.voices.slice(-25).every((voice) => voice.cancelled));
  } finally { music.dispose(); globalThis.AudioContext = original; }
});
