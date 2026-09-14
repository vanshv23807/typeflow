import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  User as UserIcon,
  Trophy,
  Zap,
  Target,
  Clock,
  Award,
  Flame,
  Sparkles,
  Crown,
  ShieldCheck,
  Edit2,
  Check,
  RotateCcw,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { TypingTestResult } from '../../types';

export const ProfileView: React.FC = () => {
  const { user, isAuthenticated, openAuthModal, updateProfile } = useAuth();
  const [userStats, setUserStats] = useState<any>(null);
  const [historyTests, setHistoryTests] = useState<TypingTestResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
  const [bioInput, setBioInput] = useState<string>('');
  const [selectedTest, setSelectedTest] = useState<TypingTestResult | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadProfileData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, historyRes] = await Promise.all([
        api.stats.getUserStats(),
        api.tests.getHistory({ limit: 20 })
      ]);
      setUserStats(statsRes);
      setHistoryTests(historyRes.tests);
      setBioInput(statsRes.user.bio || '');
    } catch (err) {
      console.warn('Failed to load user profile analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBio = async () => {
    try {
      await updateProfile({ bio: bioInput });
      setIsEditingBio(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-4xl mx-auto py-16 px-4 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <UserIcon className="w-8 h-8" />
        </div>
        <div className="max-w-md">
          <h2 className="text-2xl font-bold text-white font-display">Sign In to View Profile</h2>
          <p className="text-sm text-slate-400 mt-2">
            Track your lifetime typing analytics, unlock badges, review keystroke telemetry graphs, and maintain your personal bests.
          </p>
        </div>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const BADGE_DEFINITIONS: Record<string, { label: string; desc: string; icon: any; color: string }> = {
    speed_demon: { label: 'Speed Demon', desc: 'Reach 100+ WPM in any test', icon: Zap, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
    supersonic: { label: 'Supersonic', desc: 'Surpass 130+ WPM velocity', icon: Flame, color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' },
    laser_precision: { label: 'Laser Precision', desc: 'Attain 98%+ accuracy', icon: Target, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' },
    perfectionist: { label: 'Perfectionist', desc: 'Achieve a flawless 100% accuracy score', icon: Sparkles, color: 'text-purple-400 border-purple-500/40 bg-purple-500/10' },
    centurion: { label: 'Centurion', desc: 'Complete over 100 verified tests', icon: Award, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
    dedicated: { label: 'Dedicated', desc: 'Complete 25 verified tests', icon: ShieldCheck, color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
    first_victory: { label: 'First Blood', desc: 'Win 1st place in a multiplayer race', icon: Trophy, color: 'text-amber-300 border-amber-400/40 bg-amber-500/10' },
    race_champion: { label: 'Race Champion', desc: 'Win 10 multiplayer races', icon: Crown, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' }
  };

  const currentXp = user?.xp || 0;
  const currentLevel = user?.level || 1;
  const nextLevelXp = Math.pow(currentLevel, 2) * 50;
  const prevLevelXp = Math.pow(currentLevel - 1, 2) * 50;
  const progressPercent = Math.min(100, Math.max(0, Math.round(((currentXp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100))) || 15;

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 flex flex-col gap-8 animate-in fade-in duration-300">
      {/* Profile Header Card */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/20 text-2xl font-bold">
            {user?.avatar === 'bolt' && <Zap className="w-10 h-10" />}
            {user?.avatar === 'flame' && <Flame className="w-10 h-10" />}
            {user?.avatar === 'sparkles' && <Sparkles className="w-10 h-10" />}
            {user?.avatar === 'crown' && <Crown className="w-10 h-10" />}
            {!['bolt', 'flame', 'sparkles', 'crown'].includes(user?.avatar || '') && user?.username[0]?.toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white font-display">{user?.username}</h1>
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Level {currentLevel}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-0.5 font-mono">{user?.email}</p>

            {/* Editable Bio */}
            <div className="mt-2 flex items-center gap-2">
              {isEditingBio ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    maxLength={140}
                    className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleSaveBio}
                    className="p-1 rounded bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-300 italic">"{user?.bio || 'Ready to elevate typing speed.'}"</p>
                  <button
                    onClick={() => setIsEditingBio(true)}
                    className="text-slate-500 hover:text-slate-300"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Level XP Bar */}
        <div className="w-full md:w-64 flex flex-col gap-1.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Level {currentLevel}</span>
            <span className="text-cyan-400 font-bold">{currentXp} XP</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 text-right">
            {nextLevelXp - currentXp} XP to Level {currentLevel + 1}
          </div>
        </div>
      </div>

      {/* Lifetime Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
          <div className="text-[10px] font-mono uppercase text-slate-500">Best Speed</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">{user?.stats.bestWpm || 0}</div>
          <div className="text-[10px] text-slate-500">WPM</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
          <div className="text-[10px] font-mono uppercase text-slate-500">Average Speed</div>
          <div className="text-2xl font-bold font-mono text-slate-200 mt-1">{user?.stats.avgWpm || 0}</div>
          <div className="text-[10px] text-slate-500">WPM</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
          <div className="text-[10px] font-mono uppercase text-slate-500">Average Acc</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{user?.stats.avgAccuracy || 0}%</div>
          <div className="text-[10px] text-slate-500">Accuracy</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
          <div className="text-[10px] font-mono uppercase text-slate-500">Tests Done</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{user?.stats.testsCompleted || 0}</div>
          <div className="text-[10px] text-slate-500">Completed</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
          <div className="text-[10px] font-mono uppercase text-slate-500">Races Won</div>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-1">{user?.stats.racesWon || 0}</div>
          <div className="text-[10px] text-slate-500">1st Place</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
          <div className="text-[10px] font-mono uppercase text-slate-500">Time Typed</div>
          <div className="text-2xl font-bold font-mono text-slate-300 mt-1">
            {Math.round((user?.stats.timeSpentSeconds || 0) / 60)}m
          </div>
          <div className="text-[10px] text-slate-500">Active Minutes</div>
        </div>
      </div>

      {/* Badges Showcase */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Earned Badges</h3>
            <p className="text-xs text-slate-400">Accomplishments unlocked across tests and races</p>
          </div>
          <span className="text-xs font-mono text-slate-500">{user?.badges.length || 0} Unlocked</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(BADGE_DEFINITIONS).map(([id, def]) => {
            const isUnlocked = user?.badges.includes(id);
            const Icon = def.icon;
            return (
              <div
                key={id}
                className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-colors ${
                  isUnlocked
                    ? def.color
                    : 'border-slate-800/60 bg-slate-950/40 opacity-40 grayscale'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-900/80">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{def.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{def.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Speed Progression Chart */}
      {userStats?.speedProgression && userStats.speedProgression.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Velocity Over Time</h3>
              <p className="text-xs text-slate-400">Progression across your recent typing tests</p>
            </div>
            <span className="text-xs font-mono text-cyan-400">WPM Growth</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userStats.speedProgression} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="index" stroke="#64748b" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis stroke="#64748b" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${val} WPM`, 'Speed']}
                  labelFormatter={(label) => `Test #${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="wpm"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#06b6d4' }}
                  activeDot={{ r: 5, fill: '#38bdf8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Test History Table */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-1">Previous Attempts</h3>
        <p className="text-xs text-slate-400 mb-4">Click any test row to view full timeline details</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">WPM</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Characters</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {historyTests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No tests recorded yet. Complete a test in Practice mode!
                  </td>
                </tr>
              ) : (
                historyTests.map(test => (
                  <tr
                    key={test.id}
                    onClick={() => setSelectedTest(test)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-slate-300">
                      {test.mode} {test.modeValue}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">{test.wpm}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{test.accuracy}%</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{test.durationSeconds}s</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{test.correctChars} / {test.incorrectChars}</td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-right">
                      {new Date(test.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Test Detail Modal */}
      {selectedTest && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-white text-base">Test Result Details</h4>
                <p className="text-xs text-slate-400">{selectedTest.textTitle}</p>
              </div>
              <button
                onClick={() => setSelectedTest(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 font-mono">Net WPM</div>
                <div className="text-2xl font-bold font-mono text-cyan-400">{selectedTest.wpm}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 font-mono">Accuracy</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">{selectedTest.accuracy}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 font-mono">Raw WPM</div>
                <div className="text-2xl font-bold font-mono text-slate-300">{selectedTest.rawWpm}</div>
              </div>
            </div>

            <div className="text-xs text-slate-400 space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex justify-between">
                <span>Mode:</span>
                <span className="font-mono text-white">{selectedTest.mode} {selectedTest.modeValue}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-mono text-white">{selectedTest.durationSeconds}s</span>
              </div>
              <div className="flex justify-between">
                <span>Correct / Incorrect Chars:</span>
                <span className="font-mono text-white">{selectedTest.correctChars} / {selectedTest.incorrectChars}</span>
              </div>
              <div className="flex justify-between">
                <span>Recorded:</span>
                <span className="font-mono text-white">{new Date(selectedTest.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTest(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
