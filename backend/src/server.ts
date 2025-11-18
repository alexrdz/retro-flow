import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import {
  addUserToSession,
  removeUserFromSession,
  getPresenceState,
  setUserReady
} from './presence-store';

import sessionRoutes from './routes/sessions';
import cardRoutes from './routes/cards';
import actionItemRoutes from './routes/action-items';



dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? true
      : 'http://localhost:5173',
    credentials: true
  }
});

// socket.io event handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // join session room
  socket.on('join-session', (sessionId: string, username: string) => {
    socket.join(sessionId);
    socket.data.sessionId = sessionId;
    socket.data.username = username;

    addUserToSession(sessionId, username, socket.id);

    const presenceState = getPresenceState(sessionId);
    socket.emit('presence-update', presenceState);

    // notify others in room
    socket.to(sessionId).emit('user-joined', { username });
    console.log(`${username} joined session ${sessionId}`);
  });

  // leave session
  socket.on('leave-session', (sessionId: string) => {
    const username = socket.data.username;
    socket.leave(sessionId);
    socket.to(sessionId).emit('user-left', { username });
  });

  // card events (real-time sync)
  socket.on('card-created', (data) => {
    socket.to(data.sessionId).emit('card-created', data.card);
  });

  socket.on('mark-ready', (sessionId: string, username: string, isReady: boolean) => {
    setUserReady(sessionId, username, isReady);

    // broadcast updated ready list to everyone in session
    const readyUsers = getPresenceState(sessionId).readyUsers;
    io.to(sessionId).emit('ready-status-changed', {
      username,
      isReady,
      readyUsers
    });

    console.log(`${username} marked as ${isReady ? 'done' : 'working'} in ${sessionId}`);
  });

  socket.on('card-updated', (data) => {
    socket.to(data.sessionId).emit('card-updated', data.card);
  });

  socket.on('card-deleted', (data) => {
    socket.to(data.sessionId).emit('card-deleted', { cardId: data.cardId });
  });

  socket.on('disconnect', () => {
    const removed = removeUserFromSession(socket.id);

    if (removed) {
      const username = socket.data.username;
      const sessionId = socket.data.sessionId;
      if (sessionId && username) {
        io.to(sessionId).emit('user-left', { username });
      }
    }
    console.log('User disconnected:', socket.id);
  });

  socket.on('leave-session', (sessionId: string) => {
    const username = socket.data.username;
    socket.leave(sessionId);

    const removed = removeUserFromSession(socket.id);
    if (removed) {
      socket.to(sessionId).emit('user-left', { username: removed.username });
    }
  });
});






app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? true
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'server is running, holmes',
      timestamp: new Date().toISOString(),
    });
});



// app routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/action-items', actionItemRoutes);

// serve static files in production
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../../frontend/dist');
    app.use(express.static(frontendPath));

    // handle client-side routing - catch-all for non-api routes
    app.use((req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
} else {
    // 404 handler for dev only
    app.use((req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
}

// app.listen(port, () => {
//     console.log(`server running on port ${port}`);
// });

// use httpServer to listen
httpServer.listen(port, () => {
  console.log(`server running on port ${port}`);
});
