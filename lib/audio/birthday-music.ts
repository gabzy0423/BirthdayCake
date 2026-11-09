const melody: [number, number][] = [
  [67, .5], [67, .5], [69, 1], [67, 1], [72, 1], [71, 2],
  [67, .5], [67, .5], [69, 1], [67, 1], [74, 1], [72, 2],
  [67, .5], [67, .5], [79, 1], [76, 1], [72, 1], [71, 1], [69, 2],
  [77, .5], [77, .5], [76, 1], [72, 1], [74, 1], [72, 2],
];

export function createBirthdayMusic(onBlocked: () => void, onFinished: () => void) {
  let context: AudioContext | undefined;
  let wanted = true;
  let landed = false;
  let visible = true;
  let listening = false;
  let disposed = false;
  let playing = false;
  let looping = false;
  let introFinished = false;
  let generation = 0;
  const voices = new Set<OscillatorNode>();

  function stop() {
    generation++;
    playing = false;
    for (const voice of voices) voice.stop();
    voices.clear();
  }

  function play() {
    if (disposed || !wanted || !landed || !visible || listening || introFinished && !looping || context?.state !== "running" || playing) return;
    playing = true;
    const rendition = generation;
    let time = context.currentTime + 0.04;
    for (const [index, [note, beats]] of melody.entries()) {
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
        if (index === melody.length - 1 && generation === rendition && playing && !disposed) {
          playing = false;
          if (looping) play();
          else {
            wanted = false;
            introFinished = true;
            onFinished();
          }
        }
      };
      voice.start(time);
      voice.stop(time + duration);
      time += duration;
    }
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
      if (!enabled) looping = false;
      if (enabled) void prepare();
      else stop();
    },
    setVisible(value: boolean) {
      visible = value;
      if (value && wanted && context) void prepare();
      else if (!value) stop();
    },
    setListening(value: boolean) {
      listening = value;
      if (value) stop();
      else if (wanted && context) void prepare();
    },
    startCelebration() {
      if (disposed) return;
      stop();
      wanted = true;
      listening = false;
      looping = true;
      void prepare();
    },
    stopCelebration() {
      looping = false;
      stop();
    },
    dispose() {
      disposed = true;
      stop();
      if (context) void context.close().catch(() => {});
    },
  };
}
