import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Crown,
  Medal,
  Flame,
  Zap,
  Sparkles,
  Search,
  Filter,
  Calendar,
  Clock,
  Type
} from 'lucide-react';
import { LeaderboardEntry } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const LeaderboardView: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [timeframe, setTimeframe] = useState<string>('all');
  const [mode, setMode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userRank, setUserRank] = useState<{ rank: number; wpm: number; accuracy: number; mode: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe, mode]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const res = await api.leaderboard.getLeaderboard({ timeframe, mode });
      setEntries(res.entries);
      setUserRank(res.userRank || null);
    } catch (err) {
      console.warn('Failed to load leaderboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEntries = entries.filter(e =>
    e.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topThree = filteredEntries.slice(0, 3);
  const restEntries = filteredEntries.slice(3);

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 flex flex-col gap-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-8 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">Global Hall of Fame</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-display">Fastest Typists</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time leaderboard updated with validated test scores</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl bg-slate-900/40 border border-slate-800">
        {/* Timeframe */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
          {[
            { id: 'all', label: 'All-Time' },
            { id: 'monthly', label: 'Monthly' },
            { id: 'weekly', label: 'Weekly' },
            { id: 'daily', label: 'Daily' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTimeframe(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                timeframe === t.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Mode */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
          {[
            { id: 'all', label: 'All Modes' },
            { id: '15', label: '15s' },
            { id: '30', label: '30s' },
            { id: '60', label: '60s' },
            { id: 'words', label: 'Words' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                mode === m.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {topThree.length > 0 && !searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* #2 Silver */}
          {topThree[1] && (
            <div className="order-2 md:order-1 p-6 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 mb-3">
                <Medal className="w-6 h-6 text-slate-300" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold">#2 Place</span>
              <h3 className="text-lg font-bold text-white mt-1">{topThree[1].username}</h3>
              <div className="text-4xl font-extrabold font-mono text-slate-200 mt-2">{topThree[1].wpm} <span className="text-xs font-mono text-slate-500">WPM</span></div>
              <div className="text-xs text-slate-400 mt-1">{topThree[1].accuracy}% Accuracy</div>
            </div>
          )}

          {/* #1 Gold */}
          {topThree[0] && (
            <div className="order-1 md:order-2 p-8 rounded-3xl bg-gradient-to-b from-amber-500/10 via-slate-900/60 to-slate-900 border border-amber-500/30 flex flex-col items-center text-center relative overflow-hidden shadow-xl shadow-amber-500/5 -translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/20">
                <Crown className="w-8 h-8 text-amber-400" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">#1 Champion</span>
              <h3 className="text-xl font-bold text-white mt-1">{topThree[0].username}</h3>
              <div className="text-5xl font-extrabold font-mono text-amber-300 mt-2">{topThree[0].wpm} <span className="text-xs font-mono text-slate-500">WPM</span></div>
              <div className="text-xs text-amber-200/80 mt-1">{topThree[0].accuracy}% Accuracy</div>
            </div>
          )}

          {/* #3 Bronze */}
          {topThree[2] && (
            <div className="order-3 md:order-3 p-6 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-center text-amber-600 mb-3">
                <Medal className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-700 font-bold">#3 Place</span>
              <h3 className="text-lg font-bold text-white mt-1">{topThree[2].username}</h3>
              <div className="text-4xl font-extrabold font-mono text-slate-300 mt-2">{topThree[2].wpm} <span className="text-xs font-mono text-slate-500">WPM</span></div>
              <div className="text-xs text-slate-400 mt-1">{topThree[2].accuracy}% Accuracy</div>
            </div>
          )}
        </div>
      )}

      {/* Rankings Table */}
      <div className="rounded-3xl bg-slate-900/50 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-950/40">
                <th className="py-3.5 px-6">Rank</th>
                <th className="py-3.5 px-6">Typer</th>
                <th className="py-3.5 px-6">Net WPM</th>
                <th className="py-3.5 px-6">Raw WPM</th>
                <th className="py-3.5 px-6">Accuracy</th>
                <th className="py-3.5 px-6">Mode</th>
                <th className="py-3.5 px-6 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 animate-pulse">
                    Loading rankings...
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No scores found for the selected filters.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => {
                  const isCurrentUser = user && entry.userId === user.id;
                  return (
                    <tr
                      key={entry.testId}
                      className={`hover:bg-slate-800/30 transition-colors ${
                        isCurrentUser ? 'bg-cyan-500/10 font-semibold' : ''
                      }`}
                    >
                      <td className="py-4 px-6 font-mono text-xs font-bold text-slate-400">
                        {entry.rank === 1 && <span className="text-amber-400">#1</span>}
                        {entry.rank === 2 && <span className="text-slate-300">#2</span>}
                        {entry.rank === 3 && <span className="text-amber-600">#3</span>}
                        {entry.rank > 3 && `#${entry.rank}`}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 text-xs font-bold">
                            {entry.avatar === 'bolt' ? <Zap className="w-4 h-4" /> :
                             entry.avatar === 'flame' ? <Flame className="w-4 h-4" /> :
                             entry.avatar === 'sparkles' ? <Sparkles className="w-4 h-4" /> :
                             entry.username[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium flex items-center gap-1.5">
                              <span>{entry.username}</span>
                              {isCurrentUser && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 font-mono">YOU</span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">Lv. {entry.level}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-cyan-400 text-base">{entry.wpm}</td>
                      <td className="py-4 px-6 font-mono text-slate-400">{entry.rawWpm}</td>
                      <td className="py-4 px-6 font-mono">
                        <span className={entry.accuracy >= 98 ? 'text-emerald-400' : 'text-slate-300'}>
                          {entry.accuracy}%
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs font-mono uppercase text-slate-400 px-2 py-0.5 rounded bg-slate-800/80">
                          {entry.mode} {entry.modeValue}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-xs text-slate-500">
                        {new Date(entry.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
