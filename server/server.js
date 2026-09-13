import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { apiLimiter, aiLimiter } from './middleware/rateLimiter.js';
import healthRouter from './routes/health.js';
import resumeRouter from './routes/resume.js';
import interviewRouter from './routes/interview.js';

const app = express();

// Trust reverse proxy headers (required on Render, Heroku, etc.)
app.set('trust proxy', 1);

// Middleware 
const allowedOrigins = [
  config.clientUrl?.replace(/\/$/, ''),
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));

// Parse incoming JSON request bodies.
app.use(express.json());

// Global rate limiting across API endpoints
app.use('/api', apiLimiter);

// Routes 
app.use('/api/health', healthRouter);
app.use('/api/resume', aiLimiter, resumeRouter);
app.use('/api/interviews', aiLimiter, interviewRouter);

// 404 Handler 
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

//  Global Error Handler 
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start Server 
app.listen(config.port, () => {
  console.log(`✅ PrepMate server running on http://localhost:${config.port}`);
});
