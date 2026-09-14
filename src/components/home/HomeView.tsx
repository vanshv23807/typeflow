import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Keyboard,
  Zap,
  Users,
  Trophy,
  BarChart3,
  Volume2,
  Code2,
  ShieldCheck,
  Sparkles,
  Flame,
  Crown,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  Play,
  Layers,
  Clock,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../services/sound';

interface HomeViewProps {
  onEnterApp: () => void;
  onEnterMultiplayer: () => void;
  onEnterLeaderboard: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onEnterApp,
  onEnterMultiplayer,
  onEnterLeaderboard,
}) => {
  const { user, isAuthenticated, register } = useAuth();

  // Signup form state
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('bolt');
  const [signupError, setSignupError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Animated live typing preview simulation state
  const demoText = "TypeFlow delivers precision keystroke analytics and multiplayer speed racing.";
  const [typedCharsCount, setTypedCharsCount] = useState(0);
  const [simulatedWpm, setSimulatedWpm] = useState(128);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Live typing simulator loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTypedCharsCount(prev => {
        const next = (prev + 1) % (demoText.length + 15);
        if (next <= demoText.length && next > 0) {
          const char = demoText[next - 1].toUpperCase();
          setActiveKey(char);
          setSimulatedWpm(Math.floor(124 + Math.sin(next * 0.4) * 16));
        } else {
          setActiveKey(null);
        }
        return next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [demoText]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (!signupUsername.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setSignupError('Please complete all required fields.');
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(signupUsername.trim(), signupEmail.trim(), signupPassword, selectedAvatar);
      setSignupSuccess(true);
      setTimeout(() => {
        onEnterApp();
      }, 1200);
    } catch (err: any) {
      setSignupError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'SPACE']
  ];

  return (
    <div className="w-full relative overflow-hidden">
      {/* Background Animated Ambient Lights & Grid */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-[600px] -left-40 w-[600px] h-[400px] bg-blue-600/10 blur-[140px] rounded-full" />
        <div className="absolute top-[1200px] -right-40 w-[600px] h-[450px] bg-emerald-500/10 blur-[140px] rounded-full" />
        {/* Fine background grid */}
        <div className="w-full h-full bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column: Headline & Value Proposition */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Live Indicator Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>TYPEFLOW v1.0 · REAL-TIME MULTIPLAYER ENGINE</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              Measure Your Speed. <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                Master Your Typing Flow.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-sans">
              A high-precision Typing Performance Tracker built with full-stack telemetry.
              Race friends in real-time WebSockets lobbies, dissect your keystroke velocity with second-by-second graphs,
              and conquer programming syntax challenges.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <button
                id="hero-enter-app-btn"
                onClick={onEnterApp}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-base hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98] group"
              >
                <Play className="w-5 h-5 fill-current text-slate-950" />
                <span>Enter TYPEFLOW Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-multiplayer-btn"
                onClick={onEnterMultiplayer}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 font-medium text-base hover:bg-slate-800 hover:border-cyan-500/40 hover:text-white transition-all active:scale-[0.98]"
              >
                <Users className="w-5 h-5 text-cyan-400" />
                <span>Multiplayer Races</span>
              </button>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 w-full max-w-lg">
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-cyan-400">180+</div>
                <div className="text-xs text-slate-400 mt-0.5">Max Tracked WPM</div>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-teal-300">0ms</div>
                <div className="text-xs text-slate-400 mt-0.5">Input Keystroke Lag</div>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-blue-400">100%</div>
                <div className="text-xs text-slate-400 mt-0.5">Live WebSocket Sync</div>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Column: Moving Cool Animation Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            {/* Ambient Glow behind terminal */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/30 to-blue-600/30 blur-xl opacity-60" />

            {/* Floating Telemetry Badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-5 -right-3 sm:-right-6 z-20 bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-2.5"
            >
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase text-slate-400 font-mono">Burst Peak</div>
                <div className="text-sm font-mono font-bold text-white">142 WPM</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-5 -left-3 sm:-left-6 z-20 bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-2.5"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase text-slate-400 font-mono">Accuracy</div>
                <div className="text-sm font-mono font-bold text-white">99.4% Flawless</div>
              </div>
            </motion.div>

            {/* Terminal Window */}
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
              {/* Window Header */}
              <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-xs text-slate-400">typeflow://telemetry-live.sh</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{simulatedWpm} WPM</span>
                </div>
              </div>

              {/* Terminal Content: Simulated Live Typing */}
              <div className="p-6 space-y-6">
                {/* Live Speed Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>REAL-TIME VELOCITY HUD</span>
                    <span className="text-cyan-400 font-bold">{simulatedWpm} WPM · 100% ACC</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full"
                      style={{ width: `${Math.min(100, (simulatedWpm / 160) * 100)}%` }}
                      transition={{ type: "spring", stiffness: 100 }}
                    />
                  </div>
                </div>

                {/* Animated Typing Text display */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-sm leading-relaxed min-h-[90px]">
                  <span className="text-cyan-300">
                    {demoText.slice(0, Math.min(typedCharsCount, demoText.length))}
                  </span>
                  <span className="inline-block w-2 h-4 bg-cyan-400 ml-0.5 animate-pulse align-middle" />
                  <span className="text-slate-600">
                    {demoText.slice(Math.min(typedCharsCount, demoText.length))}
                  </span>
                </div>

                {/* Animated Interactive Mechanical Keyboard Layout */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-400 mb-2.5 flex items-center justify-between">
                    <span>TACTILE SWITCH MATRIX</span>
                    <span className="text-[10px] text-slate-500">Live Active Key: <strong className="text-cyan-400">{activeKey || 'IDLE'}</strong></span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 items-center">
                    {keyboardRows.map((row, rIdx) => (
                      <div key={rIdx} className="flex gap-1 justify-center w-full">
                        {row.map((k) => {
                          const isActive = activeKey === k || (k === 'SPACE' && activeKey === ' ');
                          return (
                            <button
                              key={k}
                              onClick={() => {
                                sound.playKeyClick(k === 'SPACE');
                                setActiveKey(k);
                              }}
                              className={`transition-all duration-100 font-mono text-xs font-semibold rounded-md border flex items-center justify-center ${
                                k === 'SPACE' ? 'w-24 h-7' : 'w-7 h-7 sm:w-8 sm:h-8'
                              } ${
                                isActive
                                  ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/50 scale-105'
                                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                              }`}
                            >
                              {k === 'SPACE' ? 'SPACE' : k}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enter Button CTA directly from Terminal */}
                <div className="pt-2">
                  <button
                    id="terminal-start-typing-btn"
                    onClick={onEnterApp}
                    className="w-full py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Click to Enter Test Chamber</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Feature Showcase Section: Telling All The Features */}
      <section className="relative z-10 border-t border-slate-800/80 bg-slate-950/60 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">Engineered For Performance</h2>
            <p className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Everything You Need to Track, Train, and Triumph
            </p>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              Explore the comprehensive suite of features built into TYPEFLOW for students, competitive gamers, and professional software engineers.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Precision Telemetry</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Granular tracking of net WPM, raw speed, accuracy percentage, and microsecond keystroke pauses with interactive Recharts velocity graphs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multiplayer WebSocket Races</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Compete against other typists in real-time over low-latency Socket.IO rooms. See opponent cars accelerate down the track live as they type.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Programming Syntax Mode</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Practice typing real JavaScript, Python, TypeScript, and HTML syntax complete with symbols, brackets, and indentation challenges.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Global Leaderboards</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Climb the global ranks. Filter scores by daily runs, weekly tournaments, or all-time speed demons to see where your velocity stands.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Acoustic Mechanical Audio</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Synthesized clicky mechanical key audio feedback crafted via Web Audio API. Feel each tactile actuation with every stroke.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">100 Granular Levels</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Progress through 100 handcrafted levels across Time, Words, Quotes, and Code modes spanning 10 mastery tiers with procedural scaling and speed benchmarks.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Cyber Theme Engine</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Switch instantly between 5 high-contrast themes: Midnight Cyan, Cyber Gold, Matrix Terminal, Sunset Neon, and Arctic Frost.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">MERN Full-Stack Sync</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Built on Express, MongoDB & JWT authentication. All your test histories, progression stats, and custom records are preserved.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Signup / Start Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Description */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>INSTANT ACCOUNT CREATION</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Create Your Typist Identity & Track Your Growth
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              Sign up in seconds to start archiving your typing milestones. Unregistered guests can still practice and race, but creating an account unlocks persistent XP, custom profile avatars, and spots on the verified leaderboard.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>Permanent storage of all typing attempt telemetry & WPM charts</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>Eligibility for top placements in the global Hall of Fame</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>Custom insignias: Bolt, Flame, Sparkles, or Crown</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={onEnterApp}
                className="text-sm font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 underline underline-offset-4"
              >
                <span>Or jump straight into practice without signing up</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Signup Form Card OR Active User Status Card */}
          <div className="lg:col-span-6">
            <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full pointer-events-none" />

              {isAuthenticated && user ? (
                /* Card for already authenticated users */
                <div className="space-y-6 text-center py-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-cyan-500/20">
                    {user.avatar === 'bolt' && <Zap className="w-8 h-8" />}
                    {user.avatar === 'flame' && <Flame className="w-8 h-8" />}
                    {user.avatar === 'sparkles' && <Sparkles className="w-8 h-8" />}
                    {user.avatar === 'crown' && <Crown className="w-8 h-8" />}
                    {!['bolt', 'flame', 'sparkles', 'crown'].includes(user.avatar) && user.username[0]?.toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">Welcome back, {user.username}!</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      You are signed in as <span className="font-mono text-cyan-400">{user.email}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 font-mono text-xs">
                    <div>
                      <span className="text-slate-500 block">BEST SPEED</span>
                      <span className="text-lg font-bold text-cyan-400">{user.stats?.bestWpm || 0} WPM</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">LEVEL / XP</span>
                      <span className="text-lg font-bold text-white">Lv. {user.level || 1} ({user.xp || 0} XP)</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      id="home-authed-practice-btn"
                      onClick={onEnterApp}
                      className="flex-1 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Practice Test</span>
                    </button>
                    <button
                      id="home-authed-multiplayer-btn"
                      onClick={onEnterMultiplayer}
                      className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Users className="w-4 h-4 text-cyan-400" />
                      <span>Join Race Grid</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Card for new users to sign up */
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white">Join TYPEFLOW</h3>
                    <p className="text-xs text-slate-400 mt-1">Quick registration — zero fluff, instant access.</p>
                  </div>

                  {signupSuccess ? (
                    <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                      <h4 className="text-lg font-bold text-white">Account Created!</h4>
                      <p className="text-xs text-slate-300">Entering the typing arena now...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSignup} className="space-y-4">
                      {signupError && (
                        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                          {signupError}
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username</label>
                        <div className="relative">
                          <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                          <input
                            id="home-signup-username"
                            type="text"
                            required
                            value={signupUsername}
                            onChange={(e) => setSignupUsername(e.target.value)}
                            placeholder="e.g. SpeedDemon99"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                          <input
                            id="home-signup-email"
                            type="email"
                            required
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                          <input
                            id="home-signup-password"
                            type="password"
                            required
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            placeholder="Minimum 6 characters"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Choose Avatar Insignia</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { id: 'bolt', icon: Zap, label: 'Bolt' },
                            { id: 'flame', icon: Flame, label: 'Flame' },
                            { id: 'sparkles', icon: Sparkles, label: 'Star' },
                            { id: 'crown', icon: Crown, label: 'Crown' }
                          ].map(item => {
                            const IconComponent = item.icon;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setSelectedAvatar(item.id)}
                                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                                  selectedAvatar === item.id
                                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                                }`}
                              >
                                <IconComponent className="w-5 h-5" />
                                <span className="text-[10px]">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        id="home-signup-submit-btn"
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50 mt-2"
                      >
                        {isSubmitting ? 'Creating Typist Account...' : 'Sign Up & Enter TypeFlow'}
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* How It Works 3-Step Walkthrough */}
      <section className="relative z-10 border-t border-slate-800/80 bg-slate-900/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">Workflow</h2>
            <p className="font-display text-3xl font-bold text-white">How It Works in 3 Simple Steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center relative">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold text-sm flex items-center justify-center mx-auto mb-4 border border-cyan-500/40">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Pick Your Challenge</h3>
              <p className="text-sm text-slate-400">
                Choose between timed sprints (15s, 30s, 60s), exact word counts, or real-world programming code snippets.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center relative">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 font-mono font-bold text-sm flex items-center justify-center mx-auto mb-4 border border-blue-500/40">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Type with Instant Telemetry</h3>
              <p className="text-sm text-slate-400">
                Experience ultra-smooth keystroke rendering with instant error highlight, acoustic switch sounds, and live burst gauges.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center relative">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-sm flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Inspect Analytics & Race</h3>
              <p className="text-sm text-slate-400">
                Review your timeline velocity curves, earn level XP, and take your skills to the live multiplayer race track.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Banner */}
      <section className="relative z-10 border-t border-slate-800/80 py-16 px-4 bg-gradient-to-b from-slate-950 to-slate-900/90 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 mx-auto flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Keyboard className="w-7 h-7 text-slate-950 font-bold" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Push Your Typing to the Limit?
          </h2>

          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Zero installations required. Hop into a practice round right now or join an active multiplayer race room.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              id="cta-enter-app-btn"
              onClick={onEnterApp}
              className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-base transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Enter TYPEFLOW (Start Typing)</span>
            </button>

            <button
              id="cta-leaderboard-btn"
              onClick={onEnterLeaderboard}
              className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-medium text-base border border-slate-700 transition-all flex items-center gap-2"
            >
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>View Leaderboard</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
