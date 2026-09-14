import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { HomeView } from './components/home/HomeView';
import { TypingTest } from './components/typing/TypingTest';
import { TestResults } from './components/typing/TestResults';
import { MultiplayerView } from './components/multiplayer/MultiplayerView';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { ProfileView } from './components/profile/ProfileView';
import { AuthModal } from './components/auth/AuthModal';
import { TypingTestResult } from './types';
import { Activity, ShieldCheck, Heart } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'home' | 'test' | 'multiplayer' | 'leaderboard' | 'profile'>('home');
  const [currentResult, setCurrentResult] = useState<TypingTestResult | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  const handleTestComplete = (result: TypingTestResult) => {
    setCurrentResult(result);
    if (result.level) {
      setSelectedLevel(result.level);
    }
  };

  const handleNextTest = () => {
    setCurrentResult(null);
  };

  const handleRetrySame = () => {
    setCurrentResult(null);
  };

  const handleAdvanceLevel = () => {
    const currentLvl = currentResult?.level || selectedLevel;
    const nextLvl = Math.min(100, currentLvl + 1);
    setSelectedLevel(nextLvl);
    setCurrentResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--bg-main)] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'test') {
            // Keep current result or allow going back
          }
        }}
      />

      <main className="flex-1 flex flex-col justify-center">
        {activeTab === 'home' && (
          <HomeView
            onEnterApp={() => setActiveTab('test')}
            onEnterMultiplayer={() => setActiveTab('multiplayer')}
            onEnterLeaderboard={() => setActiveTab('leaderboard')}
          />
        )}

        {activeTab === 'test' && (
          currentResult ? (
            <TestResults
              result={currentResult}
              onNextTest={handleNextTest}
              onRetrySame={handleRetrySame}
              onAdvanceLevel={handleAdvanceLevel}
            />
          ) : (
            <TypingTest
              onTestComplete={handleTestComplete}
              initialLevel={selectedLevel}
              onLevelChange={(lvl) => setSelectedLevel(lvl)}
            />
          )
        )}

        {activeTab === 'multiplayer' && <MultiplayerView />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900/80 bg-slate-950/40 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-slate-300">TYPEFLOW</span>
            <span>·</span>
            <span>Full-Stack Typing Performance Tracker</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              REST API & Socket.IO Active
            </span>
            <span>·</span>
            <span>Port 3000 Ingress</span>
          </div>
        </div>
      </footer>

      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
