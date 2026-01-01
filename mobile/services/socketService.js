import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config';

let socket = null;

export const initializeSocket = async () => {
  if (socket) {
    return socket;
  }

  try {
    socket = io(API_BASE_URL, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return socket;
  } catch (error) {
    console.error('Failed to initialize socket:', error);
    return null;
  }
};

export const on = (event, callback) => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initializeSocket() first.');
  }
  socket.on(event, callback);
};

export const off = (event, callback) => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initializeSocket() first.');
  }
  socket.off(event, callback);
};

export const getSocket = () => socket;

export default {
  initializeSocket,
  on,
  off,
  getSocket,
};