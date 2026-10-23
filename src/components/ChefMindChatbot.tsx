import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  ChefHat,
  Leaf,
  UtensilsCrossed,
} from 'lucide-react';
import type { ChatMessage } from '../server/geminiService';

interface MealMindChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  canteenName: string;
  activeShift: string;
  totalSurplus: number;
  portionsRescued: number;
}

export const ChefMindChatbot: React.FC<MealMindChatbotProps> = ({
  isOpen,
  onClose,
  canteenName,
  activeShift,
  totalSurplus,
  portionsRescued,
}) => {
  const [messages, setMessages] = useState<Array<ChatMessage & { time: string }>>([
    {
      role: 'model',
      text: `Hello! I am **MealMind AI Assistant**, your intelligent culinary operations and zero-waste co-pilot for **${canteenName}** (${activeShift} Shift).\n\nHow can I help you today? I can suggest creative repurposing recipes, calculate dynamic student flash discounts, review HACCP holding safety thresholds, or coordinate with local shelter logistics.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'How do I repurpose 30kg of surplus rice?',
    'What is the HACCP hot holding rule?',
    'Strategy for 50% Last-Call student flash discount',
    'Safe 2-hour chilling steps for roasted chicken',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    const userMessage = {
      role: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, text: m.text })),
          context: {
            canteenName,
            currentShift: activeShift,
            totalSurplus,
            portionsRescued,
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            text: data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'Temporary network delay encountered. Please verify kitchen Wi-Fi connection and retry your query.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: 'model',
        text: `Chat session refreshed. Ready for your next food intelligence query!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[95vw] sm:w-[440px] max-w-[440px] h-[600px] max-h-[85vh] rounded-3xl bg-white/95 border border-slate-200 backdrop-blur-2xl shadow-2xl shadow-slate-900/15 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50/60 to-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/25">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-slate-900 text-sm">MealMind AI Assistant</h3>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                Live Gemini 3.8
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Kitchen Operations & Zero-Waste Copilot
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearHistory}
            title="Clear Chat History"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            title="Close Assistant"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-slate-50/50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/15'
                  : 'bg-white border border-slate-200/80 text-slate-700 shadow-xs'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans text-xs">
                {m.text}
              </div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
              {m.time}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 w-fit shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-500 animate-spin" />
            <span className="text-xs">MealMind AI is analyzing kitchen inventory...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 pt-2.5 pb-2 border-t border-slate-100 bg-white">
        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          <span>Quick Inquiries:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={isLoading}
              className="text-[11px] whitespace-nowrap bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/60 text-slate-700 hover:text-slate-900 px-3 py-1 rounded-full transition-colors cursor-pointer shrink-0 disabled:opacity-40"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about repurposing recipes, HACCP rules, or donations..."
          disabled={isLoading}
          className="flex-1 bg-slate-100/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all font-semibold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-emerald-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
