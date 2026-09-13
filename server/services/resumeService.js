import { PDFParse } from 'pdf-parse';
import { buildResumePrompt } from '../prompts/resumePrompt.js';
import { generateContent } from './groqService.js';
import { parseAndValidate } from '../utils/validateAIResponse.js';

// Extracts raw text from a PDF buffer
export async function extractTextFromPDF(buffer) {
  let parser = null;
  try {
    parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const text = result?.text || '';

    if (!text || text.trim().length < 50) {
      throw new Error('Could not extract meaningful text from the PDF. The file may be scanned or image-based.');
    }

    return text;
  } finally {
    if (parser && typeof parser.destroy === 'function') {
      try {
        await parser.destroy();
      } catch {
        // ignore cleanup error
      }
    }
  }
}

// PDF buffer → structured candidate profile
export async function extractResumeProfile(pdfBuffer) {
  const rawText = await extractTextFromPDF(pdfBuffer);

  const prompt = buildResumePrompt(rawText);

  const aiResponse = await generateContent(prompt);

  const profile = parseAndValidate(aiResponse, ['name', 'skills']);

  return {
    name: profile.name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    summary: profile.summary || '',
    education: profile.education || [],
    skills: profile.skills || [],
    experience: profile.experience || [],
    projects: profile.projects || [],
    achievements: profile.achievements || [],
    certifications: profile.certifications || [],
  };
}
