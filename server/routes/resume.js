import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { handleResumeExtract } from '../controllers/resumeController.js';

const router = Router();

// Multer Configuration
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },

  fileFilter: (_req, file, callback) => {
    // Only accept PDF files
    const isPdf =
      file.mimetype === 'application/pdf' ||
      file.originalname.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      return callback(new Error('Only PDF files are allowed'), false);
    }
    callback(null, true);
  },
});

// Multer Error Handler
function uploadMiddleware(req, res, next) {
  upload.single('resume')(req, res, (err) => {
    if (!err) return next();

    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    if (err.message === 'Only PDF files are allowed') {
      return res.status(400).json({ error: 'Only PDF files are accepted.' });
    }
    return res.status(400).json({ error: err.message || 'File upload failed.' });
  });
}

// POST /api/resume/extract
router.post('/extract', requireAuth, uploadMiddleware, handleResumeExtract);

export default router;
