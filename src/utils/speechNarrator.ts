// Web Speech API Voice Narrator for Jain Connect Pandit & Puja Procedures
import { PanditStepGuide, PanditPujaStep } from '../types';

export interface SpeechNarratorState {
  isPlaying: boolean;
  isPaused: boolean;
  currentStepIndex?: number;
  rate: number;
  supported: boolean;
}

export type SpeechCallback = (state: SpeechNarratorState) => void;

class SpeechNarratorService {
  private utteranceQueue: SpeechSynthesisUtterance[] = [];
  private currentUtteranceIndex = 0;
  private isPlayingState = false;
  private isPausedState = false;
  private currentStepIndex: number | undefined = undefined;
  private rate = 0.95;
  private listeners: Set<SpeechCallback> = new Set();
  private preferredVoice: SpeechSynthesisVoice | null = null;
  private currentSessionId: string | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  private initVoices() {
    if (!this.isSupported()) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    // Preference: 1. Hindi (hi-IN) or Indian English (en-IN) for accurate pronunciation of Sanskrit/Prakrit Jain terminology
    const indianVoice = voices.find(
      (v) =>
        v.lang === 'hi-IN' ||
        v.lang === 'en-IN' ||
        v.name.toLowerCase().includes('india') ||
        v.name.toLowerCase().includes('hindi')
    );

    // Fallback: natural English voice
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.toLowerCase().includes('natural') ||
          v.name.toLowerCase().includes('google') ||
          v.name.toLowerCase().includes('siri'))
    );

    this.preferredVoice = indianVoice || naturalVoice || voices[0];
  }

  public subscribe(callback: SpeechCallback): () => void {
    this.listeners.add(callback);
    callback(this.getState());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((cb) => cb(state));
  }

  public getState(): SpeechNarratorState {
    return {
      isPlaying: this.isPlayingState,
      isPaused: this.isPausedState,
      currentStepIndex: this.currentStepIndex,
      rate: this.rate,
      supported: this.isSupported()
    };
  }

  public setRate(newRate: number) {
    this.rate = Math.max(0.7, Math.min(1.4, newRate));
    this.notify();
  }

  public cleanTextForSpeech(text: string): string {
    return text
      // Remove markdown headings, bold, italic, code
      .replace(/#{1,6}\s*/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      // Remove links
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Replace bullet marks
      .replace(/^[•\-*]\s+/gm, '')
      // Remove decorative emojis
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      // Clean up multiple newlines/spaces
      .replace(/\n{2,}/g, '. ')
      .replace(/\n/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  // Convert a full Puja procedure into spoken narration segments
  public buildGuideSpeechScript(guide: PanditStepGuide): { text: string; stepIndex?: number }[] {
    const segments: { text: string; stepIndex?: number }[] = [];

    // Introduction
    let intro = `Auspicious Jain Ritual: ${guide.title}. `;
    if (guide.subtitle) intro += `${guide.subtitle}. `;
    if (guide.procedureType) intro += `Procedure Type: ${guide.procedureType}. `;
    if (guide.estimatedDuration) intro += `Estimated duration: ${guide.estimatedDuration}. `;
    segments.push({ text: this.cleanTextForSpeech(intro) });

    // Rules & Purity
    if (guide.rulesAndPurity && guide.rulesAndPurity.length > 0) {
      const rulesText = `Important Derasar purity protocols and rules: ${guide.rulesAndPurity.join('. ')}.`;
      segments.push({ text: this.cleanTextForSpeech(rulesText) });
    }

    // Required Materials
    if (guide.preparations && guide.preparations.length > 0) {
      const prepText = `Required pure materials and preparations: ${guide.preparations.join(', ')}.`;
      segments.push({ text: this.cleanTextForSpeech(prepText) });
    }

    // Each Step
    guide.steps.forEach((step, idx) => {
      let stepText = `Step ${step.stepNumber}: ${step.title}. `;
      if (step.subTitle) stepText += `${step.subTitle}. `;
      stepText += `${step.description}. `;
      if (step.bhavna) stepText += `Spiritual Bhavna and inner contemplation: ${step.bhavna}. `;
      if (step.mantraOrSutra) stepText += `Sacred Mantra: ${step.mantraOrSutra}. `;
      segments.push({
        text: this.cleanTextForSpeech(stepText),
        stepIndex: idx
      });
    });

    // Concluding Bhavna
    if (guide.concludingBhavna) {
      segments.push({
        text: this.cleanTextForSpeech(`Concluding contemplation: ${guide.concludingBhavna}`)
      });
    }

    return segments;
  }

  // Single step narration script
  public buildStepSpeechScript(step: PanditPujaStep): string {
    let text = `Step ${step.stepNumber}: ${step.title}. `;
    if (step.subTitle) text += `${step.subTitle}. `;
    text += `${step.description}. `;
    if (step.bhavna) text += `Spiritual Bhavna: ${step.bhavna}. `;
    if (step.mantraOrSutra) text += `Sacred Mantra: ${step.mantraOrSutra}. `;
    if (step.itemsRequired && step.itemsRequired.length > 0) {
      text += `Materials required: ${step.itemsRequired.join(', ')}. `;
    }
    return this.cleanTextForSpeech(text);
  }

  // Speak segmented text with continuous queue
  public speakSegments(
    segments: { text: string; stepIndex?: number }[],
    sessionId?: string,
    onStepChange?: (stepIndex: number | undefined) => void
  ) {
    if (!this.isSupported()) return;

    this.stop();

    if (segments.length === 0) return;

    const currentSession = sessionId || `session-${Date.now()}`;
    this.currentSessionId = currentSession;

    // Pre-calculate chunks if segments are long (Web Speech API can stall if utterance > 200 chars in some browsers)
    const expandedQueue: { text: string; stepIndex?: number }[] = [];
    segments.forEach((seg) => {
      if (seg.text.length > 180) {
        // Split by sentences
        const sentences = seg.text.match(/[^.!?]+[.!?]+/g) || [seg.text];
        sentences.forEach((s) => {
          const trimmed = s.trim();
          if (trimmed) {
            expandedQueue.push({ text: trimmed, stepIndex: seg.stepIndex });
          }
        });
      } else if (seg.text.trim()) {
        expandedQueue.push(seg);
      }
    });

    if (expandedQueue.length === 0) return;

    this.isPlayingState = true;
    this.isPausedState = false;
    this.currentUtteranceIndex = 0;
    this.notify();

    const playNext = (index: number) => {
      if (this.currentSessionId !== currentSession || !this.isPlayingState) {
        return;
      }

      if (index >= expandedQueue.length) {
        this.isPlayingState = false;
        this.isPausedState = false;
        this.currentStepIndex = undefined;
        this.notify();
        onStepChange?.(undefined);
        return;
      }

      const item = expandedQueue[index];
      this.currentUtteranceIndex = index;
      this.currentStepIndex = item.stepIndex;
      this.notify();
      onStepChange?.(item.stepIndex);

      const utterance = new SpeechSynthesisUtterance(item.text);
      if (this.preferredVoice) {
        utterance.voice = this.preferredVoice;
      }
      utterance.rate = this.rate;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        if (this.currentSessionId === currentSession && this.isPlayingState) {
          playNext(index + 1);
        }
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        if (this.currentSessionId === currentSession && this.isPlayingState) {
          playNext(index + 1);
        }
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('Speech speak error:', err);
        this.stop();
      }
    };

    playNext(0);
  }

  // Speak a continuous text block (e.g. scriptural answer)
  public speakText(text: string, sessionId?: string) {
    const cleaned = this.cleanTextForSpeech(text);
    if (!cleaned) return;

    const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
    const segments = sentences.map((s) => ({ text: s.trim() })).filter((s) => s.text.length > 0);
    this.speakSegments(segments, sessionId);
  }

  public pause() {
    if (!this.isSupported()) return;
    if (this.isPlayingState && !this.isPausedState) {
      window.speechSynthesis.pause();
      this.isPausedState = true;
      this.notify();
    }
  }

  public resume() {
    if (!this.isSupported()) return;
    if (this.isPlayingState && this.isPausedState) {
      window.speechSynthesis.resume();
      this.isPausedState = false;
      this.notify();
    }
  }

  public stop() {
    if (!this.isSupported()) return;
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
    this.currentSessionId = null;
    this.isPlayingState = false;
    this.isPausedState = false;
    this.currentStepIndex = undefined;
    this.notify();
  }

  public getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }
}

export const speechNarrator = new SpeechNarratorService();
