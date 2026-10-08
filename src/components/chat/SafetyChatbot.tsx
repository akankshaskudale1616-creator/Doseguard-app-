import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  HelpCircle,
  RefreshCw,
  Copy,
  Check,
  Stethoscope,
  Heart,
  Volume2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const SafetyChatbot: React.FC = () => {
  const [role, setRole] = useState<'pharmacist' | 'patient'>('pharmacist');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      role: 'model',
      text: role === 'pharmacist'
        ? 'Hello. I am DoseGuard’s Clinical Pharmacovigilance Assistant. Ask me about adverse event causality, drug interactions in polypharmacy patients aged 60+, MedDRA coding, or PvPI ADRMS criteria.'
        : 'Namaste. I am your medicine safety helper. Are you experiencing any uncomfortable side effects, or do you have questions about your daily medicines? (For severe breathing trouble or swollen lips, please call 108 immediately).',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, text: m.text })),
          role,
        }),
      });

      const data = await response.json();
      const modelMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        text: data.reply || 'Analysis completed according to clinical pharmacovigilance guidelines.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'model',
        text: 'Temporary network connection error. For urgent allergic symptoms, contact emergency casualty at 108/112 immediately.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const PRESETS = role === 'pharmacist'
    ? [
        'How does Amoxicillin-Clavulanate cause delayed maculopapular rash?',
        'Can Amlodipine 10mg edema be distinguished from heart failure in a 68yo?',
        'What are the mandatory fields for official PvPI ADRMS submission?',
        'Explain formula C_ADR weights for host factors (polypharmacy >= 5).',
      ]
    : [
        'I have red rash and itching after my new antibiotic, what should I do?',
        'Why are my ankles swollen after taking Amlodipine blood pressure tablet?',
        'What are the signs of a dangerous allergic emergency?',
        'Can I stop my cholesterol tablet if my legs are sore?',
      ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header Bar - Light Orange Theme */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/80 border border-orange-200 rounded-3xl p-5 text-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20 text-white shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-slate-900">DoseGuard Pharmacovigilance Assistant</h2>
              <span className="text-[10px] bg-orange-100 text-orange-900 border border-orange-300 px-2 py-0.5 rounded-full font-bold">
                DoseGuard Engine
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Powered by DoseGuard Pharmacovigilance Safety Engine with WHO-UMC &amp; PvPI clinical guidelines.
            </p>
          </div>
        </div>

        {/* Persona Switcher */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-orange-200 shadow-xs text-xs">
          <button
            onClick={() => {
              setRole('pharmacist');
              setMessages([
                {
                  id: 'msg-01',
                  role: 'model',
                  text: 'Clinical Pharmacovigilance Specialist mode active. Ready to evaluate drug interactions, causality, and CDSCO/PvPI reporting requirements.',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ]);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              role === 'pharmacist'
                ? 'bg-orange-500 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Pharmacist Mode</span>
          </button>
          <button
            onClick={() => {
              setRole('patient');
              setMessages([
                {
                  id: 'msg-01',
                  role: 'model',
                  text: 'Hello! I am your DoseGuard medication safety companion. I can help you understand medicine symptoms, record side effects, or check if you need to talk to your doctor or pharmacist.',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ]);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              role === 'patient'
                ? 'bg-orange-500 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Patient Mode</span>
          </button>
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-orange-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gradient-to-b from-orange-50/30 to-white">
          {messages.map((msg) => {
            const isModel = msg.role === 'model';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}
              >
                {isModel && (
                  <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`relative max-w-xl p-4 rounded-2xl text-xs leading-relaxed space-y-1.5 ${
                    isModel
                      ? 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                      : 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-line font-medium">{msg.text}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                    <span className={isModel ? 'text-slate-400' : 'text-indigo-200'}>
                      {msg.timestamp}
                    </span>
                    {isModel && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-blue-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {!isModel && (
                  <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <User className="w-4 h-4 text-orange-100" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4 text-orange-100 animate-spin" />
              </div>
              <div className="p-3.5 bg-white border border-orange-200 rounded-2xl text-xs text-slate-600 shadow-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span>Formulating pharmacovigilance clinical evaluation...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">
            Suggested:
          </span>
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(preset)}
              className="text-[11px] px-2.5 py-1 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-800 text-slate-700 rounded-lg whitespace-nowrap transition-colors shadow-2xs shrink-0"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                role === 'pharmacist'
                  ? 'Ask about drug-drug interactions, causality formulas, or MedDRA codes...'
                  : 'Ask about side effects, symptoms, or medication safety...'
              }
              className="flex-1 p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-indigo-600 shadow-inner"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
