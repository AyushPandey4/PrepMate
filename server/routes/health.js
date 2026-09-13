import { Router } from 'express';

// Simple health check endpoint.
// Used to confirm the server is running and reachable from the client.

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'PrepMate API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
