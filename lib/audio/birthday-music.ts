const melody: [number, number][] = [
  [67, .5], [67, .5], [69, 1], [67, 1], [72, 1], [71, 2],
  [67, .5], [67, .5], [69, 1], [67, 1], [74, 1], [72, 2],
  [67, .5], [67, .5], [79, 1], [76, 1], [72, 1], [71, 1], [69, 2],
  [77, .5], [77, .5], [76, 1], [72, 1], [74, 1], [72, 2],
];

export function createBirthdayMusic(onBlocked: () => void) {
  let context: AudioContext | undefined;
  let wanted = true;
  let landed = false;
  let visible = true;
  let disposed = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const voices = new Set<OscillatorNode>();

  function stop() {
    clearTimeout(timer);
    timer = undefined;
    for (const voice of voices) voice.stop();
    voices.clear();
  }

  function play() {
    if (disposed || !wanted || !landed || !visible || context?.state !== "running" || timer !== undefined) return;
    let time = context.currentTime + 0.04;
    for (const [note, beats] of melody) {
      const voice = context.createOscillator();
      const gain = context.createGain();
      const duration = beats * 0.36;
      voice.type = "square";
      voice.frequency.value = 440 * 2 ** ((note - 69) / 12);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.025, time + 0.01);
      gain.gain.setValueAtTime(0.025, time + duration * 0.7);
      gain.gain.linearRampToValueAtTime(0, time + duration - 0.02);
      voice.connect(gain);
      gain.connect(context.destination);
      voices.add(voice);
      voice.onended = () => {
        voices.delete(voice);
        voice.disconnect();
        gain.disconnect();
      };
      voice.start(time);
      voice.stop(time + duration);
      time += duration;
    }
    timer = setTimeout(() => {
      timer = undefined;
      play();
    }, (time - context.currentTime + 1.5) * 1000);
  }

  async function prepare() {
    if (disposed) return;
    try {
      context ??= new AudioContext();
      await context.resume();
      if (disposed) return;
      if (context.state !== "running") throw new Error("Audio playback unavailable");
      play();
    } catch {
      if (disposed) return;
      wanted = false;
      stop();
      onBlocked();
    }
  }

  return {
    prepare,
    land() {
      if (landed || disposed) return;
      landed = true;
      play();
    },
    setEnabled(enabled: boolean) {
      wanted = enabled;
      if (enabled) void prepare();
      else stop();
    },
    setVisible(value: boolean) {
      visible = value;
      if (value && wanted && context) void prepare();
      else if (!value) stop();
    },
    dispose() {
      disposed = true;
      stop();
      if (context) void context.close().catch(() => {});
    },
  };
}
