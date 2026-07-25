// Web Audio API & Vocal Synthesis for Sacred Navkar Mantra
let audioCtx: AudioContext | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let oscillatorNodes: OscillatorNode[] = [];
let gainNode: GainNode | null = null;

const NAVKAR_VERSES = [
  "Namo Arihantanam",
  "Namo Siddhanam",
  "Namo Ayriyanam",
  "Namo Uvajjhayanam",
  "Namo Loe Savva Sahunam",
  "Eso Pancha Namukkaro",
  "Savva Pava Panasano",
  "Mangalanam Cha Savvesim",
  "Padhamam Havai Mangalam"
];

export function stopNavkarMantraAudio() {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
  }

  oscillatorNodes.forEach((node) => {
    try {
      node.stop();
      node.disconnect();
    } catch (e) {
      // ignore
    }
  });
  oscillatorNodes = [];

  if (gainNode) {
    try {
      gainNode.disconnect();
    } catch (e) {
      // ignore
    }
    gainNode = null;
  }

  if (audioCtx && audioCtx.state !== 'closed') {
    try {
      audioCtx.suspend();
    } catch (e) {
      // ignore
    }
  }
}

export function playNavkarMantraAudio(onEnded?: () => void): void {
  // Ensure previous sound is stopped completely
  stopNavkarMantraAudio();

  // 1. Web Audio API Meditative Temple Drone (Tanpura Harmony)
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      if (!audioCtx) {
        audioCtx = new AudioContextClass();
      } else if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.07, audioCtx.currentTime); // Soft background drone
      masterGain.connect(audioCtx.destination);
      gainNode = masterGain;

      // Soft harmonic frequencies for serene meditation
      const droneFreqs = [130.81, 196.00, 261.63]; // C3, G3, C4
      droneFreqs.forEach((freq) => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        const lfo = audioCtx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.2, audioCtx.currentTime);

        const lfoGain = audioCtx.createGain();
        lfoGain.gain.setValueAtTime(1.5, audioCtx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        osc.connect(masterGain);
        osc.start();
        lfo.start();

        oscillatorNodes.push(osc, lfo);
      });
    }
  } catch (e) {
    console.warn('Web Audio drone setup failed:', e);
  }

  // 2. Chanting Recitation via Speech Synthesis
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();

      const fullMantraText = NAVKAR_VERSES.join('. ');
      const utterance = new SpeechSynthesisUtterance(fullMantraText);
      currentUtterance = utterance;

      utterance.rate = 0.82; // Soothing slow cadence
      utterance.pitch = 0.95; // Deep, calm recitation pitch
      utterance.lang = 'hi-IN';

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => v.lang.includes('hi') || v.lang.includes('IN') || v.name.toLowerCase().includes('india')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        stopNavkarMantraAudio();
        if (onEnded) onEnded();
      };

      utterance.onerror = () => {
        stopNavkarMantraAudio();
        if (onEnded) onEnded();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis failed:', err);
      if (onEnded) onEnded();
    }
  } else {
    if (onEnded) onEnded();
  }
}
