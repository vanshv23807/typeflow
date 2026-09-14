import { io, Socket } from 'socket.io-client';
import { RaceRoom, ChatMessage } from '../types';

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(window.location.origin, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => {
      console.log('Socket.IO connected:', socketInstance?.id);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
    });
  }
  return socketInstance;
}

export const socketService = {
  createRoom(user: { id?: string; username: string; avatar?: string }, roomName?: string, isPrivate?: boolean) {
    const socket = getSocket();
    socket.emit('create_room', { user, roomName, isPrivate });
  },

  joinRoom(code: string, user: { id?: string; username: string; avatar?: string }) {
    const socket = getSocket();
    socket.emit('join_room', { code, user });
  },

  toggleReady() {
    const socket = getSocket();
    socket.emit('toggle_ready');
  },

  startRace() {
    const socket = getSocket();
    socket.emit('start_race');
  },

  sendProgress(progress: number, wpm: number, accuracy: number) {
    const socket = getSocket();
    socket.emit('typing_progress', { progress, wpm, accuracy });
  },

  sendChat(text: string) {
    const socket = getSocket();
    socket.emit('send_chat', { text });
  },

  requestRematch() {
    const socket = getSocket();
    socket.emit('request_rematch');
  }
};
