import React from 'react';
import { FilterState, StoryArc } from '../types';
import { Search, LayoutGrid, List } from 'lucide-react';

interface ReadingTimelineControlsProps {
  arcs: StoryArc[];
  filterState: FilterState;
  onFilterChange: (newFilter: Partial<FilterState>) => void;
  viewMode: 'flow' | 'grid';
  onViewModeChange: (mode: 'flow' | 'grid') => void;
}

export const ReadingTimelineControls: React.FC<ReadingTimelineControlsProps> = ({
  arcs,
  filterState,
  onFilterChange,
  viewMode,
  onViewModeChange,
}) => {
  const hasActiveFilters =
    filterState.searchQuery ||
    filterState.selectedArcId !== 'all' ||
    filterState.selectedVillain !== 'all' ||
    filterState.readFilter !== 'all' ||
    filterState.ownedFilter !== 'all';

  return (
    <div className="p-4 rounded-sm bg-[#111827] border-2 border-black shadow-comic-blue space-y-3.5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-yellow-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="comic-search-input"
            value={filterState.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Search by issue title, number (#546), creator (Slott), villain (Negative)..."
            className="w-full pl-10 pr-16 py-2 text-xs sm:text-sm rounded-sm bg-black border-2 border-black text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-400 transition font-mono shadow-comic"
          />
          {filterState.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="text-xs text-yellow-300 font-bold hover:text-white absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-sm bg-red-800 border border-black"
            >
              Clear
            </button>
          )}
        </div>

        {/* View Toggles */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-0.5 rounded-sm bg-black border-2 border-black shadow-comic">
            <button
              onClick={() => onViewModeChange('flow')}
              className={`px-2.5 py-1 rounded-sm text-xs font-black uppercase italic tracking-wider flex items-center gap-1.5 transition ${
                viewMode === 'flow' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'
              }`}
              title="Timeline Flow View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Flow</span>
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`px-2.5 py-1 rounded-sm text-xs font-black uppercase italic tracking-wider flex items-center gap-1.5 transition ${
                viewMode === 'grid' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'
              }`}
              title="Compact Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Chips & Quick Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t-2 border-black text-xs">
        {/* Story Arc Selector */}
        <select
          id="filter-arc-select"
          value={filterState.selectedArcId}
          onChange={(e) => onFilterChange({ selectedArcId: e.target.value })}
          className="px-3 py-1.5 rounded-sm bg-black border-2 border-black text-yellow-300 focus:outline-none focus:border-yellow-400 font-mono text-xs shadow-comic font-bold"
        >
          <option value="all">ALL ARCS ({arcs.length})</option>
          {arcs.map((arc) => (
            <option key={arc.id} value={arc.id}>
              {arc.title}
            </option>
          ))}
        </select>

        {/* Villain Tag Filter */}
        <select
          id="filter-villain-select"
          value={filterState.selectedVillain}
          onChange={(e) => onFilterChange({ selectedVillain: e.target.value })}
          className="px-3 py-1.5 rounded-sm bg-black border-2 border-black text-yellow-300 focus:outline-none focus:border-yellow-400 font-mono text-xs shadow-comic font-bold"
        >
          <option value="all">ALL ROGUES / VILLAINS</option>
          <option value="Mister Negative">Mister Negative</option>
          <option value="Anti-Venom">Anti-Venom</option>
          <option value="Menace">Menace (Lily Hollister)</option>
          <option value="Norman Osborn">Norman Osborn (Iron Patriot)</option>
          <option value="Ana Kravinoff">Ana Kravinoff</option>
          <option value="Kraven">Kraven the Hunter</option>
          <option value="The Lizard">The Lizard (Shed)</option>
          <option value="Rhino">Rhino (Alexei Sytsevich)</option>
          <option value="Electro">Electro</option>
          <option value="Doctor Octopus">Doctor Octopus</option>
          <option value="Freak">The Freak</option>
          <option value="Screwball">Screwball</option>
        </select>

        {/* Quick Villain Filter Pills */}
        <div className="hidden xl:flex items-center gap-1.5 ml-1">
          <span className="text-[10px] uppercase font-black tracking-wider text-blue-200">Quick Filter:</span>
          {['Mister Negative', 'Anti-Venom', 'Menace', 'Freak', 'Screwball'].map((v) => (
            <button
              key={v}
              onClick={() =>
                onFilterChange({
                  selectedVillain: filterState.selectedVillain === v ? 'all' : v,
                })
              }
              className={`px-2 py-1 text-[10px] font-black uppercase border transition shadow-comic ${
                filterState.selectedVillain === v
                  ? 'bg-yellow-400 text-black border-black shadow-comic-yellow'
                  : 'bg-black text-white border-white/60 hover:bg-yellow-400 hover:text-black'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Reading Status Filter */}
        <div className="flex items-center p-0.5 rounded-sm bg-black border-2 border-black shadow-comic ml-auto">
          {(['all', 'unread', 'read'] as const).map((status) => (
            <button
              key={status}
              onClick={() => onFilterChange({ readFilter: status })}
              className={`px-2.5 py-1 rounded-sm text-xs font-black uppercase tracking-wider transition ${
                filterState.readFilter === status ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Owned Status Filter */}
        <div className="flex items-center p-0.5 rounded-sm bg-black border-2 border-black shadow-comic">
          {(['all', 'owned', 'unowned'] as const).map((status) => (
            <button
              key={status}
              onClick={() => onFilterChange({ ownedFilter: status })}
              className={`px-2.5 py-1 rounded-sm text-xs font-black uppercase tracking-wider transition ${
                filterState.ownedFilter === status ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={() =>
              onFilterChange({
                searchQuery: '',
                selectedArcId: 'all',
                selectedVillain: 'all',
                selectedCharacter: 'all',
                readFilter: 'all',
                ownedFilter: 'all',
                selectedImportance: 'all',
              })
            }
            className="px-3 py-1 text-xs rounded-sm text-white bg-red-700 hover:bg-red-600 border-2 border-black shadow-comic transition font-black uppercase"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};