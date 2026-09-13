// Formats transcript turns into readable text for the feedback model.
function formatTranscriptForFeedback(transcript) {
  if (!Array.isArray(transcript) || transcript.length === 0) {
    return 'No conversation turns recorded.';
  }

  const lines = [];
  let questionNumber = 1;

  for (let i = 0; i < transcript.length; i++) {
    const entry = transcript[i];
    if (entry.role === 'ai') {
      if (entry.topic === 'conclusion') continue;
      lines.push(`\n[Question ${questionNumber}] (Topic: ${entry.topic || 'General'})`);
      lines.push(`Interviewer: ${entry.content}`);
      questionNumber++;
    } else if (entry.role === 'user') {
      lines.push(`Candidate Answer: ${entry.content}`);
    }
  }

  return lines.join('\n');
}


export function buildFeedbackPrompt(interview) {
  const {
    target_role,
    target_company,
    mode,
    resume_profile,
    transcript,
  } = interview;

  const formattedTranscript = formatTranscriptForFeedback(transcript);
  const candidateName = resume_profile?.name || 'Candidate';
  const isTechnical = mode === 'technical';

  return `
You are an expert hiring manager and technical interview evaluator.
You have just conducted a mock ${isTechnical ? 'technical' : 'behavioral / HR'} interview for ${candidateName}, who applied for the role of "${target_role}" at "${target_company}".

INTERVIEW CONTEXT:
- Target Role: ${target_role}
- Target Company: ${target_company}
- Interview Mode: ${isTechnical ? 'Technical' : 'HR Behavioral'}

FULL INTERVIEW TRANSCRIPT:
${formattedTranscript}

EVALUATION TASK:
Analyze the candidate's answers objectively, rigorously, and constructively.
Evaluate:
1. ${isTechnical ? 'Technical Depth & Accuracy: Did the candidate demonstrate accurate, deep domain knowledge?' : 'Behavioral & Experience Depth: Did they use STAR format and provide concrete examples?'}
2. Problem Solving & Structuring: Did the candidate communicate thoughts systematically and logically?
3. Communication & Articulation: Were responses clear, concise, and professional?
4. Role & Company Alignment: Does the candidate meet the standard expected for "${target_role}" at "${target_company}"?

SCORING GUIDELINES:
- Overall Score: Integer between 0 and 100 based on the complete session.
  - 90-100: Exceptional, ready to clear senior bar.
  - 75-89: Strong, meets requirements with minor polish needed.
  - 60-74: Potential shown, but significant gaps in depth or structure.
  - Below 60: Underprepared, needs substantial revision.
- Sub-scores: Integer between 0 and 100 for each dimension.
- Per-question score: Integer between 1 and 10.

RESPONSE FORMAT — CRITICAL:
You MUST respond with ONLY valid JSON. No markdown code blocks, no explanation text.
Follow this exact JSON structure:

{
  "overallScore": 82,
  "summary": "2-3 paragraphs providing an executive evaluation of the candidate's performance, presence, and hiring recommendation.",
  "scores": {
    "technicalOrBehavioralDepth": 80,
    "problemSolving": 85,
    "communication": 78,
    "roleFit": 82
  },
  "strengths": [
    "Specific strength observed from an actual answer...",
    "Another specific strength with concrete context..."
  ],
  "areasForImprovement": [
    "Specific area where the candidate's answer was weak or missed key concepts...",
    "Another actionable area for improvement..."
  ],
  "questionFeedback": [
    {
      "question": "Question text as asked",
      "answer": "Candidate answer summary or excerpt",
      "score": 8,
      "critique": "Constructive assessment of what went well and what was missing in this specific answer.",
      "idealAnswerKeypoints": "Key concepts or points an ideal candidate should mention."
    }
  ],
  "recommendedNextSteps": [
    "Targeted topic, algorithm, or concept to study before the real interview...",
    "Specific practice recommendation..."
  ]
}
`.trim();
}
