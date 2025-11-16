import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import videoRoutes from './src/routes/video.ts';
import captionRoutes from './src/routes/captions.ts';
import renderRoutes from './src/routes/render.ts';

import { errorHandler } from './src/middleware/errorHandler.ts';
import { notFound } from './src/middleware/notFound.ts';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
});

app.use(helmet());
app.use(limiter);
app.use(cors({
    origin: "*"|| 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/outputs', express.static(path.join(__dirname, '../outputs')));

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

app.use(notFound);

app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Uploads directory: ${path.join(__dirname, '../uploads')}`);
    console.log(`Outputs directory: ${path.join(__dirname, '../outputs')}`);
});
export default app;