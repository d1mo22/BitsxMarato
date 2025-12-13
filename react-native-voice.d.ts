declare module 'react-native-voice' {
  export interface SpeechRecognizedEvent {
    value?: string[];
  }

  export interface SpeechErrorEvent {
    error?: {
      message?: string;
      code?: string;
    };
  }

  export interface SpeechResultsEvent {
    value?: string[];
  }

  export interface SpeechStartEvent {
    error?: boolean;
  }

  export interface SpeechEndEvent {
    error?: boolean;
  }

  export interface SpeechVolumeChangedEvent {
    value?: number;
  }

  class Voice {
    static onSpeechStart: ((e: SpeechStartEvent) => void) | null;
    static onSpeechRecognized: ((e: SpeechRecognizedEvent) => void) | null;
    static onSpeechEnd: ((e: SpeechEndEvent) => void) | null;
    static onSpeechError: ((e: SpeechErrorEvent) => void) | null;
    static onSpeechResults: ((e: SpeechResultsEvent) => void) | null;
    static onSpeechPartialResults: ((e: SpeechResultsEvent) => void) | null;
    static onSpeechVolumeChanged: ((e: SpeechVolumeChangedEvent) => void) | null;

    static isAvailable(): Promise<boolean>;
    static start(locale: string): Promise<void>;
    static stop(): Promise<void>;
    static cancel(): Promise<void>;
    static destroy(): Promise<void>;
    static removeAllListeners(): void;
    static isRecognizing(): Promise<boolean>;
  }

  export default Voice;
}