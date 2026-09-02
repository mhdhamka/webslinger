import React, { useState } from 'react';

import { ActiveTab, SuitTheme, UserProgressItem, UserProgressMap } from '../types';

import { SpiderManLogo } from './SpiderManLogo';

import { COMIC_ISSUES } from '../data/spiderManData';

import {

  Download,

  Upload,

  RotateCcw,

  Zap,

  Settings2,

  X,

  Palette,

  ChevronDown,

} from 'lucide-react';



interface HeaderProps {

  activeTab: ActiveTab;

  onTabChange: (tab: ActiveTab) => void;

  userProgress: UserProgressMap;

  suitTheme: SuitTheme;

  onSelectSuitTheme: (theme: SuitTheme) => void;

  onResetProgress: () => void;

  onExportData: () => void;

  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;

  onSelectRandomNextUnread: () => void;

}



// Available suit theme presets matching your application standard

const AVAILABLE_SUITS: SuitTheme[] = [

  { name: 'Classic', primaryAccent: '#b91c1c', secondaryAccent: '#1d4ed8', label: 'Classic Suit (Red & Blue)' },

  { name: 'Alien', primaryAccent: '#111827', secondaryAccent: '#374151', label: 'Alien Symbiote Suit (Black)' },

  { name: 'Iron', primaryAccent: '#b45309', secondaryAccent: '#dc2626', label: 'Iron Spider Suit (Gold & Red)' },

  { name: 'Big', primaryAccent: '#15803d', secondaryAccent: '#22c55e', label: 'Big Time Suit (Green Glowing)' },

  { name: 'Brooklyn', primaryAccent: '#7e22ce', secondaryAccent: '#dc2626', label: 'Brooklyn Vision Suit' },

  { name: 'Spider-Armor', primaryAccent: '#374151', secondaryAccent: '#eab308', label: 'Spider-Armor MK IV' },

];



export const Header: React.FC<HeaderProps> = ({

  activeTab,

  onTabChange,

  userProgress,

  suitTheme,

  onSelectSuitTheme,

  onResetProgress,

  onExportData,

  onImportData,

  onSelectRandomNextUnread,

}) => {

  const [showDataModal, setShowDataModal] = useState(false);



  // Compute stats

  const totalIssues = COMIC_ISSUES.length;

  const progressList = Object.values(userProgress) as (UserProgressItem | undefined)[];

  const readIssuesCount = progressList.filter((p): p is UserProgressItem => !!p && p.isRead).length;

  const percentRead = totalIssues > 0 ? Math.round((readIssuesCount / totalIssues) * 100) : 0;



  const navTabs: { id: ActiveTab; label: string; badge?: string }[] = [

    { id: 'timeline', label: 'Reading Flow' },

    { id: 'arcs', label: 'Story Arcs' },

    { id: 'rogues', label: 'Rogues Gallery' },

    { id: 'stats', label: 'Spider-Telemetry' },

    { id: 'ai-chronologist', label: 'AI Chronologist', badge: 'Gemini' },

  ];



  return (

    <header className="sticky top-0 z-40 bg-[#b91c1c] border-b-4 border-black relative shadow-comic-lg">

      {/* Comic Diagonal Striping Texture Overlay */}

      <div

        className="absolute inset-0 pointer-events-none opacity-20"

        style={{

          background: 'repeating-linear-gradient(45deg, #000, #000 10px, transparent 10px, transparent 20px)',

        }}

      />



      {/* Main Header Content */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2.5 relative z-10">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          {/* Spider-Man Logo & Identity */}

          <div className="flex items-center gap-3">

            <SpiderManLogo size={46} className="cursor-pointer hover:scale-105 transition-transform" />



            <div>

              <div className="flex items-center gap-2">

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter uppercase italic drop-shadow-[2px_2px_0px_#000] text-white leading-none">

                  Web-Slinger Archives

                </h1>

                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-black tracking-wider bg-yellow-400 text-black border border-black shadow-[2px_2px_0px_0px_#000]">

                  Marvel Comics

                </span>

              </div>

              <p className="text-[11px] text-red-100 flex items-center gap-2 font-mono mt-0.5">

                <span className="font-bold tracking-wider">CHRONOLOGICAL BRAND NEW DAY READING ORDER</span>

              </p>

            </div>

          </div>



          {/* Right Section: Streamlined Progress HUD & Controls */}

          <div className="flex items-center gap-3 ml-auto md:ml-0">

            {/* Progress Meter */}

            <div className="bg-black/50 px-3 py-1.5 rounded-sm border-2 border-black shadow-comic flex flex-col justify-center">

              <div className="flex items-center justify-between gap-4 text-[10px] font-mono font-black">

                <span className="uppercase text-yellow-300">PROGRESS</span>

                <span className="text-yellow-400">

                  {readIssuesCount}/{totalIssues} ({percentRead}%)

                </span>

              </div>

              <div className="w-36 sm:w-48 h-2.5 bg-blue-950 border border-black rounded-none mt-1 overflow-hidden">

                <div

                  className="h-full bg-yellow-400 transition-all duration-500"

                  style={{ width: `${percentRead}%` }}

                />

              </div>

            </div>



            {/* Next Unread Jump Action */}

            <button

              id="random-next-issue-btn"

              onClick={onSelectRandomNextUnread}

              title="Jump to Next Unread Comic Issue"

              className="px-3 py-1.5 text-xs font-black uppercase rounded-sm border-2 border-black bg-yellow-400 text-black hover:bg-yellow-300 shadow-comic transition flex items-center gap-1.5"

            >

              <Zap className="w-3.5 h-3.5 fill-black" />

              <span>Next Unread</span>

            </button>



            {/* Data, Suit Matrix & Settings Toggle */}

            <button

              onClick={() => setShowDataModal(true)}

              title="Backup, Suit Matrix & Settings"

              className="p-1.5 text-xs rounded-sm border-2 border-black bg-black text-white hover:bg-gray-800 shadow-comic transition flex items-center gap-1"

            >

              <Settings2 className="w-4 h-4 text-yellow-400" />

            </button>

          </div>

        </div>



        {/* Navigation Tabs - Modern Marvel Strip */}

        <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">

          {navTabs.map((tab) => {

            const isActive = activeTab === tab.id;

            return (

              <button

                key={tab.id}

                id={`nav-tab-${tab.id}`}

                onClick={() => onTabChange(tab.id)}

                className={`px-3.5 py-1.5 rounded-sm text-xs font-black uppercase italic tracking-wider flex items-center gap-2 transition-all whitespace-nowrap border-2 border-black ${

                  isActive

                    ? 'bg-yellow-400 text-black shadow-comic-yellow scale-[1.02]'

                    : 'bg-[#1e3a8a] text-blue-100 hover:bg-blue-800 shadow-comic'

                }`}

              >

                <span>{tab.label}</span>

                {tab.badge && (

                  <span

                    className={`px-1.5 py-0.2 text-[9px] uppercase font-black tracking-wider border border-black ${

                      isActive ? 'bg-black text-yellow-400' : 'bg-red-600 text-white'

                    }`}

                  >

                    {tab.badge}

                  </span>

                )}

              </button>

            );

          })}

        </div>

      </div>



      {/* Settings, Interactive Dropdown Suit Matrix & Archive Storage Modal */}

      {showDataModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">

          <div className="w-full max-w-md bg-[#111827] border-4 border-black p-6 shadow-comic-blue rounded-sm text-white">

            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">

              <h3 className="text-lg font-black uppercase italic tracking-tight text-yellow-400 flex items-center gap-2">

                <Settings2 className="w-5 h-5 text-yellow-400" />

                Archive Control Center

              </h3>

              <button

                onClick={() => setShowDataModal(false)}

                className="p-1 bg-black text-white hover:bg-red-600 border border-black"

              >

                <X className="w-4 h-4" />

              </button>

            </div>



            {/* Suit Matrix Interactive Dropdown Section */}

            <div className="mb-5 bg-black/40 p-3.5 rounded border-2 border-black">

              <label className="text-xs font-black uppercase tracking-wider text-yellow-400 flex items-center gap-1.5 mb-2">

                <Palette className="w-3.5 h-3.5" />

                Suit Matrix Theme Selector

              </label>

             

              <div className="relative">

                <select

                  value={suitTheme.name}

                  onChange={(e) => {

                    const selected = AVAILABLE_SUITS.find((s) => s.name === e.target.value);

                    if (selected) {

                      onSelectSuitTheme(selected);

                    }

                  }}

                  className="w-full py-2 px-3 bg-[#1e293b] text-white text-xs font-mono font-bold uppercase rounded border-2 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none cursor-pointer pr-8 shadow-comic"

                >

                  {AVAILABLE_SUITS.map((suit) => (

                    <option key={suit.name} value={suit.name}>

                      {suit.label}

                    </option>

                  ))}

                </select>

                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400 pointer-events-none" />

              </div>

            </div>



            <p className="text-xs text-gray-300 mb-4 font-mono leading-relaxed">

              Manage your local reading logs, ratings, and issue backups or reset your tracking data.

            </p>



            <div className="space-y-3">

              <button

                onClick={() => {

                  onExportData();

                  setShowDataModal(false);

                }}

                className="w-full py-2.5 px-4 rounded-sm border-2 border-black bg-[#1e3a8a] hover:bg-blue-700 text-white font-black uppercase text-xs flex items-center justify-center gap-2 shadow-comic transition"

              >

                <Download className="w-4 h-4" />

                Export Progress JSON Backup

              </button>



              <label className="w-full py-2.5 px-4 rounded-sm border-2 border-black bg-black hover:bg-gray-800 text-yellow-300 font-black uppercase text-xs flex items-center justify-center gap-2 shadow-comic transition cursor-pointer">

                <Upload className="w-4 h-4" />

                Import Progress JSON Backup

                <input

                  type="file"

                  accept=".json"

                  onChange={(e) => {

                    onImportData(e);

                    setShowDataModal(false);

                  }}

                  className="hidden"

                />

              </label>



              <div className="pt-3 border-t-2 border-black">

                <button

                  onClick={() => {

                    onResetProgress();

                    setShowDataModal(false);

                  }}

                  className="w-full py-2.5 px-4 rounded-sm border-2 border-black bg-red-800 hover:bg-red-700 text-white font-black uppercase text-xs flex items-center justify-center gap-2 shadow-comic transition"

                >

                  <RotateCcw className="w-4 h-4" />

                  Reset Reading Checklist

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </header>

  );

};