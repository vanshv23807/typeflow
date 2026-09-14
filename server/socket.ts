import { Server as SocketIOServer, Socket } from 'socket.io';
import { db, TextSnippet } from './db';

export interface RacerPlayer {
  id: string; // socket.id
  userId?: string;
  username: string;
  avatar: string;
  color: string;
  isHost: boolean;
  isReady: boolean;
  progress: number; // 0 to 100
  wpm: number;
  accuracy: number;
  isFinished: boolean;
  finishRank?: number;
  finishTimeSeconds?: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface RaceRoom {
  code: string;
  name: string;
  status: 'waiting' | 'countdown' | 'racing' | 'finished';
  text: string;
  textTitle: string;
  players: RacerPlayer[];
  countdown: number;
  startTime?: number;
  endTime?: number;
  maxPlayers: number;
  isPrivate: boolean;
  chat: ChatMessage[];
}

const RACER_COLORS = [
  '#06b6d4', // electric cyan
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444'  // rose
];

export class RaceManager {
  private io: SocketIOServer;
  private rooms: Map<string, RaceRoom> = new Map();
  private countdownTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupEvents();
    this.createPublicSeedRoom();
  }

  private createPublicSeedRoom() {
    const defaultText = db.getTexts()[0];
    const publicRoom: RaceRoom = {
      code: 'FLOW01',
      name: 'Global Sprint 01',
      status: 'waiting',
      text: defaultText.content,
      textTitle: defaultText.title,
      players: [],
      countdown: 5,
      maxPlayers: 6,
      isPrivate: false,
      chat: [
        {
          id: 'welcome',
          sender: 'System',
          avatar: 'cpu',
          text: 'Welcome to Global Sprint! Ready up to begin the countdown.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    this.rooms.set('FLOW01', publicRoom);
  }

  private getRandomTextSnippet(): { text: string; title: string } {
    const snippets = db.getTexts();
    const s = snippets[Math.floor(Math.random() * snippets.length)] || snippets[0];
    return { text: s.content, title: s.title };
  }

  public getPublicRooms(): Array<{
    code: string;
    name: string;
    playerCount: number;
    maxPlayers: number;
    status: string;
  }> {
    const list: Array<{ code: string; name: string; playerCount: number; maxPlayers: number; status: string }> = [];
    for (const room of this.rooms.values()) {
      if (!room.isPrivate) {
        list.push({
          code: room.code,
          name: room.name,
          playerCount: room.players.length,
          maxPlayers: room.maxPlayers,
          status: room.status
        });
      }
    }
    return list;
  }

  private setupEvents() {
    this.io.on('connection', (socket: Socket) => {
      let currentRoomCode: string | null = null;

      // Create new room
      socket.on('create_room', (data: { roomName?: string; isPrivate?: boolean; user?: { id?: string; username: string; avatar?: string } }) => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const snippet = this.getRandomTextSnippet();
        const hostUser = data.user || { username: `Typer_${socket.id.substring(0, 4)}`, avatar: 'bolt' };

        const hostPlayer: RacerPlayer = {
          id: socket.id,
          userId: hostUser.id,
          username: hostUser.username,
          avatar: hostUser.avatar || 'bolt',
          color: RACER_COLORS[0],
          isHost: true,
          isReady: false,
          progress: 0,
          wpm: 0,
          accuracy: 100,
          isFinished: false
        };

        const newRoom: RaceRoom = {
          code,
          name: data.roomName || `${hostPlayer.username}'s Race`,
          status: 'waiting',
          text: snippet.text,
          textTitle: snippet.title,
          players: [hostPlayer],
          countdown: 5,
          maxPlayers: 6,
          isPrivate: !!data.isPrivate,
          chat: [
            {
              id: `sys_${Date.now()}`,
              sender: 'System',
              avatar: 'cpu',
              text: `Room created by ${hostPlayer.username}. Share code [${code}] with friends!`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };

        this.rooms.set(code, newRoom);
        currentRoomCode = code;
        socket.join(code);

        socket.emit('room_created', { room: newRoom });
        this.io.emit('public_rooms_updated', this.getPublicRooms());
      });

      // Join room
      socket.on('join_room', (data: { code: string; user?: { id?: string; username: string; avatar?: string } }) => {
        const code = data.code?.trim().toUpperCase();
        const room = this.rooms.get(code);

        if (!room) {
          socket.emit('error_message', { message: `Room ${code} was not found.` });
          return;
        }

        if (room.players.length >= room.maxPlayers) {
          socket.emit('error_message', { message: 'This race room is full.' });
          return;
        }

        const joinUser = data.user || { username: `Typer_${socket.id.substring(0, 4)}`, avatar: 'zap' };
        const colorIdx = room.players.length % RACER_COLORS.length;

        // Check if player already exists
        const existingIdx = room.players.findIndex(p => p.id === socket.id);
        if (existingIdx === -1) {
          const player: RacerPlayer = {
            id: socket.id,
            userId: joinUser.id,
            username: joinUser.username,
            avatar: joinUser.avatar || 'zap',
            color: RACER_COLORS[colorIdx],
            isHost: room.players.length === 0,
            isReady: false,
            progress: 0,
            wpm: 0,
            accuracy: 100,
            isFinished: false
          };
          room.players.push(player);

          room.chat.push({
            id: `chat_${Date.now()}`,
            sender: 'System',
            avatar: 'cpu',
            text: `${player.username} joined the grid.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }

        currentRoomCode = code;
        socket.join(code);

        this.io.to(code).emit('room_state', { room });
        this.io.emit('public_rooms_updated', this.getPublicRooms());
      });

      // Player Ready toggle
      socket.on('toggle_ready', () => {
        if (!currentRoomCode) return;
        const room = this.rooms.get(currentRoomCode);
        if (!room || room.status !== 'waiting') return;

        const player = room.players.find(p => p.id === socket.id);
        if (player) {
          player.isReady = !player.isReady;
          this.io.to(currentRoomCode).emit('room_state', { room });
        }
      });

      // Start Countdown
      socket.on('start_race', () => {
        if (!currentRoomCode) return;
        const room = this.rooms.get(currentRoomCode);
        if (!room || room.status !== 'waiting') return;

        const player = room.players.find(p => p.id === socket.id);
        if (!player || !player.isHost) {
          socket.emit('error_message', { message: 'Only the host can start the race.' });
          return;
        }

        if (room.players.length < 1) {
          socket.emit('error_message', { message: 'Need at least 1 racer to start.' });
          return;
        }

        // Set status to countdown
        room.status = 'countdown';
        room.countdown = 3;

        // Reset player progress
        for (const p of room.players) {
          p.progress = 0;
          p.wpm = 0;
          p.accuracy = 100;
          p.isFinished = false;
          p.finishRank = undefined;
          p.finishTimeSeconds = undefined;
        }

        this.io.to(currentRoomCode).emit('countdown_start', { countdown: room.countdown, room });

        let currentCount = 3;
        const timer = setInterval(() => {
          currentCount -= 1;
          room.countdown = currentCount;

          if (currentCount > 0) {
            this.io.to(room.code).emit('countdown_tick', { count: currentCount });
          } else {
            clearInterval(timer);
            this.countdownTimers.delete(room.code);
            room.status = 'racing';
            room.startTime = Date.now();
            this.io.to(room.code).emit('race_started', { startTime: room.startTime, room });
            this.io.emit('public_rooms_updated', this.getPublicRooms());
          }
        }, 1000);

        this.countdownTimers.set(room.code, timer);
      });

      // Typing progress
      socket.on('typing_progress', (data: { progress: number; wpm: number; accuracy: number }) => {
        if (!currentRoomCode) return;
        const room = this.rooms.get(currentRoomCode);
        if (!room || room.status !== 'racing') return;

        const player = room.players.find(p => p.id === socket.id);
        if (!player || player.isFinished) return;

        player.progress = Math.min(100, Math.max(0, data.progress));
        player.wpm = Math.max(0, Math.round(data.wpm));
        player.accuracy = Math.min(100, Math.max(0, Math.round(data.accuracy)));

        // Broadcast progress update
        this.io.to(currentRoomCode).emit('player_progress_update', {
          playerId: player.id,
          progress: player.progress,
          wpm: player.wpm,
          accuracy: player.accuracy
        });

        // Check for finish
        if (player.progress >= 100 && !player.isFinished) {
          player.isFinished = true;
          const finishedCount = room.players.filter(p => p.isFinished).length;
          player.finishRank = finishedCount;
          const timeElapsed = room.startTime ? (Date.now() - room.startTime) / 1000 : 0;
          player.finishTimeSeconds = Math.round(timeElapsed * 10) / 10;

          // Award win to user if registered
          if (player.finishRank === 1 && player.userId) {
            const user = db.findUserById(player.userId);
            if (user) {
              const won = (user.stats.racesWon || 0) + 1;
              const badges = new Set(user.badges || []);
              if (won >= 1) badges.add('first_victory');
              if (won >= 10) badges.add('race_champion');
              db.updateUser(player.userId, {
                stats: { ...user.stats, racesWon: won },
                badges: Array.from(badges),
                xp: (user.xp || 0) + 50
              });
            }
          }

          this.io.to(currentRoomCode).emit('player_finished', {
            playerId: player.id,
            username: player.username,
            rank: player.finishRank,
            wpm: player.wpm,
            accuracy: player.accuracy,
            time: player.finishTimeSeconds
          });

          // If all finished
          const allDone = room.players.every(p => p.isFinished);
          if (allDone) {
            room.status = 'finished';
            room.endTime = Date.now();
            this.io.to(currentRoomCode).emit('race_finished', { room });
            this.io.emit('public_rooms_updated', this.getPublicRooms());
          }
        }
      });

      // Chat message
      socket.on('send_chat', (data: { text: string }) => {
        if (!currentRoomCode || !data.text?.trim()) return;
        const room = this.rooms.get(currentRoomCode);
        if (!room) return;

        const player = room.players.find(p => p.id === socket.id);
        if (!player) return;

        const msg: ChatMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          sender: player.username,
          avatar: player.avatar,
          text: data.text.trim().slice(0, 150),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        room.chat.push(msg);
        if (room.chat.length > 50) room.chat.shift();

        this.io.to(currentRoomCode).emit('chat_message', msg);
      });

      // Request Rematch / Play Again
      socket.on('request_rematch', () => {
        if (!currentRoomCode) return;
        const room = this.rooms.get(currentRoomCode);
        if (!room) return;

        const snippet = this.getRandomTextSnippet();
        room.status = 'waiting';
        room.text = snippet.text;
        room.textTitle = snippet.title;
        room.startTime = undefined;
        room.endTime = undefined;

        for (const p of room.players) {
          p.isReady = false;
          p.isFinished = false;
          p.progress = 0;
          p.wpm = 0;
          p.accuracy = 100;
          p.finishRank = undefined;
          p.finishTimeSeconds = undefined;
        }

        room.chat.push({
          id: `rematch_${Date.now()}`,
          sender: 'System',
          avatar: 'cpu',
          text: 'Rematch initiated! New text ready. Lock in when ready.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        this.io.to(currentRoomCode).emit('room_state', { room });
        this.io.emit('public_rooms_updated', this.getPublicRooms());
      });

      // Disconnect
      socket.on('disconnect', () => {
        if (currentRoomCode) {
          const room = this.rooms.get(currentRoomCode);
          if (room) {
            const idx = room.players.findIndex(p => p.id === socket.id);
            if (idx !== -1) {
              const leavingPlayer = room.players[idx];
              room.players.splice(idx, 1);

              room.chat.push({
                id: `disc_${Date.now()}`,
                sender: 'System',
                avatar: 'cpu',
                text: `${leavingPlayer.username} left the race.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              });

              // Assign new host if host left
              if (leavingPlayer.isHost && room.players.length > 0) {
                room.players[0].isHost = true;
              }

              // If empty and not default seed room, delete
              if (room.players.length === 0 && room.code !== 'FLOW01') {
                if (this.countdownTimers.has(room.code)) {
                  clearInterval(this.countdownTimers.get(room.code)!);
                  this.countdownTimers.delete(room.code);
                }
                this.rooms.delete(room.code);
              } else {
                this.io.to(room.code).emit('room_state', { room });
              }

              this.io.emit('public_rooms_updated', this.getPublicRooms());
            }
          }
        }
      });
    });
  }
}
