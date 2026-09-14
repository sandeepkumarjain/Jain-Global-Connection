/**
 * Ambient Temple Audio Synthesizer (Web Audio API)
 *
 * Provides serene, sacred temple background soundscapes designed specifically
 * for Jain rituals and meditative puja reading:
 * 1. Temple Bell ('bell'): Periodic soothing ghanta (temple bell) chime with harmonic overtones and long reverb decay.
 * 2. Tanpura & Om Drone ('tanpura'): Warm meditative C# Indian classical acoustic drone with rich acoustic overtones.
 * 3. Gentle Navkar Chanting ('chant'): Soft rhythmic devotional recitation of the sacred Navkar Mantra set to a peaceful tempo.
 * 4. Combined Temple Ambiance ('bell_and_chant' / 'temple_ambiance'): Harmonious layer of Tanpura drone, occasional soft temple bells, and subtle spiritual frequency.
 */

export type AmbientSoundMode = 'bell' | 'chant' | 'tanpura' | 'temple_ambiance';

class PujaAmbientAudioEngine {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private activeMode: AmbientSoundMode = 'temple_ambiance';
  private volume: number = 0.5; // 0.0 to 1.0

  // Web Audio Nodes
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private bellGain: GainNode | null = null;
  private droneOscillators: OscillatorNode[] = [];
  private lfoNodes: OscillatorNode[] = [];

  // Intervals & Timers
  private bellIntervalId: any = null;
  private chantUtterance: SpeechSynthesisUtterance | null = null;
  private chantLoopTimeoutId: any = null;

  // Listeners for UI state reactivity
  private listeners: Set<(state: { isPlaying: boolean; mode: AmbientSoundMode; volume: number }) => void> = new Set();

  constructor() {
    // Lazy audio context initialization to comply with browser autoplay policies
  }

  private initAudioContext(): boolean {
    try {
      const AudioCtxClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return false;

      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        this.audioCtx = new AudioCtxClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      if (!this.masterGain) {
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);
      }

      return true;
    } catch (err) {
      console.warn('Failed to initialize AudioContext for Puja Ambient Audio:', err);
      return false;
    }
  }

  public subscribe(listener: (state: { isPlaying: boolean; mode: AmbientSoundMode; volume: number }) => void) {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((fn) => fn(state));
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      mode: this.activeMode,
      volume: this.volume
    };
  }

  public setVolume(newVolume: number) {
    this.volume = Math.max(0, Math.min(1, newVolume));
    if (this.audioCtx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
    this.notify();
  }

  public setMode(newMode: AmbientSoundMode) {
    this.activeMode = newMode;
    if (this.isPlaying) {
      // Re-trigger with new mode seamlessly
      this.stop(false);
      this.play(newMode);
    } else {
      this.notify();
    }
  }

  /**
   * Generates a realistic brass temple bell chime with physical harmonics
   */
  public ringTempleBell(singleBell = false) {
    if (!this.initAudioContext() || !this.audioCtx || !this.masterGain) return;

    try {
      const now = this.audioCtx.currentTime;

      // Bell sub-gain
      const bellMaster = this.audioCtx.createGain();
      const currentLevel = singleBell ? 0.45 : 0.28;
      bellMaster.gain.setValueAtTime(currentLevel, now);
      bellMaster.connect(this.masterGain);

      // Jain Temple Bell Harmonics (Root D4 ~ 293.66Hz, D5 ~ 587.33Hz, A5 ~ 880Hz, F#6 ~ 1479Hz)
      const harmonics = [
        { freq: 293.66, gain: 0.35, decay: 4.5 },
        { freq: 587.33, gain: 0.8, decay: 3.8 },
        { freq: 880.0, gain: 0.5, decay: 2.9 },
        { freq: 1174.66, gain: 0.35, decay: 2.2 },
        { freq: 1479.98, gain: 0.2, decay: 1.8 },
        { freq: 2349.32, gain: 0.12, decay: 1.2 }
      ];

      harmonics.forEach(({ freq, gain, decay }) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const g = this.audioCtx.createGain();

        // Slight microtonal detune for authentic hand-hammered temple brass
        const microDetune = (Math.random() - 0.5) * 4;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + microDetune, now);

        // Strike transient (2ms attack) + long exponential reverberant decay
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(gain, now + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(g);
        g.connect(bellMaster);

        osc.start(now);
        osc.stop(now + decay + 0.1);
      });
    } catch (err) {
      console.warn('Error playing temple bell sound:', err);
    }
  }

  /**
   * Synthesizes Indian classical Tanpura Drone (Sa - Pa - Sa')
   */
  private startTanpuraDrone() {
    if (!this.initAudioContext() || !this.audioCtx || !this.masterGain) return;

    this.stopTanpuraDrone();

    try {
      this.droneGain = this.audioCtx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      // Gentle fade in
      this.droneGain.gain.linearRampToValueAtTime(0.18, this.audioCtx.currentTime + 1.5);
      this.droneGain.connect(this.masterGain);

      // C#3 Base Drone Harmonics: C#3 (138.59 Hz), G#3 (207.65 Hz), C#4 (277.18 Hz), F4 (349.23 Hz)
      const freqs = [138.59, 207.65, 277.18, 415.3];

      freqs.forEach((freq, idx) => {
        if (!this.audioCtx || !this.droneGain) return;

        const osc = this.audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        // Low frequency oscillation for gentle acoustic breathing/shimmer
        const lfo = this.audioCtx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.15 + idx * 0.07, this.audioCtx.currentTime);

        const lfoGain = this.audioCtx.createGain();
        lfoGain.gain.setValueAtTime(1.2, this.audioCtx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        osc.connect(this.droneGain);

        osc.start();
        lfo.start();

        this.droneOscillators.push(osc);
        this.lfoNodes.push(lfo);
      });
    } catch (err) {
      console.warn('Error starting tanpura drone:', err);
    }
  }

  private stopTanpuraDrone() {
    this.droneOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // ignore
      }
    });
    this.droneOscillators = [];

    this.lfoNodes.forEach((lfo) => {
      try {
        lfo.stop();
        lfo.disconnect();
      } catch (e) {
        // ignore
      }
    });
    this.lfoNodes = [];

    if (this.droneGain) {
      try {
        this.droneGain.disconnect();
      } catch (e) {
        // ignore
      }
      this.droneGain = null;
    }
  }

  /**
   * Starts rhythmic temple bell interval (every 7 to 10 seconds)
   */
  private startBellLoop() {
    this.stopBellLoop();
    // Initial gentle strike
    this.ringTempleBell();

    this.bellIntervalId = setInterval(() => {
      if (this.isPlaying) {
        this.ringTempleBell();
      }
    }, 8500);
  }

  private stopBellLoop() {
    if (this.bellIntervalId) {
      clearInterval(this.bellIntervalId);
      this.bellIntervalId = null;
    }
  }

  /**
   * Starts gentle rhythmic recitation of sacred Navkar Mantra
   */
  private startNavkarChant() {
    if (!('speechSynthesis' in window)) return;
    this.stopNavkarChant();

    const verses = [
      'नमो अरिहंताणं',
      'नमो सिद्धाणं',
      'नमो आयरियाणं',
      'नमो उवज्झायाणं',
      'नमो लोए सव्व साहूणं',
      'एसो पंच नमुक्कारो',
      'सव्व पावप्पणासणो',
      'मंगलाणं च सव्वेसिं',
      'पढमं हवइ मंगलं'
    ];

    const chantScript = verses.join('. ... ');

    const chantCycle = () => {
      if (!this.isPlaying) return;
      if (this.activeMode !== 'chant' && this.activeMode !== 'temple_ambiance') return;

      try {
        const utterance = new SpeechSynthesisUtterance(chantScript);
        this.chantUtterance = utterance;

        utterance.rate = 0.78; // Slow meditative cadence
        utterance.pitch = 0.9; // Deep, grounded monk chant tone
        utterance.lang = 'hi-IN';

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (v) =>
            v.lang.includes('hi') ||
            v.lang.includes('IN') ||
            v.name.toLowerCase().includes('india') ||
            v.name.toLowerCase().includes('hindi')
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => {
          if (this.isPlaying) {
            // Soft 3.5s breathing pause between Navkar repetitions
            this.chantLoopTimeoutId = setTimeout(() => {
              chantCycle();
            }, 3500);
          }
        };

        utterance.onerror = (e) => {
          // If cancelled or interrupted
          if (this.isPlaying) {
            this.chantLoopTimeoutId = setTimeout(() => {
              chantCycle();
            }, 5000);
          }
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech chant error:', err);
      }
    };

    chantCycle();
  }

  private stopNavkarChant() {
    if (this.chantLoopTimeoutId) {
      clearTimeout(this.chantLoopTimeoutId);
      this.chantLoopTimeoutId = null;
    }
    if (this.chantUtterance) {
      this.chantUtterance.onend = null;
      this.chantUtterance.onerror = null;
      this.chantUtterance = null;
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
  }

  /**
   * Main Start Ambient Soundscape
   */
  public play(mode?: AmbientSoundMode) {
    if (mode) {
      this.activeMode = mode;
    }

    if (!this.initAudioContext()) return;

    this.isPlaying = true;
    this.notify();

    switch (this.activeMode) {
      case 'bell':
        this.stopTanpuraDrone();
        this.stopNavkarChant();
        this.startBellLoop();
        break;

      case 'tanpura':
        this.stopBellLoop();
        this.stopNavkarChant();
        this.startTanpuraDrone();
        break;

      case 'chant':
        this.stopBellLoop();
        this.startTanpuraDrone(); // Soft drone supports chanting
        this.startNavkarChant();
        break;

      case 'temple_ambiance':
      default:
        this.startTanpuraDrone();
        this.startBellLoop();
        this.startNavkarChant();
        break;
    }
  }

  /**
   * Main Stop / Pause Ambient Soundscape
   */
  public stop(notify = true) {
    this.isPlaying = false;
    this.stopBellLoop();
    this.stopTanpuraDrone();
    this.stopNavkarChant();

    if (this.audioCtx && this.audioCtx.state === 'running') {
      try {
        this.audioCtx.suspend();
      } catch (e) {
        // ignore
      }
    }

    if (notify) {
      this.notify();
    }
  }

  public toggle(mode?: AmbientSoundMode) {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play(mode || this.activeMode);
    }
  }
}

export const pujaAmbientAudio = new PujaAmbientAudioEngine();
