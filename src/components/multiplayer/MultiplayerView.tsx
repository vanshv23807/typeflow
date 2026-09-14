import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Users,
  Flag,
  Plus,
  ArrowRight,
  Copy,
  Check,
  Zap,
  Trophy,
  MessageSquare,
  Send,
  Sparkles,
  Crown,
  Flame,
  Clock,
  Play,
  RotateCcw
} from 'lucide-react';
import { RaceRoom, RacerPlayer, ChatMessage } from '../../types';
import { getSocket, socketService } from '../../services/socket';
import { sound } from '../../services/sound';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';

export const MultiplayerView: React.FC = () => {
  const { user, guestUsername } = useAuth();
  const { fontFamily, soundEnabled } = useTheme();

  // Navigation state within multiplayer
  const [currentRoom, setCurrentRoom] = useState<RaceRoom | null>(null);
  const [publicRooms, setPublicRooms] = useState<Array<{ code: string; name: string; playerCount: number; maxPlayers: number; status: string }>>([]);
  const [roomCodeInput, setRoomCodeInput] = useState<string>('');
  const [createRoomName, setCreateRoomName] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active typing state inside race
  const [userInput, setUserInput] = useState<string>('');
  const [countdownNum, setCountdownNum] = useState<number | null>(null);
  const [isRacing, setIsRacing] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Setup Socket listeners
  useEffect(() => {
    const socket = getSocket();

    // Fetch initial public rooms via REST
    api.multiplayer.getRooms().then(res => {
      setPublicRooms(res.rooms);
    }).catch(() => {});

    socket.on('public_rooms_updated', (rooms) => {
      setPublicRooms(rooms);
    });

    socket.on('room_created', (data: { room: RaceRoom }) => {
      setCurrentRoom(data.room);
      setErrorMessage(null);
      resetRaceTyping();
    });

    socket.on('room_state', (data: { room: RaceRoom }) => {
      setCurrentRoom(data.room);
      if (data.room.status === 'waiting') {
        setIsRacing(false);
        setCountdownNum(null);
        setUserInput('');
      }
    });

    socket.on('countdown_start', (data: { countdown: number; room: RaceRoom }) => {
      setCurrentRoom(data.room);
      setCountdownNum(data.countdown);
      sound.playCountdownPip(false);
    });

    socket.on('countdown_tick', (data: { count: number }) => {
      setCountdownNum(data.count);
      sound.playCountdownPip(false);
    });

    socket.on('race_started', (data: { startTime: number; room: RaceRoom }) => {
      setCurrentRoom(data.room);
      setCountdownNum(0); // GO!
      sound.playCountdownPip(true);
      setTimeout(() => setCountdownNum(null), 800);
      setIsRacing(true);
      setUserInput('');
      if (inputRef.current) inputRef.current.focus();
    });

    socket.on('player_progress_update', (data: { playerId: string; progress: number; wpm: number; accuracy: number }) => {
      setCurrentRoom(prev => {
        if (!prev) return null;
        return {
          ...prev,
          players: prev.players.map(p =>
            p.id === data.playerId
              ? { ...p, progress: data.progress, wpm: data.wpm, accuracy: data.accuracy }
              : p
          )
        };
      });
    });

    socket.on('player_finished', (data: { playerId: string; username: string; rank: number; wpm: number; time: number }) => {
      if (data.playerId === socket.id) {
        sound.playSuccess();
        if (data.rank === 1) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#06b6d4', '#eab308', '#10b981']
          });
        }
      }
      setCurrentRoom(prev => {
        if (!prev) return null;
        return {
          ...prev,
          players: prev.players.map(p =>
            p.id === data.playerId
              ? { ...p, isFinished: true, finishRank: data.rank, finishTimeSeconds: data.time }
              : p
          )
        };
      });
    });

    socket.on('race_finished', (data: { room: RaceRoom }) => {
      setCurrentRoom(data.room);
      setIsRacing(false);
    });

    socket.on('chat_message', (msg: ChatMessage) => {
      setCurrentRoom(prev => {
        if (!prev) return null;
        return {
          ...prev,
          chat: [...prev.chat, msg]
        };
      });
    });

    socket.on('error_message', (data: { message: string }) => {
      setErrorMessage(data.message);
      setTimeout(() => setErrorMessage(null), 4000);
    });

    return () => {
      socket.off('public_rooms_updated');
      socket.off('room_created');
      socket.off('room_state');
      socket.off('countdown_start');
      socket.off('countdown_tick');
      socket.off('race_started');
      socket.off('player_progress_update');
      socket.off('player_finished');
      socket.off('race_finished');
      socket.off('chat_message');
      socket.off('error_message');
    };
  }, []);

  // Auto scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentRoom?.chat]);

  const resetRaceTyping = () => {
    setUserInput('');
    setIsRacing(false);
    setCountdownNum(null);
  };

  const getActiveUserPayload = () => {
    if (user) {
      return { id: user.id, username: user.username, avatar: user.avatar };
    }
    return { username: guestUsername, avatar: 'zap' };
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    socketService.createRoom(getActiveUserPayload(), createRoomName || undefined, isPrivate);
    setCreateRoomName('');
  };

  const handleJoinByCode = (codeToJoin?: string) => {
    const code = codeToJoin || roomCodeInput;
    if (!code.trim()) return;
    socketService.joinRoom(code.trim().toUpperCase(), getActiveUserPayload());
    setRoomCodeInput('');
  };

  const handleToggleReady = () => {
    socketService.toggleReady();
  };

  const handleStartRace = () => {
    socketService.startRace();
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    socketService.sendChat(chatInput);
    setChatInput('');
  };

  const handleRematch = () => {
    socketService.requestRematch();
    setUserInput('');
  };

  const handleCopyCode = () => {
    if (currentRoom) {
      navigator.clipboard.writeText(currentRoom.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Typing progress handler inside race
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isRacing || !currentRoom) return;
    const value = e.target.value;
    setUserInput(value);

    // Play click sound
    const charIdx = value.length - 1;
    if (charIdx >= 0) {
      const isSpace = value[charIdx] === ' ';
      sound.playKeyClick(isSpace);
    }

    // Calculate progress percentage and WPM
    const progress = Math.min(100, Math.round((value.length / currentRoom.text.length) * 100));
    
    // Live WPM calculation
    const timeElapsedSec = currentRoom.startTime ? (Date.now() - currentRoom.startTime) / 1000 : 1;
    const minutes = Math.max(0.01, timeElapsedSec / 60);

    let correct = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === currentRoom.text[i]) correct++;
    }

    const liveWpm = Math.round((correct / 5) / minutes) || 0;
    const accuracy = value.length > 0 ? Math.round((correct / value.length) * 100) : 100;

    socketService.sendProgress(progress, liveWpm, accuracy);
  };

  const currentSocketId = getSocket().id;
  const isHost = currentRoom?.players.find(p => p.id === currentSocketId)?.isHost;
  const currentPlayer = currentRoom?.players.find(p => p.id === currentSocketId);

  // ==========================================
  // VIEW: LOBBY BROWSER
  // ==========================================
  if (!currentRoom) {
    return (
      <div className="w-full max-w-5xl mx-auto py-8 px-4 flex flex-col gap-8 animate-in fade-in duration-300">
        {/* Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 relative overflow-hidden">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Real-Time WebSockets
              </span>
              <span className="text-xs text-slate-500">Global Competition</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white font-display tracking-tight">Multiplayer Typing Sprint</h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Compete head-to-head in real-time typing races. Watch your opponent vehicles advance in real time as keystrokes are registered on the server.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Action Grid: Quick Join & Create Room */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Race */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase mb-2">
                <Plus className="w-4 h-4" />
                <span>Host a Race</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Create Race Room</h3>
              <p className="text-xs text-slate-400 mb-4">Set up a custom room and invite peers with a unique 6-character room code.</p>

              <form onSubmit={handleCreateRoom} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Room Name (e.g. Apex Speed Trials)"
                  value={createRoomName}
                  onChange={(e) => setCreateRoomName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />

                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="rounded border-slate-800 text-cyan-500 focus:ring-0"
                  />
                  <span>Private Room (only joinable via invite code)</span>
                </label>

                <button
                  id="create-room-btn"
                  type="submit"
                  className="mt-2 w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Room</span>
                </button>
              </form>
            </div>
          </div>

          {/* Join with Code & Quick Match */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase mb-2">
                <ArrowRight className="w-4 h-4" />
                <span>Join with Code</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Enter Race Code</h3>
              <p className="text-xs text-slate-400 mb-4">Have an invite code from a peer? Paste it below to jump straight to the starting grid.</p>

              <div className="flex items-center gap-2 mb-6">
                <input
                  type="text"
                  placeholder="e.g. FLOW01"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  maxLength={8}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm tracking-widest text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 uppercase"
                />
                <button
                  id="join-code-btn"
                  onClick={() => handleJoinByCode()}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors whitespace-nowrap"
                >
                  Join
                </button>
              </div>

              {/* Quick join public room shortcut */}
              <div className="pt-4 border-t border-slate-800/80">
                <button
                  id="quick-match-btn"
                  onClick={() => handleJoinByCode('FLOW01')}
                  className="w-full py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Quick Match (Global Sprint 01)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Public Rooms List */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Live Public Grids</h3>
              <p className="text-xs text-slate-400">Join an ongoing open sprint</p>
            </div>
            <span className="text-xs font-mono text-slate-500">{publicRooms.length} Active Rooms</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicRooms.map(room => (
              <div
                key={room.code}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="font-semibold text-sm text-white">{room.name}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="font-mono text-cyan-400">[{room.code}]</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-500" />
                      {room.playerCount} / {room.maxPlayers}
                    </span>
                    <span>·</span>
                    <span className={`text-[11px] uppercase font-mono ${room.status === 'racing' ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {room.status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleJoinByCode(room.code)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors"
                >
                  Enter
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: ACTIVE RACE ROOM & TRACK
  // ==========================================
  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Room Header */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">{currentRoom.name}</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-mono font-bold ${
              currentRoom.status === 'racing'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                : currentRoom.status === 'finished'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              {currentRoom.status}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-display">{currentRoom.textTitle}</h2>
        </div>

        {/* Room Code & Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-500">Code:</span>
            <span className="font-mono text-xs font-bold text-cyan-400 tracking-wider">{currentRoom.code}</span>
            <button
              onClick={handleCopyCode}
              className="text-slate-400 hover:text-white transition-colors"
              title="Copy Code"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            onClick={() => setCurrentRoom(null)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
          >
            Leave
          </button>
        </div>
      </div>

      {/* Countdown Overlay (3.. 2.. 1.. GO!) */}
      {countdownNum !== null && (
        <div className="p-8 rounded-3xl bg-cyan-950/40 border border-cyan-500/40 flex flex-col items-center justify-center gap-2 animate-in zoom-in duration-200">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Starting In</span>
          <span className="text-7xl font-extrabold font-mono text-cyan-300 animate-bounce">
            {countdownNum === 0 ? 'GO!' : countdownNum}
          </span>
        </div>
      )}

      {/* Real-time Race Track Visualizer */}
      <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3">
          <span className="font-semibold uppercase tracking-wider text-slate-300">Active Racers Grid</span>
          <span className="font-mono">{currentRoom.players.length} racers in lane</span>
        </div>

        {/* Lanes */}
        <div className="flex flex-col gap-3">
          {currentRoom.players.map((player, idx) => (
            <div key={player.id} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: player.color }}
                  />
                  <span className={`font-medium ${player.id === currentSocketId ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}>
                    {player.username} {player.id === currentSocketId && '(You)'}
                  </span>
                  {player.isHost && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono">HOST</span>
                  )}
                  {player.finishRank && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold font-mono">
                      #{player.finishRank} Place ({player.finishTimeSeconds}s)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-slate-400">{player.wpm} WPM</span>
                  <span className="text-slate-500">{player.progress}%</span>
                </div>
              </div>

              {/* Progress Track Lane */}
              <div className="w-full h-8 bg-slate-950 rounded-xl p-1 border border-slate-800/80 relative overflow-hidden flex items-center">
                {/* Checkered finish flag */}
                <div className="absolute right-2 text-slate-600">
                  <Flag className="w-4 h-4" />
                </div>

                {/* Racer Vehicle Marker */}
                <div
                  className="h-full rounded-lg transition-all duration-200 flex items-center justify-end px-2"
                  style={{
                    width: `${Math.max(8, player.progress)}%`,
                    backgroundColor: player.color,
                    boxShadow: `0 0 12px ${player.color}66`
                  }}
                >
                  <span className="text-xs font-bold text-slate-950 font-mono select-none">
                    🏎️
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typing Field (active when status === 'racing') */}
      {currentRoom.status === 'racing' && (
        <div className="p-8 rounded-3xl bg-slate-950 border border-cyan-500/40 shadow-2xl flex flex-col gap-4">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleTyping}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className="absolute opacity-0 pointer-events-none"
            aria-label="Race typing input"
          />

          <div
            onClick={() => inputRef.current?.focus()}
            className={`text-xl leading-relaxed select-none cursor-text ${
              fontFamily === 'mono' ? 'font-mono-code' : 'font-sans'
            }`}
          >
            {currentRoom.text.split('').map((char, index) => {
              const isTyped = index < userInput.length;
              const isCurrent = index === userInput.length;
              const isCorrect = isTyped && userInput[index] === char;
              const isIncorrect = isTyped && userInput[index] !== char;

              let color = 'text-slate-500';
              if (isCorrect) color = 'text-cyan-300 font-medium';
              if (isIncorrect) color = 'text-rose-400 bg-rose-500/20';

              return (
                <span key={index} className={`relative inline-block ${color}`}>
                  {isCurrent && (
                    <span className="absolute -left-[1px] top-1 w-[2.5px] h-[80%] bg-cyan-400 animate-caret shadow-[0_0_8px_#06b6d4]" />
                  )}
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
            <span>Keep typing to drive your car forward!</span>
            <span className="font-mono text-cyan-400">{userInput.length} / {currentRoom.text.length} chars</span>
          </div>
        </div>
      )}

      {/* Pre-Race Waiting Room Controls (Ready / Start) */}
      {currentRoom.status === 'waiting' && (
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleReady}
              className={`px-6 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                currentPlayer?.isReady
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {currentPlayer?.isReady ? '✓ You Are Ready' : 'Click to Ready Up'}
            </button>

            <span className="text-xs text-slate-400">
              {currentRoom.players.filter(p => p.isReady).length} / {currentRoom.players.length} ready
            </span>
          </div>

          {isHost && (
            <button
              id="start-race-btn"
              onClick={handleStartRace}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-transform hover:scale-105 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Race Countdown</span>
            </button>
          )}
        </div>
      )}

      {/* Post-Race Podium & Results */}
      {currentRoom.status === 'finished' && (
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-purple-500/40 flex flex-col items-center gap-6 animate-in zoom-in duration-300">
          <div className="flex items-center gap-2 text-amber-400">
            <Trophy className="w-8 h-8" />
            <h3 className="text-2xl font-extrabold font-display text-white">Race Concluded!</h3>
          </div>

          {/* Podium Table */}
          <div className="w-full max-w-lg divide-y divide-slate-800 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
            {currentRoom.players
              .filter(p => p.isFinished)
              .sort((a, b) => (a.finishRank || 99) - (b.finishRank || 99))
              .map(player => (
                <div key={player.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      player.finishRank === 1 ? 'bg-amber-400 text-slate-950' :
                      player.finishRank === 2 ? 'bg-slate-300 text-slate-950' :
                      player.finishRank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {player.finishRank}
                    </span>
                    <span className="font-semibold text-sm text-white">{player.username}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-cyan-400">{player.wpm} WPM</span>
                    <span className="text-slate-400">{player.finishTimeSeconds}s</span>
                  </div>
                </div>
              ))}
          </div>

          <button
            onClick={handleRematch}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Rematch / Play Again</span>
          </button>
        </div>
      )}

      {/* In-Room Real-Time Chat Drawer */}
      <div className="p-4 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
          <span>Race Room Chat</span>
        </div>

        <div className="h-32 overflow-y-auto flex flex-col gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs">
          {currentRoom.chat.map((msg) => (
            <div key={msg.id} className="flex items-baseline gap-2">
              <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
              <span className={`font-semibold ${msg.sender === 'System' ? 'text-amber-400' : 'text-cyan-400'}`}>
                {msg.sender}:
              </span>
              <span className="text-slate-300">{msg.text}</span>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        <form onSubmit={handleSendChat} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message to racers..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
