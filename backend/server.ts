import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import videoRoutes from './src/routes/video.js';
import captionRoutes from './src/routes/captions.js';
import renderRoutes from './src/routes/render.js';

import { errorHandler } from './src/middleware/errorHandler.js';
import { notFound } from './src/middleware/notFound.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

const isProduction = __dirname.includes('dist');
const BASE_DIR = isProduction ? path.join(__dirname, '..') : __dirname;
const UPLOADS_DIR = path.join(BASE_DIR, 'uploads');
const OUTPUTS_DIR = path.join(BASE_DIR, 'outputs');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  skip: (req) => {
    return req.path.startsWith('/uploads/') || 
           req.path.startsWith('/outputs/') ||
           req.path.startsWith('/api/render/status'); 
  },
});

app.use('/uploads', (req, res, next) => {
  console.log(`[CORS] ${req.method} ${req.path} - Setting CORS headers`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
  if (req.method === 'OPTIONS') {
    console.log('[CORS] OPTIONS preflight request - returning 204');
    res.status(204).end();
    return;
  }
  next();
});

app.use('/outputs', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      mediaSrc: ["'self'", "http://localhost:5001", "http://localhost:3000"],
      imgSrc: ["'self'", "data:", "http://localhost:5001"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));
app.use(limiter);
app.use(cors({
  origin: '*',
  credentials: false,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static(UPLOADS_DIR, {
  setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
    if (path.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
    }
  }
}));
app.use('/outputs', express.static(OUTPUTS_DIR, {
  setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
    if (path.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
    }
  }
}));

app.use('/api/video', videoRoutes);
app.use('/api/captions', captionRoutes);
app.use('/api/render', renderRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/test-cors', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ message: 'CORS test - headers should be set' });
});

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Uploads directory: ${UPLOADS_DIR}`);
  console.log(`Outputs directory: ${OUTPUTS_DIR}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    console.error(`Try: Set PORT environment variable to a different port (e.g., PORT=5001)`);
    console.error(`Or run: ./kill-port.sh`);
    process.exit(1);
  } else {
    throw err;
  }
});

export default app;