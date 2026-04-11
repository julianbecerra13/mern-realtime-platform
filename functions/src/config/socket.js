const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;
const connectedUsers = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    connectedUsers.set(userId, socket.id);
    console.log(`User connected: ${userId}`);

    socket.join(`user:${userId}`);

    socket.on('disconnect', () => {
      connectedUsers.delete(userId);
      console.log(`User disconnected: ${userId}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

const isUserOnline = (userId) => connectedUsers.has(userId);

module.exports = { initSocket, getIO, isUserOnline };
