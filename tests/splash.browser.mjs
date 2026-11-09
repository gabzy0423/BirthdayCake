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
    assert.ok(await read('document.documentElement.scrollHeight <= innerHeight && document.documentElement.scrollWidth <= innerWidth'), 'invitation fits phone');
    await read("document.querySelector('.invitation-button').focus()");
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r', unmodifiedText: '\r' });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    await pause(reduced ? 100 : 700);
    assert.ok(await read("document.querySelector('#birthday-title')?.textContent.includes('Stephanie')"), 'keyboard enters celebration');
    assert.equal(await read('document.activeElement.id'), 'birthday-title', 'focus follows entry');
    assert.equal(await read("document.querySelector('[role=switch]')?.getAttribute('aria-checked')"), 'false', 'music remains off');
    await send('Page.reload');
    await pause(1200);
    assert.equal(await read("document.querySelector('h1')?.textContent"), 'For Stephanie', 'refresh restores invitation');
  }
  console.log('Passed: invitation, no auto-entry, keyboard entry, focus, refresh, reduced motion, phone fit, music off.');
} finally {
  await send('Browser.close');
}
