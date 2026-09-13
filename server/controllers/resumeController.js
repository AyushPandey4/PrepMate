import { extractResumeProfile } from '../services/resumeService.js';

export async function handleResumeExtract(req, res) {
  try {
    // multer puts the uploaded file on req.file
    // If no file was sent, multer won't set req.file
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded. Please upload a PDF.' });
    }

    // req.file.buffer contains the PDF as a Buffer (we use memoryStorage in multer)
    const profile = await extractResumeProfile(req.file.buffer);

    return res.status(200).json({
      success: true,
      profile,
    });

  } catch (error) {
    console.error('Resume extraction error:', error.message);
    return res.status(500).json({
      error: error.message || 'Failed to extract resume. Please try again.',
    });
  }
}
