import React, { useState } from 'react';
import {
  Keyboard,
  Trophy,
  Users,
  User as UserIcon,
  Home as HomeIcon,
  Volume2,
  VolumeX,
  Palette,
  Sparkles,
  Zap,
  Flame,
  Crown,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeName } from '../types';

interface HeaderProps {
  activeTab: 'home' | 'test' | 'multiplayer' | 'leaderboard' | 'profile';
  setActiveTab: (tab: 'home' | 'test' | 'multiplayer' | 'leaderboard' | 'profile') => void;
  activeRacersCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeRacersCount = 0
}) => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { theme, setTheme, soundEnabled, setSoundEnabled } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const themeOptions: { id: ThemeName; label: string; color: string }[] = [
    { id: 'midnight', label: 'Midnight Cyan', color: '#06b6d4' },
    { id: 'cyber', label: 'Cyber Gold', color: '#eab308' },
    { id: 'matrix', label: 'Matrix Terminal', color: '#10b981' },
    { id: 'sunset', label: 'Sunset Neon', color: '#f97316' },
    { id: 'arctic', label: 'Arctic Frost', color: '#38bdf8' }
  ];

  return (
    <header className="border-b border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
          id="typeflow-brand-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
            <Keyboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-xl tracking-wider text-white">TYPE<span className="text-cyan-400">FLOW</span></span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">v1.0</span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Measure your speed. Master your typing.</p>
          </div>
        </div>

        {/* Center Nav */}
        <nav className="flex items-center bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          <button
            id="nav-tab-home"
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === 'home'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <HomeIcon className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            id="nav-tab-test"
            onClick={() => setActiveTab('test')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === 'test'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>Practice</span>
          </button>

          <button
            id="nav-tab-multiplayer"
            onClick={() => setActiveTab('multiplayer')}
            className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === 'multiplayer'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Multiplayer</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-1.5 right-1.5" />
          </button>

          <button
            id="nav-tab-leaderboard"
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === 'leaderboard'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">Leaderboard</span>
          </button>

          <button
            id="nav-tab-profile"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === 'profile'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </button>
        </nav>

        {/* Right Settings & Auth */}
        <div className="flex items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Disable mechanical key sound' : 'Enable mechanical key sound'}
            className={`p-2 rounded-lg border transition-colors ${
              soundEnabled
                ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20'
                : 'border-slate-800 text-slate-500 bg-slate-900/50 hover:text-slate-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Dropdown */}
          <div className="relative">
            <button
              id="theme-menu-btn"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-2 rounded-lg border border-slate-800 text-slate-400 bg-slate-900/50 hover:text-white hover:border-slate-700 transition-colors"
              title="Change Theme"
            >
              <Palette className="w-4 h-4" />
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-1.5 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Color Themes
                </div>
                {themeOptions.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-slate-800/80 transition-colors ${
                      theme === t.id ? 'text-white font-medium bg-slate-800/40' : 'text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                      <span>{t.label}</span>
                    </div>
                    {theme === t.id && <span className="text-xs text-cyan-400">●</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth Button or User Profile pill */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                id="user-profile-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                  {user.avatar === 'bolt' && <Zap className="w-3.5 h-3.5" />}
                  {user.avatar === 'flame' && <Flame className="w-3.5 h-3.5" />}
                  {user.avatar === 'sparkles' && <Sparkles className="w-3.5 h-3.5" />}
                  {user.avatar === 'crown' && <Crown className="w-3.5 h-3.5" />}
                  {!['bolt', 'flame', 'sparkles', 'crown'].includes(user.avatar) && user.username[0]?.toUpperCase()}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold text-white leading-tight">{user.username}</div>
                  <div className="text-[10px] text-cyan-400 font-mono">Lv. {user.level} · {user.stats.bestWpm} WPM</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-2 z-50">
                  <div className="px-3.5 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white">{user.username}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">XP Progress</span>
                      <span className="text-cyan-400 font-mono">{user.xp} XP</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              id="header-sign-in-btn"
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 text-sm font-medium transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
