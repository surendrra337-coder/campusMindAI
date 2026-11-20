import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { speechService } from '../services/speech';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Trash2,
  Copy,
  Check,
  Volume2,
  VolumeX,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowRight
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'What courses are available?',
  'How can I apply for admission?',
  'What scholarships are available?',
  'What are the attendance rules?',
  'How can I contact student support?',
  'What facilities are available on campus?'
];

export const ChatPage: React.FC = () => {
  const {
    chatMessages,
    isChatLoading,
    sendChatMessage,
    clearChat,
    isDemoMode,
    geminiConfigured,
    showToast
  } = useApp();

  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isChatLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isChatLoading) return;
    const msg = input.trim();
    setInput('');
    sendChatMessage(msg);
  };

  const handleSuggestedClick = (question: string) => {
    if (isChatLoading) return;
    sendChatMessage(question);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSpeak = (id: string, text: string) => {
    if (speakingId === id) {
      speechService.stopSpeaking();
      setSpeakingId(null);
    } else {
      speechService.stopSpeaking();
      setSpeakingId(id);
      speechService.speak(text, () => {
        setSpeakingId(null);
      });
    }
  };

  const toggleSourceExpand = (id: string) => {
    setExpandedSources(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto rounded-2xl border border-campus-border bg-campus-card shadow-glass overflow-hidden">
      {/* Top Chat Header */}
      <div className="flex items-center justify-between border-b border-campus-border bg-campus-surface/80 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-glow-sm">
            <Bot className="h-5 w-5" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-campus-card" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">CampusMind Assistant</h2>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  geminiConfigured
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                {geminiConfigured ? 'Gemini 1.5 Live' : 'Demo RAG Mode'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Grounded in verified institutional knowledge & regulations
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 rounded-lg border border-campus-border/70 bg-campus-dark/50 px-3 py-1.5 text-xs text-slate-400 hover:bg-campus-hover hover:text-white transition-colors"
          title="Clear Conversation"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {chatMessages.map(msg => {
          const isUser = msg.sender === 'user';
          const isSpeaking = speakingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm mt-1">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`relative max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3.5 text-xs leading-relaxed shadow-sm transition-all ${
                  isUser
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                    : 'border border-campus-border bg-campus-surface text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Mode Flag for AI Responses */}
                {!isUser && msg.isDemoResponse && (
                  <div className="mb-2 inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                    <Sparkles className="h-3 w-3" />
                    DEMO RESPONSE • Offline RAG Mode
                  </div>
                )}

                {/* Message Body (Markdown rendered) */}
                <div className="prose prose-invert prose-xs max-w-none space-y-2 whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* RAG Sources Citations (if present) */}
                {!isUser && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-campus-border/60">
                    <button
                      onClick={() => toggleSourceExpand(msg.id)}
                      className="flex items-center justify-between w-full text-[11px] font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <FileText className="h-3 w-3" />
                        <span>Referenced Knowledge Documents ({msg.sources.length})</span>
                      </span>
                      {expandedSources[msg.id] ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </button>

                    {expandedSources[msg.id] && (
                      <div className="mt-2 space-y-1.5">
                        {msg.sources.map(src => (
                          <div
                            key={src.id}
                            className="rounded-lg border border-campus-border/70 bg-campus-dark/40 p-2.5 text-[11px] space-y-1"
                          >
                            <div className="flex items-center justify-between font-semibold text-slate-200">
                              <span>{src.title}</span>
                              <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                                Score: {(src.score * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="text-slate-400 text-[10px]">
                              Doc: {src.sourceDocument}
                            </div>
                            <p className="text-slate-300 text-[10px] line-clamp-2">
                              {src.snippet}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Suggested follow-up questions from AI */}
                {!isUser && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-campus-border/60 space-y-1.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Suggested Next Questions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestedClick(q)}
                          className="rounded-lg border border-campus-border bg-campus-dark/60 px-2.5 py-1 text-[11px] text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10 transition-colors text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Bar: Timestamp, Latency & Action Buttons */}
                <div
                  className={`mt-2 flex items-center justify-between text-[10px] pt-1.5 ${
                    isUser ? 'text-blue-200 border-t border-blue-400/30' : 'text-slate-400 border-t border-campus-border/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.latencyMs && (
                      <span className="text-[9px] text-slate-400">({msg.latencyMs}ms)</span>
                    )}
                  </div>

                  {!isUser && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleSpeak(msg.id, msg.text)}
                        className="rounded p-1 hover:text-white hover:bg-campus-hover transition-colors"
                        title={isSpeaking ? 'Stop speaking' : 'Read answer aloud'}
                      >
                        {isSpeaking ? (
                          <VolumeX className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                        ) : (
                          <Volume2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="rounded p-1 hover:text-white hover:bg-campus-hover transition-colors"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-700 text-slate-200 mt-1 shadow-sm">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isChatLoading && (
          <div className="flex gap-3 items-center text-xs text-slate-400 animate-pulse">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-campus-border bg-campus-surface px-4 py-3">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-bounce" />
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <span className="flex h-2 w-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-slate-300 ml-1">Searching college regulations...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Questions Bar */}
      <div className="border-t border-campus-border bg-campus-surface/50 px-4 py-2.5 overflow-x-auto">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-blue-400" />
            Suggested:
          </span>
          <div className="flex items-center gap-2 whitespace-nowrap">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestedClick(q)}
                disabled={isChatLoading}
                className="rounded-full border border-campus-border bg-campus-card px-3 py-1 text-[11px] text-slate-300 hover:border-blue-500/50 hover:bg-campus-hover hover:text-white transition-all disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-campus-border bg-campus-surface p-3 sm:p-4"
      >
        <div className="flex items-center gap-2 rounded-xl border border-campus-border bg-campus-dark px-3 py-2 focus-within:border-blue-500/80 transition-colors shadow-inner">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything about admissions, scholarships, fees, rules, or hostel facilities..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            disabled={isChatLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isChatLoading}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-40 disabled:hover:bg-blue-600 shadow-sm"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
