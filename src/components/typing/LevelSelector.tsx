import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trophy,
  Sliders,
  CheckCircle2,
  Search,
  X,
  ArrowRight,
  List,
  LayoutGrid,
  Users,
  Target,
  Zap,
  ChevronDown,
  ChevronUp,
  Play
} from 'lucide-react';
import { TestMode } from '../../types';
import {
  LEVEL_TIERS,
  LevelTier,
  getTierForLevel,
  getBenchmarkWpm,
  getLevelSnippet,
  getCompletedLevels,
  getLevelCompletionStats
} from '../../services/levelEngine';

interface LevelSelectorProps {
  currentLevel: number;
  mode: TestMode;
  onSelectLevel: (level: number) => void;
  disabled?: boolean;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  currentLevel,
  mode,
  onSelectLevel,
  disabled = false
}) => {
  const [showCatalog, setShowCatalog] = useState(false);
  const [showInlineList, setShowInlineList] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedTierFilter, setSelectedTierFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'uncompleted'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const currentTier = getTierForLevel(currentLevel);
  const currentBenchmark = getBenchmarkWpm(currentLevel);
  const completedLevels = getCompletedLevels(mode);
  const currentSnippet = getLevelSnippet(mode, currentLevel);
  const currentStats = getLevelCompletionStats(mode, currentLevel);

  const handleStep = (delta: number) => {
    const next = Math.max(1, Math.min(100, currentLevel + delta));
    onSelectLevel(next);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectLevel(Number(e.target.value));
  };

  const handleChooseLevel = (targetLevel: number) => {
    onSelectLevel(targetLevel);
    setShowCatalog(false);
    setTimeout(() => {
      const arena = document.getElementById('typing-arena');
      if (arena) {
        arena.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      const hiddenInput = document.getElementById('typeflow-hidden-input') as HTMLInputElement | null;
      if (hiddenInput) {
        hiddenInput.focus();
      }
    }, 80);
  };

  // Generate all 100 level cards with stats for list form
  const allLevels = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => {
      const level = i + 1;
      const tier = getTierForLevel(level);
      const benchmark = getBenchmarkWpm(level);
      const snippet = getLevelSnippet(mode, level);
      const stats = getLevelCompletionStats(mode, level);

      return {
        level,
        tier,
        benchmark,
        targetAccuracy: snippet.targetAccuracy || 90,
        title: snippet.title,
        shortDescription: snippet.description,
        preview: snippet.content.slice(0, 90) + (snippet.content.length > 90 ? '...' : ''),
        stats
      };
    });
  }, [mode, completedLevels.length]);

  const filteredLevels = useMemo(() => {
    return allLevels.filter((lvl) => {
      const matchesTier = selectedTierFilter === 'all' || lvl.tier.id === selectedTierFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && lvl.stats.isCompleted) ||
        (statusFilter === 'uncompleted' && !lvl.stats.isCompleted);
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        `level ${lvl.level}`.includes(q) ||
        String(lvl.level) === q ||
        lvl.title.toLowerCase().includes(q) ||
        lvl.shortDescription.toLowerCase().includes(q) ||
        lvl.tier.name.toLowerCase().includes(q);

      return matchesTier && matchesStatus && matchesSearch;
    });
  }, [allLevels, selectedTierFilter, statusFilter, searchQuery]);

  // Render individual item in List Form
  const renderListItem = (lvl: typeof allLevels[0]) => {
    const isSelected = lvl.level === currentLevel;

    return (
      <div
        key={lvl.level}
        id={`level-list-item-${lvl.level}`}
        onClick={() => handleChooseLevel(lvl.level)}
        className={`w-full p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 group ${
          isSelected
            ? 'bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500/60 shadow-lg shadow-cyan-500/10'
            : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
        }`}
      >
        {/* Left: Level badge + Title & Short Description */}
        <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
          <div className="flex flex-col items-center justify-center shrink-0">
            <span
              className={`w-12 h-10 rounded-xl flex items-center justify-center text-xs font-mono font-bold border transition-transform group-hover:scale-105 ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold shadow-md shadow-cyan-500/30'
                  : `${lvl.tier.bg} ${lvl.tier.color} ${lvl.tier.border}`
              }`}
            >
              Lv {lvl.level}
            </span>
            <span className="text-[11px] mt-1 font-mono text-slate-500" title={lvl.tier.name}>
              {lvl.tier.icon}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                {lvl.title}
              </h4>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${lvl.tier.bg} ${lvl.tier.border} ${lvl.tier.color}`}
              >
                {lvl.tier.name}
              </span>
              {lvl.stats.isCompleted && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  Passed {lvl.stats.userCompletions > 1 ? `(${lvl.stats.userCompletions}x)` : ''}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs text-slate-300 font-sans line-clamp-1 mb-1.5">
              {lvl.shortDescription}
            </p>

            {/* Snippet Preview */}
            <p className="text-[11px] font-mono text-slate-500 truncate bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-900">
              {lvl.preview}
            </p>
          </div>
        </div>

        {/* Middle-Right: Stats (How many completed + Highest Accuracy + Target WPM) */}
        <div className="flex items-center flex-wrap sm:flex-nowrap gap-4 sm:gap-6 shrink-0 border-t md:border-t-0 pt-2.5 md:pt-0 border-slate-800/60 justify-between md:justify-end">
          {/* How many have completed */}
          <div className="text-left md:text-right min-w-[110px]">
            <div className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1 md:justify-end">
              <Users className="w-3 h-3 text-slate-400" />
              <span>Completed</span>
            </div>
            <div className="text-xs font-semibold text-slate-200 mt-0.5">
              <span className="text-cyan-400 font-bold">{lvl.stats.totalCompleted.toLocaleString()}</span>
              <span className="text-[11px] text-slate-500 ml-1">players</span>
            </div>
          </div>

          {/* Highest Accuracy */}
          <div className="text-left md:text-right min-w-[95px]">
            <div className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1 md:justify-end">
              <Target className="w-3 h-3 text-slate-400" />
              <span>Highest Acc</span>
            </div>
            <div className="text-xs font-bold mt-0.5">
              {lvl.stats.highestAccuracy !== null ? (
                <span
                  className={`${
                    lvl.stats.highestAccuracy >= 95
                      ? 'text-emerald-400'
                      : lvl.stats.highestAccuracy >= 88
                      ? 'text-cyan-400'
                      : 'text-amber-400'
                  }`}
                >
                  {lvl.stats.highestAccuracy.toFixed(1)}%
                </span>
              ) : (
                <span className="text-slate-500 font-normal">
                  Target ≥{lvl.targetAccuracy}%
                </span>
              )}
            </div>
          </div>

          {/* Speed Benchmark */}
          <div className="text-left md:text-right min-w-[75px]">
            <div className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1 md:justify-end">
              <Zap className="w-3 h-3 text-slate-400" />
              <span>Speed</span>
            </div>
            <div className="text-xs font-semibold text-slate-300 mt-0.5">
              {lvl.stats.bestWpm ? (
                <span className="text-white font-bold">
                  {lvl.stats.bestWpm} <span className="text-[10px] text-slate-500">WPM</span>
                </span>
              ) : (
                <span className="text-amber-400/90 font-mono">
                  {lvl.benchmark} <span className="text-[10px] text-slate-500">WPM</span>
                </span>
              )}
            </div>
          </div>

          {/* Open Level Action Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleChooseLevel(lvl.level);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
              isSelected
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 hover:bg-cyan-400'
                : 'bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 border border-slate-700 hover:border-cyan-400'
            }`}
          >
            <span>{isSelected ? 'Loaded' : 'Play Level'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    );
  };

  // Render individual item in Grid Form (alternative view)
  const renderGridItem = (lvl: typeof allLevels[0]) => {
    const isSelected = lvl.level === currentLevel;

    return (
      <div
        key={lvl.level}
        onClick={() => handleChooseLevel(lvl.level)}
        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between group ${
          isSelected
            ? 'bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500/50 shadow-lg shadow-cyan-500/10'
            : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
        }`}
      >
        <div>
          {/* Card Top */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold ${
                  isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-400'
                }`}
              >
                Lv {lvl.level}
              </span>
              <span className={`text-[11px] font-semibold ${lvl.tier.color}`}>
                {lvl.tier.name}
              </span>
            </div>

            {lvl.stats.isCompleted ? (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3" />
                Passed
              </span>
            ) : (
              <span className="text-[11px] font-mono text-slate-500">
                {lvl.benchmark} WPM
              </span>
            )}
          </div>

          {/* Title */}
          <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
            {lvl.title}
          </h4>

          {/* Short Description */}
          <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">
            {lvl.shortDescription}
          </p>

          {/* Snippet Preview */}
          <p className="text-[11px] text-slate-500 mt-1.5 font-mono line-clamp-2 bg-slate-950/80 p-2 rounded-lg border border-slate-800/50">
            {lvl.preview}
          </p>
        </div>

        {/* Card Stats */}
        <div className="mt-3 pt-2 border-t border-slate-800/50 flex items-center justify-between text-[11px]">
          <div className="text-slate-400">
            <span className="text-cyan-400 font-bold">{lvl.stats.totalCompleted.toLocaleString()}</span> completed
          </div>
          <div className="text-right">
            {lvl.stats.highestAccuracy !== null ? (
              <span className="text-emerald-400 font-semibold">{lvl.stats.highestAccuracy.toFixed(1)}% Acc</span>
            ) : (
              <span className="text-slate-500">≥{lvl.targetAccuracy}% Acc</span>
            )}
          </div>
        </div>

        {/* Bottom action */}
        <div className="mt-2 flex items-center justify-end">
          <span className="text-cyan-400 font-semibold text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            {isSelected ? 'Loaded' : 'Play'}
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-slate-900/70 border border-slate-800/90 rounded-2xl p-3.5 sm:p-4 backdrop-blur-md">
      {/* Top row: Stepper, Level Badge, Tier indicator, Quick navigation */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Level badge with steppers */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1 shadow-inner">
            <button
              id="level-jump-minus-10"
              onClick={() => handleStep(-10)}
              disabled={disabled || currentLevel <= 1}
              title="Jump back 10 levels"
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              id="level-step-minus-1"
              onClick={() => handleStep(-1)}
              disabled={disabled || currentLevel <= 1}
              title="Previous level"
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="px-3 py-1 flex items-center gap-1.5 min-w-[100px] justify-center">
              <span className="text-xs font-mono uppercase text-slate-500 font-medium">Level</span>
              <span className="text-base font-bold font-mono text-cyan-400">{currentLevel}</span>
              <span className="text-xs font-mono text-slate-600">/ 100</span>
            </div>

            <button
              id="level-step-plus-1"
              onClick={() => handleStep(1)}
              disabled={disabled || currentLevel >= 100}
              title="Next level"
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              id="level-jump-plus-10"
              onClick={() => handleStep(10)}
              disabled={disabled || currentLevel >= 100}
              title="Jump forward 10 levels"
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>

          {/* Tier Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${currentTier.bg} ${currentTier.border} ${currentTier.color}`}
          >
            <span>{currentTier.icon}</span>
            <span>{currentTier.name}</span>
          </div>

          {/* Benchmark speed */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 font-mono">
            <span className="text-slate-500">Benchmark:</span>
            <span className="font-bold text-amber-400">{currentBenchmark} WPM</span>
          </div>

          {/* Completion checkmark if finished */}
          {completedLevels.includes(currentLevel) && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Passed</span>
            </div>
          )}
        </div>

        {/* Right: Progress counter and Level List Controls */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="text-xs text-slate-400 font-mono">
            Passed: <span className="text-cyan-400 font-semibold">{completedLevels.length}</span> / 100
          </div>

          {/* Inline List Form Toggle Button */}
          <button
            id="toggle-inline-level-list-btn"
            onClick={() => setShowInlineList(!showInlineList)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              showInlineList
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-slate-950/70 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Levels in List</span>
            {showInlineList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Full-Screen Catalog Modal button */}
          <button
            id="open-level-catalog-btn"
            onClick={() => setShowCatalog(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-all hover:border-cyan-400"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Full Catalog</span>
          </button>
        </div>
      </div>

      {/* Middle row: Interactive Level Slider */}
      <div className="mt-3.5 flex items-center gap-3">
        <span className="text-[11px] font-mono text-slate-500 font-semibold">Lv 1</span>
        <div className="relative flex-1 flex items-center">
          <input
            id="level-range-slider"
            type="range"
            min="1"
            max="100"
            value={currentLevel}
            onChange={handleSliderChange}
            disabled={disabled}
            className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-800"
          />
        </div>
        <span className="text-[11px] font-mono text-slate-500 font-semibold">Lv 100</span>
      </div>

      {/* Bottom row: Current Level Title & Short Description snippet */}
      <div className="mt-2.5 pt-2.5 border-t border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-300 flex-wrap">
          <span className="font-semibold text-white">{currentSnippet.title}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">{currentSnippet.description}</span>
          {currentStats.highestAccuracy !== null && (
            <>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-mono font-semibold">
                Best: {currentStats.highestAccuracy.toFixed(1)}% Acc
              </span>
            </>
          )}
          <span className="text-slate-600">·</span>
          <span className="text-cyan-400 font-mono">
            {currentStats.totalCompleted.toLocaleString()} completed
          </span>
        </div>

        {/* Quick Tier Jumps */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-0.5">
          <span className="text-[10px] uppercase font-mono text-slate-600 mr-1 whitespace-nowrap">Tier:</span>
          {[1, 11, 21, 31, 41, 51, 61, 71, 81, 91].map((lvl) => {
            const tier = getTierForLevel(lvl);
            const isActive = currentLevel >= lvl && currentLevel < lvl + 10;
            return (
              <button
                key={lvl}
                onClick={() => onSelectLevel(lvl)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors whitespace-nowrap ${
                  isActive
                    ? `${tier.bg} ${tier.color} font-bold border ${tier.border}`
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                }`}
                title={`Jump to ${tier.name} (Level ${lvl})`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>

      {/* INLINE EXPANDABLE LEVELS LIST FORM */}
      {showInlineList && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60">
            <div className="flex items-center gap-2">
              <List className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                {mode.toUpperCase()} Levels List (1–100)
              </span>
              <span className="text-xs text-slate-400">
                · Click any level to open and start typing immediately
              </span>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-56">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search level, title, syntax..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-2.5 py-1 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Levels</option>
                <option value="completed">Passed Only</option>
                <option value="uncompleted">Uncompleted</option>
              </select>

              {/* View mode toggle */}
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded-lg text-xs ${
                    viewMode === 'list' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="List Form"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded-lg text-xs ${
                    viewMode === 'grid' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Grid Form"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => setShowInlineList(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Collapse list"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tier quick-filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-2">
            <button
              onClick={() => setSelectedTierFilter('all')}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTierFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All (100)
            </button>
            {LEVEL_TIERS.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTierFilter(tier.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 border ${
                  selectedTierFilter === tier.id
                    ? `${tier.bg} ${tier.color} ${tier.border} font-bold`
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800/80'
                }`}
              >
                <span>{tier.icon}</span>
                <span>{tier.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Scrollable List Container */}
          <div className="max-h-[380px] overflow-y-auto pr-1 space-y-2.5">
            {filteredLevels.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs font-mono">
                No levels matching criteria. Try clearing search filters.
              </div>
            ) : viewMode === 'list' ? (
              filteredLevels.map(renderListItem)
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredLevels.map(renderGridItem)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FULL CATALOG MODAL IN LIST FORM */}
      {showCatalog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    {mode.toUpperCase()} Mode: 100 Levels Progression
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click any level in the list to open it and immediately start typing. Displays completions and highest accuracy.
                  </p>
                </div>
              </div>

              <button
                id="close-level-catalog-btn"
                onClick={() => setShowCatalog(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filters Bar: Search, Status, Tier selector & View Mode */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Search & Status */}
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search level (e.g. 42, 'Async', 'Hamlet')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Levels (100)</option>
                  <option value="completed">Passed Only ({completedLevels.length})</option>
                  <option value="uncompleted">Uncompleted ({100 - completedLevels.length})</option>
                </select>

                {/* List / Grid Toggle */}
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 shrink-0">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-colors ${
                      viewMode === 'list'
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>List</span>
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Grid</span>
                  </button>
                </div>
              </div>

              {/* Tier Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                <button
                  onClick={() => setSelectedTierFilter('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedTierFilter === 'all'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  All (100)
                </button>
                {LEVEL_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTierFilter(tier.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      selectedTierFilter === tier.id
                        ? `${tier.bg} ${tier.color} border ${tier.border} font-semibold`
                        : 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{tier.icon}</span>
                    <span>{tier.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Level Catalog in List Form (Scrollable) */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1">
              {filteredLevels.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-sm font-mono">
                  No levels match your filter or search query.
                </div>
              ) : viewMode === 'list' ? (
                <div className="space-y-3">
                  {filteredLevels.map(renderListItem)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredLevels.map(renderGridItem)}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span>Showing <strong className="text-white">{filteredLevels.length}</strong> of 100 levels</span>
                <span>·</span>
                <span>Passed: <strong className="text-emerald-400">{completedLevels.length}</strong></span>
              </div>
              <button
                onClick={() => setShowCatalog(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
