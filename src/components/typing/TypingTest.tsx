import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Clock,
  Type,
  Quote,
  Code,
  RotateCcw,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Target
} from 'lucide-react';
import { TestConfig, TestMode, TypingTestResult, TimelinePoint } from '../../types';
import { api } from '../../services/api';
import { sound } from '../../services/sound';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LevelSelector } from './LevelSelector';
import {
  getLevelSnippet,
  saveCompletedLevel,
  saveLevelAttempt,
  getTierForLevel,
  getBenchmarkWpm
} from '../../services/levelEngine';

interface TypingTestProps {
  onTestComplete: (result: TypingTestResult) => void;
  initialLevel?: number;
  onLevelChange?: (level: number) => void;
}

export const TypingTest: React.FC<TypingTestProps> = ({
  onTestComplete,
  initialLevel = 1,
  onLevelChange
}) => {
  const { user, updateUserStatsLocally } = useAuth();
  const { caretStyle, fontFamily, soundEnabled, liveHud } = useTheme();

  // Test configuration
  const [config, setConfig] = useState<TestConfig>({
    mode: 'time',
    modeValue: 30,
    level: initialLevel,
    punctuation: false,
    numbers: false,
    category: 'standard'
  });

  // Text state
  const [text, setText] = useState<string>('Loading typing corpus...');
  const [textTitle, setTextTitle] = useState<string>('Standard Corpus');
  const [isLoadingText, setIsLoadingText] = useState<boolean>(true);

  // Sync if initialLevel prop changes
  useEffect(() => {
    if (initialLevel && initialLevel !== config.level) {
      setConfig(c => ({ ...c, level: initialLevel }));
    }
  }, [initialLevel]);

  // Active typing state
  const [userInput, setUserInput] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(30);

  // Live metrics
  const [liveWpm, setLiveWpm] = useState<number>(0);
  const [liveRawWpm, setLiveRawWpm] = useState<number>(0);
  const [liveAccuracy, setLiveAccuracy] = useState<number>(100);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [totalKeypresses, setTotalKeypresses] = useState<number>(0);

  // Second-by-second timeline tracking
  const timelineRef = useRef<TimelinePoint[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);

  // Fetch text from backend API or level engine
  const fetchNewText = useCallback(async (currentConfig: TestConfig) => {
    setIsLoadingText(true);
    const lvl = currentConfig.level || 1;
    try {
      let count = currentConfig.mode === 'words' ? currentConfig.modeValue : 60;
      if (currentConfig.mode === 'time') {
        count = currentConfig.modeValue === 15 ? 40 : currentConfig.modeValue === 30 ? 70 : 130;
      }

      const res = await api.texts.getRandomText({
        mode: currentConfig.mode,
        count,
        level: lvl,
        category: currentConfig.category,
        punctuation: currentConfig.punctuation,
        numbers: currentConfig.numbers
      });

      if (res && res.content) {
        setText(res.content);
        setTextTitle(res.title || `Level ${lvl} ${currentConfig.mode.toUpperCase()}`);
      } else {
        throw new Error('Empty text payload');
      }
    } catch (err) {
      // High-fidelity fallback to level engine with full 100 level definitions
      const snippet = getLevelSnippet(currentConfig.mode, lvl, {
        durationSeconds: currentConfig.modeValue,
        wordCount: currentConfig.modeValue
      });
      setText(snippet.content);
      setTextTitle(snippet.title);
    } finally {
      setIsLoadingText(false);
      resetTestState();
    }
  }, []);

  useEffect(() => {
    fetchNewText(config);
  }, [config.mode, config.modeValue, config.level, config.punctuation, config.numbers, config.category]);

  const resetTestState = () => {
    setUserInput('');
    setStatus('idle');
    setStartTime(null);
    setElapsedSeconds(0);
    setRemainingTime(config.mode === 'time' ? config.modeValue : 0);
    setLiveWpm(0);
    setLiveRawWpm(0);
    setLiveAccuracy(100);
    setErrorCount(0);
    setTotalKeypresses(0);
    timelineRef.current = [];
    if (timerRef.current) clearInterval(timerRef.current);
    if (inputRef.current) inputRef.current.focus();
  };

  // Start test on first keypress
  const startTest = () => {
    const now = Date.now();
    setStatus('running');
    setStartTime(now);
    timelineRef.current = [];

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => {
        const next = prev + 1;
        return next;
      });
    }, 1000);
  };

  // Update timer & sample timeline
  useEffect(() => {
    if (status !== 'running') return;

    if (config.mode === 'time') {
      const remaining = config.modeValue - elapsedSeconds;
      setRemainingTime(Math.max(0, remaining));

      if (remaining <= 0) {
        completeTest();
        return;
      }
    }

    // Record timeline sample every second
    if (elapsedSeconds > 0) {
      timelineRef.current.push({
        second: elapsedSeconds,
        wpm: liveWpm,
        rawWpm: liveRawWpm,
        errors: errorCount
      });
    }
  }, [elapsedSeconds, status]);

  // Complete test
  const completeTest = useCallback(async () => {
    if (status === 'completed') return;
    setStatus('completed');
    if (timerRef.current) clearInterval(timerRef.current);

    sound.playSuccess();

    // Final calculations
    const finalDuration = config.mode === 'time' ? config.modeValue : Math.max(1, elapsedSeconds);
    const minutes = finalDuration / 60;

    let correct = 0;
    let incorrect = 0;

    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === text[i]) {
        correct++;
      } else {
        incorrect++;
      }
    }

    const grossWpm = Math.round((totalKeypresses / 5) / minutes) || 0;
    const netWpm = Math.max(0, Math.round(((correct - incorrect) / 5) / minutes)) || 0;
    const finalAcc = totalKeypresses > 0 ? Math.round((correct / totalKeypresses) * 1000) / 10 : 100;

    const resultDoc: TypingTestResult = {
      username: user ? user.username : 'Guest Typer',
      userId: user?.id,
      wpm: netWpm,
      netWpm,
      rawWpm: grossWpm,
      accuracy: finalAcc,
      durationSeconds: finalDuration,
      mode: config.mode,
      modeValue: config.modeValue,
      level: config.level || 1,
      correctChars: correct,
      incorrectChars: incorrect,
      missedChars: Math.max(0, text.length - userInput.length),
      extraChars: Math.max(0, userInput.length - text.length),
      timeline: [...timelineRef.current],
      textTitle,
      createdAt: new Date().toISOString()
    };

    // Save completed level to progress tracker & update stats
    const isPassed = finalAcc >= 88 && (config.mode === 'code' ? correct > 10 : netWpm >= 15);
    saveLevelAttempt(config.mode, config.level || 1, finalAcc, netWpm, isPassed);

    // Save to backend database
    try {
      const response = await api.tests.recordTest(resultDoc);
      if (response.user) {
        updateUserStatsLocally(response.user);
      }
      if (response.test?.id) {
        resultDoc.id = response.test.id;
      }
    } catch (e) {
      console.warn('Recorded test locally:', e);
    }

    onTestComplete(resultDoc);
  }, [status, userInput, text, totalKeypresses, elapsedSeconds, config, textTitle, user, onTestComplete, updateUserStatsLocally]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (status === 'completed') return;

    if (status === 'idle' && value.length > 0) {
      startTest();
    }

    // Play click or error sound
    const charIndex = value.length - 1;
    if (charIndex >= 0) {
      const typedChar = value[charIndex];
      const expectedChar = text[charIndex];

      if (typedChar === expectedChar) {
        sound.playKeyClick(typedChar === ' ');
      } else {
        sound.playError();
        setErrorCount(prev => prev + 1);
      }
    }

    setTotalKeypresses(prev => prev + 1);
    setUserInput(value);

    // Live Metrics calculation
    const timeInMinutes = Math.max(1, elapsedSeconds) / 60;
    let correct = 0;
    let errors = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === text[i]) {
        correct++;
      } else {
        errors++;
      }
    }

    const calculatedRawWpm = Math.round((value.length / 5) / timeInMinutes);
    const calculatedNetWpm = Math.max(0, Math.round(((correct - errors) / 5) / timeInMinutes));
    const calculatedAcc = value.length > 0 ? Math.round((correct / value.length) * 100) : 100;

    setLiveWpm(calculatedNetWpm);
    setLiveRawWpm(calculatedRawWpm);
    setLiveAccuracy(calculatedAcc);

    // If reached end of text in words/quote/code mode
    if (value.length >= text.length) {
      completeTest();
    }
  };

  // Keep input focused when clicking the container
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Keyboard shortcut listener (Tab + Enter to restart, Esc to blur)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        resetTestState();
        fetchNewText(config);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config, fetchNewText]);

  // Auto-scroll active word into view if container is tall
  useEffect(() => {
    if (activeCharRef.current && wordsContainerRef.current) {
      const container = wordsContainerRef.current;
      const charEl = activeCharRef.current;
      const charTop = charEl.offsetTop;
      const containerScroll = container.scrollTop;

      if (charTop - containerScroll > 180) {
        container.scrollTo({ top: charTop - 60, behavior: 'smooth' });
      } else if (charTop < containerScroll) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [userInput.length]);

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 flex flex-col gap-6">
      {/* Test Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
          <button
            id="mode-time-btn"
            onClick={() => setConfig(c => ({ ...c, mode: 'time', modeValue: 30 }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              config.mode === 'time'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Time</span>
          </button>

          <button
            id="mode-words-btn"
            onClick={() => setConfig(c => ({ ...c, mode: 'words', modeValue: 25 }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              config.mode === 'words'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Words</span>
          </button>

          <button
            id="mode-quote-btn"
            onClick={() => setConfig(c => ({ ...c, mode: 'quote' }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              config.mode === 'quote'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
            <span>Quote</span>
          </button>

          <button
            id="mode-code-btn"
            onClick={() => setConfig(c => ({ ...c, mode: 'code' }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              config.mode === 'code'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
        </div>

        {/* Mode Value Sub-pills (e.g. 15, 30, 60, 120s or 10, 25, 50, 100 words) */}
        {config.mode === 'time' && (
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            {[15, 30, 60, 120].map(val => (
              <button
                key={val}
                onClick={() => setConfig(c => ({ ...c, modeValue: val }))}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  config.modeValue === val
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {val}s
              </button>
            ))}
          </div>
        )}

        {config.mode === 'words' && (
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            {[10, 25, 50, 100].map(val => (
              <button
                key={val}
                onClick={() => setConfig(c => ({ ...c, modeValue: val }))}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  config.modeValue === val
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        )}

        {/* Toggles: Punctuation & Numbers */}
        {(config.mode === 'time' || config.mode === 'words') && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setConfig(c => ({ ...c, punctuation: !c.punctuation }))}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                config.punctuation
                  ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300'
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              @ punctuation
            </button>
            <button
              onClick={() => setConfig(c => ({ ...c, numbers: !c.numbers }))}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                config.numbers
                  ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300'
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              # numbers
            </button>
          </div>
        )}

        {/* Quick Restart button */}
        <button
          id="restart-test-btn"
          onClick={() => {
            resetTestState();
            fetchNewText(config);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 bg-slate-950/40 text-xs font-medium transition-colors"
          title="Restart Test (Tab)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Restart</span>
          <kbd className="text-[10px] text-slate-500 font-mono bg-slate-800 px-1 py-0.5 rounded">Tab</kbd>
        </button>
      </div>

      {/* Level Selection Section (Levels 1 to 100 for all modes: Time, Words, Quote, Code) */}
      <LevelSelector
        currentLevel={config.level || 1}
        mode={config.mode}
        onSelectLevel={(lvl) => {
          setConfig(c => ({ ...c, level: lvl }));
          if (onLevelChange) onLevelChange(lvl);
        }}
        disabled={status === 'running'}
      />

      {/* Live HUD (Real-time WPM, Accuracy, Timer) */}
      {liveHud && (
        <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-slate-900/30 border border-slate-800/60">
          <div className="flex items-center gap-6 sm:gap-8">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Live Speed</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold font-mono text-cyan-400">{liveWpm}</span>
                <span className="text-xs font-mono text-slate-500">WPM</span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-800" />

            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Accuracy</div>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-bold font-mono ${liveAccuracy >= 95 ? 'text-emerald-400' : liveAccuracy >= 85 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {liveAccuracy}%
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block" />

            <div className="hidden sm:block">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Raw Speed</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-slate-400">{liveRawWpm}</span>
                <span className="text-xs font-mono text-slate-500">WPM</span>
              </div>
            </div>
          </div>

          {/* Level & Time/Progress remaining badges */}
          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
              <span className="text-slate-500">Lv {config.level || 1}:</span>
              <span className="text-cyan-400 font-semibold">{getTierForLevel(config.level || 1).name.split(' ')[0]}</span>
            </div>

            {config.mode === 'time' ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="font-mono text-2xl font-bold text-white tracking-widest">{remainingTime}s</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <Type className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-xl font-bold text-white">
                  {userInput.trim().split(/\s+/).filter(Boolean).length} / {config.modeValue || text.split(/\s+/).length}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Interactive Typing Container */}
      <div
        id="typing-arena"
        onClick={handleContainerClick}
        className={`relative p-8 rounded-3xl border transition-all duration-300 cursor-text min-h-[220px] flex flex-col justify-center ${
          status === 'running'
            ? 'border-cyan-500/40 bg-slate-950/80 shadow-2xl shadow-cyan-950/20'
            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
        }`}
      >
        {/* Hidden accessible input */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className="absolute opacity-0 pointer-events-none w-0 h-0"
          id="typeflow-hidden-input"
          aria-label="Typeflow hidden text input"
        />

        {/* Text Title & Mode indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-2 border-b border-slate-800/50">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-400">{textTitle}</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{config.mode}</span>
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            {status === 'idle' ? 'Click or start typing to begin' : `${userInput.length} / ${text.length} chars`}
          </div>
        </div>

        {/* Rendered Text with characters & cursor */}
        <div
          ref={wordsContainerRef}
          className={`text-2xl leading-relaxed select-none max-h-56 overflow-y-auto ${
            fontFamily === 'mono' ? 'font-mono-code' : 'font-sans'
          }`}
          style={{ letterSpacing: '0.04em' }}
        >
          {isLoadingText ? (
            <div className="flex items-center gap-3 text-slate-500 animate-pulse py-8">
              <Zap className="w-5 h-5 text-cyan-400 animate-bounce" />
              <span>Generating fresh flow text...</span>
            </div>
          ) : (
            text.split('').map((char, index) => {
              const isTyped = index < userInput.length;
              const isCurrent = index === userInput.length;
              const isCorrect = isTyped && userInput[index] === char;
              const isIncorrect = isTyped && userInput[index] !== char;

              let charColorClass = 'text-slate-500/60';
              if (isCorrect) {
                charColorClass = 'text-cyan-300 font-medium';
              } else if (isIncorrect) {
                charColorClass = 'text-rose-400 bg-rose-500/20 rounded-sm font-semibold';
              }

              return (
                <span
                  key={index}
                  ref={isCurrent ? activeCharRef : null}
                  className={`relative inline-block transition-colors duration-75 ${charColorClass}`}
                >
                  {/* Caret rendering */}
                  {isCurrent && status !== 'completed' && (
                    <span
                      className={`absolute pointer-events-none ${
                        caretStyle === 'line'
                          ? '-left-[1px] top-1 w-[2.5px] h-[80%] bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-caret'
                          : caretStyle === 'block'
                          ? 'inset-0 bg-cyan-400/30 border-b-2 border-cyan-400 animate-caret'
                          : 'bottom-0 left-0 right-0 h-[2.5px] bg-cyan-400 animate-caret'
                      }`}
                    />
                  )}
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })
          )}
        </div>

        {/* Idle prompt tooltip */}
        {status === 'idle' && (
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Ready. Start typing anytime to begin the timer.</span>
          </div>
        )}
      </div>

      {/* Footer tips */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-2">
        <div className="flex items-center gap-4">
          <span><kbd className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono text-[10px]">Tab</kbd> restart</span>
          <span><kbd className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono text-[10px]">Esc</kbd> reset focus</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Mechanical audio synthesizer active</span>
        </div>
      </div>
    </div>
  );
};
