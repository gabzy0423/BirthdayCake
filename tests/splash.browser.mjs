import assert from 'node:assert/strict';
// Run against the local dev server with an isolated headless Chrome on port 9227.
const pages = (await (await fetch('http://127.0.0.1:9227/json/list')).json()).filter(p => p.type === 'page');
assert.equal(pages.length, 1);
const socket = new WebSocket(pages[0].webSocketDebuggerUrl);
await new Promise(r => socket.addEventListener('open', r, { once: true }));
let id = 0;
const pending = new Map();
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (!message.id) return;
  const callback = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) callback.reject(new Error(JSON.stringify(message.error)));
  else callback.resolve(message.result);
});
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const requestId = ++id;
    pending.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
}
async function read(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
const pause = ms => new Promise(r => setTimeout(r, ms));
try {
  await send('Page.enable');
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `
    window.birthdayAudioCheck = { contexts: 0, starts: [], cancels: 0 };
    const NativeAudioContext = window.AudioContext;
    window.AudioContext = class extends NativeAudioContext {
      constructor(...args) { super(...args); window.birthdayAudioCheck.contexts++; }
      createOscillator() {
        const voice = super.createOscillator();
        const start = voice.start.bind(voice), stop = voice.stop.bind(voice);
        voice.start = (...args) => { window.birthdayAudioCheck.starts.push(voice.type); return start(...args); };
        voice.stop = (...args) => { if (!args.length) window.birthdayAudioCheck.cancels++; return stop(...args); };
        return voice;
      }
    };
  ` });
  for (const [width, height, reduced] of [[390, 844, false], [320, 667, true], [390, 844, true]]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }] });
    const micFixture = await send('Page.addScriptToEvaluateOnNewDocument', { source: `
      window.birthdayMicCheck = { requests: 0, stops: 0 };
      window.makeTestStream = async () => {
        const context = new AudioContext();
        await context.resume();
        const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
        const samples = buffer.getChannelData(0);
        let seed = 42;
        for (let i = 0; i < samples.length; i++) { seed = (seed * 16807) % 2147483647; samples[i] = (seed / 2147483647) * 2 - 1; }
        const source = context.createBufferSource(); source.buffer = buffer; source.loop = true;
        const gain = context.createGain(); gain.gain.value = 0;
        const destination = context.createMediaStreamDestination();
        source.connect(gain); gain.connect(destination); source.start();
        window.blowTestGain = gain;
        const track = destination.stream.getTracks()[0]; const stop = track.stop.bind(track);
        let stopped = false;
        track.stop = () => { if (!stopped) { stopped = true; window.birthdayMicCheck.stops++; source.stop(); void context.close(); } stop(); };
        return destination.stream;
      };
      navigator.mediaDevices.getUserMedia = async () => {
        window.birthdayMicCheck.requests++;
        ${!reduced ? "throw new DOMException('Denied', 'NotAllowedError');" : width === 320 ? "return window.makeTestStream();" : "return new Promise(resolve => { window.resolveTestMic = resolve; });"}
      };
    ` });
    await send('Page.navigate', { url: 'http://localhost:3000' });
    for (let i = 0; i < 60; i++) {
      await pause(200);
      if (await read("!!document.querySelector('.invitation-button') && Object.keys(document.querySelector('.invitation-button')).some(key => key.startsWith('__reactProps')) && document.readyState === 'complete'")) break;
    }
    await pause(700);
    assert.equal(await read("document.querySelector('h1')?.textContent"), 'For Stephanie', 'no auto-entry');
    assert.equal(await read("document.querySelectorAll('canvas').length"), 0, 'cake is not mounted behind splash');
    assert.equal(await read('window.birthdayAudioCheck.contexts'), 0, 'no audio context before entry gesture');
    assert.equal(await read('window.birthdayMicCheck.requests'), 0, 'no microphone request before blowing stage');
    assert.ok(await read('document.documentElement.scrollHeight <= innerHeight && document.documentElement.scrollWidth <= innerWidth'), 'invitation fits phone');
    await read("document.querySelector('.invitation-button').focus()");
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r', unmodifiedText: '\r' });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    await pause(reduced ? 100 : 700);
    assert.ok(await read("document.querySelector('#birthday-title')?.textContent.includes('Stephanie')"), 'keyboard enters celebration');
    assert.equal(await read('document.activeElement.id'), 'birthday-title', 'focus follows entry');
    if (!reduced) assert.equal(await read('window.birthdayAudioCheck.starts.length'), 0, 'no song before landing');
    for (let i = 0; i < 60; i++) {
      if (await read('window.birthdayAudioCheck.starts.length > 0')) break;
      await pause(200);
    }
    assert.equal(await read('window.birthdayAudioCheck.starts.length'), 25, 'landing starts one rendition');
    assert.ok(await read("window.birthdayAudioCheck.starts.every(type => type === 'square')"), 'chiptune waveform');
    if (!reduced) {
      await read("document.querySelector('[role=switch]').click()");
      assert.equal(await read("document.querySelector('[role=switch]').getAttribute('aria-checked')"), 'false', 'mute works');
      assert.ok(await read('window.birthdayAudioCheck.cancels > 0 && window.birthdayAudioCheck.cancels <= 25'), 'mute cancels remaining scheduled notes');
    }
    const bubbleText = () => read("document.querySelector('.cat-greeting')?.lastChild.textContent.trim()");
    assert.equal(await bubbleText(), 'happy birthday mom');
    await read("document.querySelector('.cat-pause').click()");
    await pause(reduced ? 10000 : 2300);
    assert.equal(await bubbleText(), 'happy birthday mom', 'pause preserves first bubble');
    assert.ok(await read("!document.querySelector('.blow-prompt p')"), 'cue waits for cats even after music ends');
    if (reduced) {
      assert.equal(await read("document.querySelector('[role=switch]').getAttribute('aria-checked')"), 'false', 'one complete song stops');
      assert.equal(await read('window.birthdayAudioCheck.starts.length'), 25, 'no song loop');
    }
    await read("Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange'))");
    await read("document.querySelector('.cat-pause').click()");
    await pause(2300);
    assert.equal(await bubbleText(), 'happy birthday mom', 'hidden tab remains paused even after checkbox resumes');
    await read("Object.defineProperty(document, 'hidden', { configurable: true, value: false }); document.dispatchEvent(new Event('visibilitychange'))");
    const resumed = Date.now();
    while (await bubbleText() === 'happy birthday mom' && Date.now() - resumed < 2400) await pause(50);
    assert.equal(await bubbleText(), 'happy bday mommy!');
    assert.ok(Date.now() - resumed > 1100, 'remaining reading time is preserved');
    const siameseStarted = Date.now();
    await pause(1600);
    assert.equal(await bubbleText(), 'happy bday mommy!', 'second message lasts two seconds');
    while (await bubbleText() === 'happy bday mommy!' && Date.now() - siameseStarted < 2400) await pause(50);
    assert.equal(await bubbleText(), 'happy birthday mowm!');
    assert.equal(await read("document.querySelectorAll('.cat-greeting').length"), 1);
    assert.ok(await read("(() => { const r = document.querySelector('.cat-greeting').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; })()"), 'bubble fits phone width');
    const calicoStarted = Date.now();
    await pause(1600);
    assert.equal(await bubbleText(), 'happy birthday mowm!');
    while (await bubbleText() && Date.now() - calicoStarted < 2400) await pause(50);
    assert.equal(await bubbleText(), undefined, 'sequence ends without repeating');
    assert.equal(await read("document.querySelector('.blow-prompt p')?.textContent"), 'make a wish, then blow out the candles!');
    assert.ok(await read("(() => { const r = document.querySelector('.blow-prompt').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; })()"), 'cue fits phone width');
    await pause(1000);
    assert.equal(await read('window.birthdayMicCheck.requests'), 1, 'microphone requested automatically once');
    if (width === 320) {
      await read('window.blowTestGain.gain.value = 0.3');
    } else {
      await read("document.querySelector('.manual-blow').click()");
      if (reduced) await read('window.makeTestStream().then(stream => window.resolveTestMic(stream))');
    }
    for (let i = 0; i < 40; i++) {
      if (await read("!!document.querySelector('[aria-label=\"3D birthday cake with extinguished number 20 candles\"]')")) break;
      await pause(100);
    }
    assert.ok(await read("!!document.querySelector('[aria-label=\"3D birthday cake with extinguished number 20 candles\"]')"), 'both flames extinguish through the shared state');
    assert.ok(await read("!document.querySelector('.manual-blow') && !document.querySelector('.blow-prompt p')"), 'controls and prompt disappear after success');
    if (reduced) assert.equal(await read('window.birthdayMicCheck.stops'), 1, 'microphone tracks stop, including late permission resolution');
    await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: micFixture.identifier });
    await send('Page.reload');
    await pause(1200);
    assert.equal(await read("document.querySelector('h1')?.textContent"), 'For Stephanie', 'refresh restores invitation');
  }
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `
    const nativeGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      return type.startsWith('webgl') ? null : nativeGetContext.call(this, type, ...args);
    };
    navigator.mediaDevices.getUserMedia = async () => { throw new DOMException('Denied', 'NotAllowedError'); };
  ` });
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await pause(1200);
  await read("document.querySelector('.invitation-button').focus()");
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  for (let i = 0; i < 100; i++) {
    if (await read("!!document.querySelector('.manual-blow')")) break;
    await pause(200);
  }
  assert.ok(await read("!!document.querySelector('.fallback-cake') && !!document.querySelector('.manual-blow')"), 'WebGL failure still reaches usable manual blowing stage');
  await read("document.querySelector('.manual-blow').click()");
  await pause(100);
  assert.ok(await read("!document.querySelector('.manual-blow')"));
  console.log('Passed: splash/music/cat timing, mic denial, synthetic analyser blow, late permission cleanup, manual extinguishing, and WebGL fallback.');
} finally {
  await send('Browser.close');
}
