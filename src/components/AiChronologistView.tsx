import React, { useState } from 'react';
import { ComicIssue, StoryArc, SuitTheme, UserProgressItem, UserProgressMap } from '../types';
import { SpiderManLogo } from './SpiderManLogo';
import {
  Send,
  Compass,
  Loader2,
  Zap,
  Terminal,
  User,
} from 'lucide-react';

interface AiChronologistViewProps {
  issues: ComicIssue[];
  arcs: StoryArc[];
  userProgress: UserProgressMap;
  suitTheme: SuitTheme;
  onSelectIssue: (issue: ComicIssue) => void;
}

export const AiChronologistView: React.FC<AiChronologistViewProps> = ({
  issues,
  arcs,
  userProgress,
  suitTheme,
  onSelectIssue,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content:
        "Greetings, Web-Head! I am your AI Comic Chronologist. Ask me anything about Spider-Man reading order continuity, tie-in priorities, Brand New Day lore, or character debut timelines.",
    },
  ]);

  const presetQuestions = [
    'Where should I begin reading right after One More Day?',
    'What is the exact chronological reading order for Anti-Venom and New Ways to Die?',
    'How does The Gauntlet build up into the climax of Grim Hunt?',
    'Which Brand New Day issues are crucial setup for Big Time & Superior Spider-Man?',
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || query;
    if (!textToSend.trim() || loading) return;

    const userMsg = textToSend.trim();
    setConversation((prev) => [...prev, { role: 'user', content: userMsg }]);
    if (!questionText) setQuery('');
    setLoading(true);

    try {
      const progressList = Object.values(userProgress) as (UserProgressItem | undefined)[];
      const readCount = progressList.filter((p) => p && p.isRead).length;

      const res = await fetch('/api/ai/chronologist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMsg,
          currentProgress: {
            totalRead: readCount,
            totalIssues: issues.length,
            suitTheme: suitTheme.name,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setConversation((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || 'Spider-Sense tingling, but received an empty response.' },
      ]);
    } catch (err: any) {
      setConversation((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Spider-Sense disruption: Couldn't reach the continuity mainframe. You can continue tracking your issues through the Reading Flow and Story Arcs tabs!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Comic Header */}
      <div className="bg-[#1e3a8a] border-4 border-black p-5 shadow-comic relative overflow-hidden text-white">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#facc15_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-yellow-400 uppercase font-black mb-1 flex items-center gap-1.5">
              [ GEMINI 2.5 AI CHRONOLOGIST LINKED ]
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide flex items-center gap-2">
              Spider-Sense AI Continuity Chronologist
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 font-mono mt-1 max-w-2xl">
              Get lore-accurate reading order recommendations, character tie-in explanations, and continuity context for any Spider-Man era.
            </p>
          </div>
          <div className="px-4 py-2 bg-black border-2 border-yellow-400 text-right shadow-[2px_2px_0px_0px_#facc15] shrink-0">
            <div className="text-[9px] font-mono text-yellow-400 uppercase">AI SYSTEM</div>
            <div className="text-base font-black font-mono text-white flex items-center gap-1 justify-end">
              ONLINE
            </div>
          </div>
        </div>
      </div>

      {/* Preset Suggestions Row */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-yellow-400 font-black tracking-wider flex items-center gap-1">
            Quick Continuity Queries:
          </span>
          <span className="text-[10px] font-mono text-gray-400">Click any prompt to instantly query</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="text-left p-3.5 rounded-sm bg-black border-2 border-blue-900 hover:border-yellow-400 text-xs text-gray-200 hover:text-white transition shadow-comic flex items-center justify-between group disabled:opacity-50 cursor-pointer"
            >
              <span className="line-clamp-1 font-mono">{q}</span>
              <Compass className="w-4 h-4 text-yellow-400 opacity-60 group-hover:opacity-100 group-hover:rotate-45 transition shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Log & Message Thread Terminal Frame */}
      <div className="bg-black border-4 border-[#1e3a8a] p-4 sm:p-6 shadow-comic space-y-4 relative">
        <div className="border-b-2 border-blue-900 pb-2 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-yellow-400 font-black">SECURE COMM CHANNEL</span>
            <h3 className="text-base font-black text-white uppercase">MAINFRAME CONVERSATION LOG</h3>
          </div>
        </div>

        <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-black">
          {conversation.map((msg, index) => {
            const isAI = msg.role === 'assistant';
            return (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  isAI ? 'justify-start' : 'justify-end flex-row-reverse'
                }`}
              >
                {/* Custom Spider-Man Logo Avatar for AI, Lucide User Icon for User */}
                <div
                  className={`w-9 h-9 rounded-sm flex items-center justify-center shrink-0 border-2 shadow-comic p-1 ${
                    isAI
                      ? 'bg-red-950 border-red-600'
                      : 'bg-blue-950 border-blue-600'
                  }`}
                >
                  {isAI ? (
                    <SpiderManLogo size={24} className="w-full h-full object-contain" />
                  ) : (
                    <User className="w-4 h-4 text-blue-300" />
                  )}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-sm p-4 text-xs sm:text-sm leading-relaxed border-2 shadow-comic ${
                    isAI
                      ? 'bg-[#070b14] text-gray-200 border-blue-900 font-mono'
                      : 'bg-blue-950/80 text-white border-blue-700 font-sans'
                  }`}
                >
                  <div className="text-[9px] font-mono text-yellow-400 uppercase font-black mb-1">
                    {isAI ? 'AI Chronologist' : 'Web-Slinger Reader'}
                  </div>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-red-950 flex items-center justify-center border-2 border-red-600 shadow-comic p-1">
                <SpiderManLogo size={24} className="w-full h-full object-contain animate-pulse" />
              </div>
              <div className="p-3.5 rounded-sm bg-[#070b14] border-2 border-blue-900 text-xs text-yellow-400 font-mono flex items-center gap-2 shadow-comic">
                <Zap className="w-3.5 h-3.5 animate-bounce" />
                <span>Analyzing Marvel Universe continuity timeline matrices...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-4 border-t-2 border-blue-900 flex items-center gap-2"
        >
          <input
            type="text"
            id="ai-chronologist-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about Brand New Day reading order, Mister Negative, Anti-Venom, Slott's run..."
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-sm bg-[#070b14] border-2 border-blue-900 text-xs sm:text-sm text-slate-100 placeholder:text-gray-500 font-mono focus:outline-none focus:border-yellow-400 transition shadow-comic"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 py-3 rounded-sm text-xs sm:text-sm font-black uppercase font-mono text-black bg-yellow-400 hover:bg-yellow-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] transition flex items-center gap-2 disabled:opacity-40 cursor-pointer"
          >
            <span>Transmit</span>
            <Send className="w-4 h-4 fill-black" />
          </button>
        </form>
      </div>
    </div>
  );
};