import rateLimit from 'express-rate-limit';

// Standard rate limiter for general API routes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 req
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP. Please try again in 15 minutes.',
  },
});

// Stricter limiter for AI operations (Resume extraction & interview message generation)
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 30, // 30 req
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'You are sending requests too quickly. Please wait a moment and try again.',
  },
});
