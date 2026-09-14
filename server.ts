import express from 'express';
import http from 'http';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { authRouter } from './server/routes/auth';
import { testsRouter } from './server/routes/tests';
import { leaderboardRouter } from './server/routes/leaderboard';
import { textsRouter } from './server/routes/texts';
import { statsRouter } from './server/routes/stats';
import { RaceManager } from './server/socket';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Setup Socket.IO
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  const raceManager = new RaceManager(io);

  // Body parser middleware
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'TYPEFLOW API',
      timestamp: new Date().toISOString()
    });
  });

  app.get('/api/rooms', (req, res) => {
    res.json({ rooms: raceManager.getPublicRooms() });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/tests', testsRouter);
  app.use('/api/leaderboard', leaderboardRouter);
  app.use('/api/texts', textsRouter);
  app.use('/api/stats', statsRouter);

  // Vite Dev Server or Production Static Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`TYPEFLOW server & Socket.IO running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
