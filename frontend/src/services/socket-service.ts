import { io, Socket } from 'socket.io-client';
import type { Card } from '../types';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket) return;

    const url = import.meta.env.DEV ? 'http://localhost:3001' : import.meta.env.VITE_API_URL;
    this.socket = io(url, {
      withCredentials: true
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinSession(sessionId: string, username: string) {
    if (!this.socket) return;
    this.socket.emit('join-session', sessionId, username);
  }

  leaveSession(sessionId: string) {
    if (!this.socket) return;
    this.socket.emit('leave-session', sessionId);
  }

  // Card events
  emitCardCreated(sessionId: string, card: Card) {
    if (!this.socket) return;
    this.socket.emit('card-created', { sessionId, card });
  }

  emitCardUpdated(sessionId: string, card: Card) {
    if (!this.socket) return;
    this.socket.emit('card-updated', { sessionId, card });
  }

  emitCardDeleted(sessionId: string, cardId: number) {
    if (!this.socket) return;
    this.socket.emit('card-deleted', { sessionId, cardId });
  }

  // Listeners
  onCardCreated(callback: (card: Card) => void) {
    if (!this.socket) return;
    this.socket.on('card-created', callback);
  }

  onCardUpdated(callback: (card: Card) => void) {
    if (!this.socket) return;
    this.socket.on('card-updated', callback);
  }

  onCardDeleted(callback: (data: { cardId: number }) => void) {
    if (!this.socket) return;
    this.socket.on('card-deleted', callback);
  }

  onUserJoined(callback: (data: { username: string }) => void) {
    if (!this.socket) return;
    this.socket.on('user-joined', callback);
  }

  onUserLeft(callback: (data: { username: string }) => void) {
    if (!this.socket) return;
    this.socket.on('user-left', callback);
  }

  // Cleanup
  offCardCreated() {
    if (!this.socket) return;
    this.socket.off('card-created');
  }

  offCardUpdated() {
    if (!this.socket) return;
    this.socket.off('card-updated');
  }

  offCardDeleted() {
    if (!this.socket) return;
    this.socket.off('card-deleted');
  }

  offUserJoined() {
    if (!this.socket) return;
    this.socket.off('user-joined');
  }

  offUserLeft() {
    if (!this.socket) return;
    this.socket.off('user-left');
  }
}

export const socketService = new SocketService();
