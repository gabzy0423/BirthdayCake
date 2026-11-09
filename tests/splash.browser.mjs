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
  for (const [width, height, reduced] of [[390, 844, false], [320, 667, true]]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }] });
    await send('Page.navigate', { url: 'http://localhost:3000' });
    for (let i = 0; i < 60; i++) {
      await pause(200);
      if (await read("!!document.querySelector('.invitation-button') && Object.keys(document.querySelector('.invitation-button')).some(key => key.startsWith('__reactProps')) && document.readyState === 'complete'")) break;
    }
    await pause(700);
    assert.equal(await read("document.querySelector('h1')?.textContent"), 'For Stephanie', 'no auto-entry');
    assert.equal(await read("document.querySelectorAll('canvas').length"), 0, 'cake is not mounted behind splash');
    assert.equal(await read('window.birthdayAudioCheck.contexts'), 0, 'no audio context before entry gesture');
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
    await read("document.querySelector('[role=switch]').click()");
    assert.equal(await read("document.querySelector('[role=switch]').getAttribute('aria-checked')"), 'false', 'mute works');
    assert.ok(await read('window.birthdayAudioCheck.cancels > 0 && window.birthdayAudioCheck.cancels <= 25'), 'mute cancels remaining scheduled notes');
    await send('Page.reload');
    await pause(1200);
    assert.equal(await read("document.querySelector('h1')?.textContent"), 'For Stephanie', 'refresh restores invitation');
  }
  console.log('Passed: invitation, keyboard entry, focus, refresh, reduced motion, phone fit, landing-triggered chiptune, mute.');
} finally {
  await send('Browser.close');
}
