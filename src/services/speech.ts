// Web Speech API service for Voice Assistant

// Type definitions for SpeechRecognition
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

const customWindow = typeof window !== 'undefined' ? (window as unknown as IWindow) : null;
const SpeechRecognitionClass = customWindow?.SpeechRecognition || customWindow?.webkitSpeechRecognition;

export const speechService = {
  isRecognitionSupported(): boolean {
    return Boolean(SpeechRecognitionClass);
  },

  isSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  },

  createRecognizer(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (errorMessage: string) => void,
    onEnd: () => void
  ) {
    if (!SpeechRecognitionClass) {
      onError('Speech Recognition is not supported in this browser. Please try Google Chrome or MS Edge.');
      return null;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        onResult(text, Boolean(finalTranscript));
      };

      recognition.onerror = (event: any) => {
        let msg = 'Voice recognition error.';
        if (event.error === 'not-allowed') {
          msg = 'Microphone permission was denied. Please allow microphone access in your browser.';
        } else if (event.error === 'no-speech') {
          msg = 'No speech was detected. Please try speaking again.';
        } else if (event.error === 'network') {
          msg = 'Network error occurred during speech recognition.';
        }
        onError(msg);
      };

      recognition.onend = () => {
        onEnd();
      };

      return recognition;
    } catch (err: any) {
      onError(err.message || 'Failed to initialize speech recognition.');
      return null;
    }
  },

  speak(text: string, onEnd?: () => void) {
    if (!this.isSynthesisSupported()) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    // Clean markdown before speaking
    const cleanText = text
      .replace(/#{1,6}\s?/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/>\s?/g, '')
      .replace(/`{1,3}[^`]*`{1,3}/g, 'code snippet')
      .slice(0, 400); // Speak first 400 chars for concise voice response

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  },

  stopSpeaking() {
    if (this.isSynthesisSupported()) {
      window.speechSynthesis.cancel();
    }
  }
};
