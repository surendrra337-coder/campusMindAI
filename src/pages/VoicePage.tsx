import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { speechService } from '../services/speech';
import { api } from '../services/api';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Bot,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export const VoicePage: React.FC = () => {
  const { setCurrentPage } = useApp();

  const [isSupported, setIsSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const recognizerRef = useRef<any>(null);

  useEffect(() => {
    const supported = speechService.isRecognitionSupported();
    setIsSupported(supported);
    if (!supported) {
      setErrorMessage(
        'Web Speech Recognition API is not supported in this browser. For voice input, please use Google Chrome or Microsoft Edge.'
      );
    }

    return () => {
      speechService.stopSpeaking();
      if (recognizerRef.current) {
        try {
          recognizerRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const startListening = () => {
    setErrorMessage(null);
    setTranscript('');
    setAiAnswer(null);
    speechService.stopSpeaking();
    setIsSpeaking(false);

    const recognizer = speechService.createRecognizer(
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal && text.trim().length > 2) {
          handleProcessVoiceQuery(text.trim());
        }
      },
      err => {
        setErrorMessage(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (recognizer) {
      recognizerRef.current = recognizer;
      try {
        recognizer.start();
        setIsListening(true);
      } catch (err: any) {
        setErrorMessage(err.message || 'Could not start microphone.');
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch {}
    }
    setIsListening(false);
    if (transcript.trim().length > 2 && !aiAnswer) {
      handleProcessVoiceQuery(transcript.trim());
    }
  };

  const handleProcessVoiceQuery = async (query: string) => {
    setIsProcessing(true);
    try {
      const response = await api.sendMessage(query);
      setAiAnswer(response.text);
      // Read answer aloud automatically
      setIsSpeaking(true);
      speechService.speak(response.text, () => {
        setIsSpeaking(false);
      });
    } catch {
      setErrorMessage('Failed to fetch AI response.');
    } finally {
      setIsProcessing(false);
    }
  };

  const stopSpeaking = () => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
  };

  const handlePresetQuestion = (q: string) => {
    setTranscript(q);
    handleProcessVoiceQuery(q);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 px-3.5 py-1 text-xs font-semibold text-violet-400">
          <Sparkles className="h-3.5 w-3.5" />
          Web Speech API Powered
        </div>
        <h1 className="text-3xl font-extrabold text-white">Voice Campus Assistant</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Ask questions naturally with your microphone. The assistant will transcribe your speech and read verified answers aloud.
        </p>
      </div>

      {/* Browser Support Warning Banner */}
      {!isSupported && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 flex items-start gap-3.5 text-rose-200 text-xs">
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-white">Browser Speech Recognition Unavailable</h3>
            <p className="text-slate-300 leading-relaxed">
              {errorMessage || 'Your current browser does not expose the Web Speech API.'} You can still test spoken answers by clicking preset sample queries below, or switch to Chrome/Edge for live microphone input.
            </p>
          </div>
        </div>
      )}

      {/* Central Interactive Voice Console */}
      <div className="relative overflow-hidden rounded-3xl border border-campus-border bg-gradient-to-b from-campus-card via-campus-surface to-campus-dark p-8 md:p-12 text-center shadow-glass space-y-8">
        {/* Animated Microphone Orb */}
        <div className="relative flex items-center justify-center py-6">
          {/* Pulsing rings when listening */}
          {isListening && (
            <>
              <div className="absolute h-44 w-44 rounded-full bg-blue-500/20 animate-ping" />
              <div className="absolute h-36 w-36 rounded-full bg-violet-500/30 animate-pulse" />
            </>
          )}

          {/* Sound waves when speaking */}
          {isSpeaking && (
            <div className="absolute h-40 w-40 rounded-full border-2 border-dashed border-emerald-400/50 animate-spin [animation-duration:8s]" />
          )}

          <button
            onClick={isListening ? stopListening : startListening}
            disabled={!isSupported && !isListening}
            className={`relative z-10 flex h-28 w-28 items-center justify-center rounded-full shadow-glow transition-all duration-300 ${
              isListening
                ? 'bg-rose-600 text-white shadow-rose-500/50 scale-110 animate-bounce'
                : isSpeaking
                ? 'bg-emerald-600 text-white shadow-emerald-500/50'
                : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white hover:scale-105 active:scale-95'
            } disabled:opacity-50 disabled:pointer-events-none`}
            title={isListening ? 'Click to stop listening' : 'Click to start voice query'}
          >
            {isListening ? (
              <MicOff className="h-10 w-10 animate-pulse" />
            ) : isSpeaking ? (
              <Volume2 className="h-10 w-10 animate-pulse" />
            ) : (
              <Mic className="h-10 w-10" />
            )}
          </button>
        </div>

        {/* Live Status Description */}
        <div className="space-y-1">
          <div className="text-sm font-bold text-white">
            {isListening
              ? 'Listening to your microphone... Speak clearly.'
              : isProcessing
              ? 'Searching verified college records...'
              : isSpeaking
              ? 'Reading answer aloud...'
              : 'Tap microphone to speak your question'}
          </div>
          <p className="text-xs text-slate-400">
            {isListening ? 'Click again or pause to send question' : 'e.g. "What are the attendance requirements?"'}
          </p>
        </div>

        {/* Speech Transcript Display */}
        {transcript && (
          <div className="rounded-2xl border border-campus-border bg-campus-dark/80 p-5 max-w-xl mx-auto text-left space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
              Recognized Speech Transcript:
            </span>
            <p className="text-sm font-medium text-slate-100 italic">
              "{transcript}"
            </p>
          </div>
        )}

        {/* AI Answer Display */}
        {aiAnswer && (
          <div className="rounded-2xl border border-blue-500/30 bg-campus-surface/90 p-6 max-w-2xl mx-auto text-left space-y-4 shadow-sm animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-campus-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-bold text-white">Assistant Response</span>
              </div>
              <div className="flex items-center gap-2">
                {isSpeaking ? (
                  <button
                    onClick={stopSpeaking}
                    className="flex items-center gap-1 rounded bg-rose-500/10 text-rose-300 px-2 py-1 text-xs hover:bg-rose-500/20"
                  >
                    <VolumeX className="h-3 w-3" />
                    <span>Mute Audio</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsSpeaking(true);
                      speechService.speak(aiAnswer, () => setIsSpeaking(false));
                    }}
                    className="flex items-center gap-1 rounded bg-blue-500/10 text-blue-300 px-2 py-1 text-xs hover:bg-blue-500/20"
                  >
                    <Volume2 className="h-3 w-3" />
                    <span>Replay Audio</span>
                  </button>
                )}
              </div>
            </div>

            <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
              {aiAnswer}
            </div>

            <div className="pt-2 border-t border-campus-border/50 flex justify-end">
              <button
                onClick={() => setCurrentPage('chat')}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
              >
                <span>Continue this conversation in Chat Assistant</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Voice Test Queries */}
      <div className="rounded-2xl border border-campus-border bg-campus-card p-6 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Or Click Any Sample Query to Test Voice Synthesis:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            'What is the mandatory attendance requirement?',
            'What are the annual tuition fees for B.Tech AI & Data Science?',
            'What scholarships are awarded for top 12th scores?',
            'What are the hostel room options and curfew timings?'
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetQuestion(q)}
              className="flex items-center justify-between rounded-xl border border-campus-border/70 bg-campus-surface/70 p-3 text-xs text-slate-300 hover:border-violet-500/50 hover:bg-campus-hover hover:text-white transition-all text-left"
            >
              <span>{q}</span>
              <Volume2 className="h-3.5 w-3.5 text-violet-400 shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
