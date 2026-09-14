import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart
} from 'recharts';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  ArrowRight,
  Share2,
  Check,
  Zap,
  Target,
  Clock,
  Sparkles,
  AlertTriangle,
  Flame,
  Award
} from 'lucide-react';
import { TypingTestResult } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { getTierForLevel, getBenchmarkWpm } from '../../services/levelEngine';

interface TestResultsProps {
  result: TypingTestResult;
  onNextTest: () => void;
  onRetrySame: () => void;
  onAdvanceLevel?: () => void;
}

export const TestResults: React.FC<TestResultsProps> = ({
  result,
  onNextTest,
  onRetrySame,
  onAdvanceLevel
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [copied, setCopied] = useState(false);

  const levelNum = result.level || 1;
  const levelTier = getTierForLevel(levelNum);
  const benchmarkWpm = getBenchmarkWpm(levelNum);
  const isLevelPassed = result.accuracy >= 88 && (result.mode === 'code' ? result.correctChars > 8 : result.wpm >= Math.max(12, benchmarkWpm * 0.65));

  // Trigger celebration confetti
  useEffect(() => {
    if (result.wpm >= 80 || result.accuracy >= 98 || isLevelPassed) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b']
      });
    }
  }, [result.wpm, result.accuracy, isLevelPassed]);

  // Calculate tier
  const getTier = (wpm: number, accuracy: number) => {
    if (wpm >= 120 && accuracy >= 98) return { label: 'Apex Velocity', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    if (wpm >= 100) return { label: 'Grandmaster Typer', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' };
    if (wpm >= 80) return { label: 'Master Typist', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (wpm >= 60) return { label: 'Advanced Pro', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' };
    if (wpm >= 40) return { label: 'Intermediate Speed', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' };
    return { label: 'Rising Typist', color: 'text-slate-400', bg: 'bg-slate-800/40 border-slate-700' };
  };

  const tier = getTier(result.wpm, result.accuracy);

  // Calculate consistency (% variance)
  const calculateConsistency = () => {
    if (!result.timeline || result.timeline.length < 2) return 94;
    const speeds = result.timeline.map(p => p.wpm);
    const mean = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    if (mean === 0) return 100;
    const variance = speeds.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / speeds.length;
    const stdDev = Math.sqrt(variance);
    const cv = (stdDev / mean) * 100;
    return Math.max(50, Math.min(100, Math.round(100 - cv)));
  };

  const consistency = calculateConsistency();

  // Copy share card
  const handleCopyShare = () => {
    const text = `⚡ TYPEFLOW Typing Performance ⚡\nSpeed: ${result.wpm} WPM (Raw: ${result.rawWpm})\nAccuracy: ${result.accuracy}%\nConsistency: ${consistency}%\nMode: ${result.mode} ${result.modeValue}\nTest Text: "${result.textTitle}"\nMaster your typing at TYPEFLOW!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard shortcut listener (Tab for next test)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        onNextTest();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNextTest]);

  // Ensure chart data has at least some data points for display
  const chartData = result.timeline.length > 0 ? result.timeline : [
    { second: 0, wpm: 0, rawWpm: 0, errors: 0 },
    { second: result.durationSeconds, wpm: result.wpm, rawWpm: result.rawWpm, errors: result.incorrectChars }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 flex flex-col gap-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${levelTier.bg} ${levelTier.border} ${levelTier.color}`}>
              {levelTier.icon} Level {levelNum}: {levelTier.name}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
              isLevelPassed 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              {isLevelPassed ? 'Level Passed ✓' : 'Practice Target'}
            </span>
            <span className="text-xs text-slate-500 font-mono">Target: {benchmarkWpm} WPM</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-display">Performance Telemetry</h2>
          <p className="text-xs text-slate-400 mt-0.5">{result.textTitle} · {result.mode.toUpperCase()} Mode (Level {levelNum}/100)</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={handleCopyShare}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Card!' : 'Share'}</span>
          </button>

          <button
            onClick={onRetrySame}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Repeat Level {levelNum}</span>
          </button>

          {onAdvanceLevel && levelNum < 100 ? (
            <button
              id="results-advance-level-btn"
              onClick={onAdvanceLevel}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/25 transition-all hover:scale-[1.02]"
            >
              <span>Advance to Level {levelNum + 1}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              id="results-next-test-btn"
              onClick={onNextTest}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]"
            >
              <span>Next Test</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Net WPM */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
          <div className="text-xs font-mono uppercase text-slate-500 flex items-center justify-between">
            <span>Net Speed</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-5xl font-extrabold font-mono text-cyan-400 tracking-tight">{result.wpm}</div>
            <div className="text-xs font-mono text-slate-500 mt-1">Words Per Minute</div>
          </div>
          <div className="text-[11px] text-slate-400">
            Raw: <span className="font-mono text-slate-300">{result.rawWpm} WPM</span>
          </div>
        </div>

        {/* Accuracy */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
          <div className="text-xs font-mono uppercase text-slate-500 flex items-center justify-between">
            <span>Accuracy</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className={`text-5xl font-extrabold font-mono tracking-tight ${result.accuracy >= 95 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {result.accuracy}%
            </div>
            <div className="text-xs font-mono text-slate-500 mt-1">Correct Keystrokes</div>
          </div>
          <div className="text-[11px] text-slate-400">
            Consistency: <span className="font-mono text-slate-300">{consistency}%</span>
          </div>
        </div>

        {/* Characters Breakdown */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
          <div className="text-xs font-mono uppercase text-slate-500 flex items-center justify-between">
            <span>Characters</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-bold font-mono text-slate-200">
              <span className="text-cyan-400">{result.correctChars}</span>
              <span className="text-slate-600 mx-1">/</span>
              <span className="text-rose-400">{result.incorrectChars}</span>
            </div>
            <div className="text-xs font-mono text-slate-500 mt-1">Correct / Incorrect</div>
          </div>
          <div className="text-[11px] text-slate-400">
            Total Typed: <span className="font-mono text-slate-300">{result.correctChars + result.incorrectChars}</span>
          </div>
        </div>

        {/* Duration / Time */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
          <div className="text-xs font-mono uppercase text-slate-500 flex items-center justify-between">
            <span>Duration</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-5xl font-extrabold font-mono text-amber-400 tracking-tight">{result.durationSeconds}s</div>
            <div className="text-xs font-mono text-slate-500 mt-1">Time Elapsed</div>
          </div>
          <div className="text-[11px] text-slate-400">
            Mode: <span className="font-mono text-slate-300">{result.mode}</span>
          </div>
        </div>
      </div>

      {/* Speed Over Time Graph (Recharts) */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-white">Velocity Progression</h3>
            <p className="text-xs text-slate-400">Second-by-second WPM and raw typing bursts</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-cyan-400 rounded" />
              <span className="text-slate-300">WPM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-500 rounded" />
              <span className="text-slate-400">Raw</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-rose-400">Errors</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="second"
                stroke="#64748b"
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
                unit="s"
              />
              <YAxis
                stroke="#64748b"
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                }}
                formatter={(val: any, name: any) => [
                  `${val} ${name === 'errors' ? 'err' : 'WPM'}`,
                  name === 'wpm' ? 'Net WPM' : name === 'rawWpm' ? 'Raw WPM' : 'Errors'
                ]}
                labelFormatter={(label) => `Time: ${label}s`}
              />
              <Area
                type="monotone"
                dataKey="wpm"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#wpmGradient)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="rawWpm"
                stroke="#64748b"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Guest Prompt to save stats */}
      {!isAuthenticated && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-blue-950/40 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-white">Save your stats to the Global Leaderboard</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Create a free account to track historical progress, earn XP levels, unlock badges, and race against others.
            </p>
          </div>
          <button
            onClick={() => openAuthModal('register')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold whitespace-nowrap transition-colors"
          >
            Create Free Account
          </button>
        </div>
      )}
    </div>
  );
};
