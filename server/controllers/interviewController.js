import supabase from '../services/supabaseService.js';
import { generateChatResponse, generateContent } from '../services/groqService.js';
import { parseAndValidate } from '../utils/validateAIResponse.js';
import { buildTechnicalSystemPrompt, TECHNICAL_START_MESSAGE } from '../prompts/technicalPrompt.js';
import { buildHRSystemPrompt, HR_START_MESSAGE } from '../prompts/hrPrompt.js';
import { buildFeedbackPrompt } from '../prompts/feedbackPrompt.js';

// Helper Functions

// Picks the right system prompt and start message based on interview mode
function getPromptForMode(mode, resumeProfile, targetRole, targetCompany) {
  if (mode === 'technical') {
    return {
      systemPrompt: buildTechnicalSystemPrompt(resumeProfile, targetRole, targetCompany),
      startMessage: TECHNICAL_START_MESSAGE,
    };
  }
  return {
    systemPrompt: buildHRSystemPrompt(resumeProfile, targetRole, targetCompany),
    startMessage: HR_START_MESSAGE,
  };
}

// Converts internal transcript format to OpenAI/Groq chat history format
function transcriptToChatHistory(transcript, startMessage) {
  const history = [];

  if (startMessage) {
    history.push({
      role: 'user',
      content: startMessage,
      parts: [{ text: startMessage }],
    });
  }

  for (const entry of transcript) {
    history.push({
      role: entry.role === 'ai' ? 'assistant' : 'user',
      content: entry.content,
      parts: [{ text: entry.content }],
    });
  }

  return history;
}

// Create Interview
export async function createInterview(req, res) {
  try {
    const { targetRole, targetCompany, mode, resumeProfile } = req.body;

    // Basic validation
    if (!targetRole?.trim()) return res.status(400).json({ error: 'targetRole is required' });
    if (!targetCompany?.trim()) return res.status(400).json({ error: 'targetCompany is required' });
    if (!mode || !['technical', 'hr'].includes(mode)) {
      return res.status(400).json({ error: 'mode must be "technical" or "hr"' });
    }
    if (!resumeProfile || typeof resumeProfile !== 'object') {
      return res.status(400).json({ error: 'resumeProfile is required' });
    }

    const userId = req.user.id;

    // Create the interview row in Supabase (status: in_progress)
    const { data: interview, error: createError } = await supabase
      .from('interviews')
      .insert({
        user_id: userId,
        target_role: targetRole.trim(),
        target_company: targetCompany.trim(),
        mode,
        resume_profile: resumeProfile,
        transcript: [],
        status: 'in_progress',
        question_count: 0,
      })
      .select()
      .single();

    if (createError) {
      console.error('Failed to create interview:', createError);
      return res.status(500).json({ error: 'Failed to create interview. Please try again.' });
    }

    // Build the AI system prompt for this mode
    const { systemPrompt, startMessage } = getPromptForMode(
      mode, resumeProfile, targetRole, targetCompany
    );

    // Ask AI for the first question
    // History is empty for the first turn so no prior conversation
    const rawAIResponse = await generateChatResponse(systemPrompt, [], startMessage);

    // Parse the structured JSON response
    const firstQuestion = parseAndValidate(rawAIResponse, ['message', 'shouldContinue']);

    // Store the first question in the transcript
    const initialTranscript = [
      {
        role: 'ai',
        content: firstQuestion.message,
        topic: firstQuestion.topic || 'general',
        isFollowUp: false,
      },
    ];

    const { error: updateError } = await supabase
      .from('interviews')
      .update({
        transcript: initialTranscript,
        question_count: 1,
      })
      .eq('id', interview.id);

    if (updateError) {
      console.error('Failed to save first question:', updateError);
    }

    // Return the interview ID and first question to the client
    return res.status(201).json({
      interviewId: interview.id,
      question: firstQuestion,
    });

  } catch (error) {
    console.error('createInterview error:', error.message);
    return res.status(500).json({
      error: error.message || 'Failed to start interview. Please try again.',
    });
  }
}

// List Interviews
export async function listInterviews(req, res) {
  try {
    const { data: interviews, error } = await supabase
      .from('interviews')
      .select('id, target_role, target_company, mode, status, overall_score, question_count, created_at, completed_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('listInterviews error:', error);
      return res.status(500).json({ error: 'Failed to fetch interviews.' });
    }

    return res.json({ interviews });
  } catch (error) {
    console.error('listInterviews error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch interviews.' });
  }
}

// Get Single Interview
export async function getInterview(req, res) {
  try {
    const { id } = req.params;

    const { data: interview, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !interview) {
      return res.status(404).json({ error: 'Interview not found.' });
    }

    return res.json({ interview });
  } catch (error) {
    console.error('getInterview error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch interview.' });
  }
}

// Handle Message
// Receives the candidate's answer, queries AI with full conversation context,
// stores both turns into Supabase transcript, and returns the next question.
export async function handleMessage(req, res) {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    if (!answer || typeof answer !== 'string' || !answer.trim()) {
      return res.status(400).json({ error: 'Answer cannot be empty.' });
    }

    // Fetch interview from Supabase and verify ownership
    const { data: interview, error: fetchError } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !interview) {
      return res.status(404).json({ error: 'Interview not found.' });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({ error: 'This interview is already completed.' });
    }

    const currentTranscript = Array.isArray(interview.transcript) ? interview.transcript : [];
    const currentCount = interview.question_count || 1;

    const MAX_QUESTIONS = 15;

    // If the candidate has already answered all questions, or is answering question 15 (the final question):
    // Do NOT generate another question from AI.
    // Conclude with a warm thank-you closing turn and complete the interview.
    if (currentCount >= MAX_QUESTIONS) {
      const closingMessage = interview.mode === 'hr'
        ? 'Thank you so much for your time and for sharing your experiences with me today! That concludes our behavioral interview session. All your responses have been recorded.'
        : 'Thank you for taking the time to speak with me and walking through these technical problems! That concludes our technical interview. All your responses have been recorded.';

      const finalTranscript = [
        ...currentTranscript,
        {
          role: 'user',
          content: answer.trim(),
          timestamp: new Date().toISOString(),
        },
        {
          role: 'ai',
          content: closingMessage,
          topic: 'conclusion',
          isFollowUp: false,
          timestamp: new Date().toISOString(),
        },
      ];

      await supabase
        .from('interviews')
        .update({
          transcript: finalTranscript,
          question_count: MAX_QUESTIONS,
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', id);

      return res.json({
        question: {
          message: closingMessage,
          topic: 'conclusion',
          isFollowUp: false,
          shouldContinue: false,
        },
        questionCount: MAX_QUESTIONS,
        shouldContinue: false,
        isComplete: true,
        transcript: finalTranscript,
      });
    }

    // Build system prompt and start message
    const { systemPrompt, startMessage } = getPromptForMode(
      interview.mode,
      interview.resume_profile,
      interview.target_role,
      interview.target_company
    );

    // Format history for AI chat
    const chatHistory = transcriptToChatHistory(currentTranscript, startMessage);

    // Send candidate's answer to AI
    const rawAIResponse = await generateChatResponse(systemPrompt, chatHistory, answer.trim());

    // Parse structured response
    const nextQuestion = parseAndValidate(rawAIResponse, ['message']);
    const nextCount = currentCount + 1;
    const isLastQuestion = nextQuestion.shouldContinue === false;

    // Build updated transcript with candidate answer and AI question
    const finalTranscript = [
      ...currentTranscript,
      {
        role: 'user',
        content: answer.trim(),
        timestamp: new Date().toISOString(),
      },
      {
        role: 'ai',
        content: nextQuestion.message,
        topic: nextQuestion.topic || 'general',
        isFollowUp: Boolean(nextQuestion.isFollowUp),
        timestamp: new Date().toISOString(),
      },
    ];

    // Update Supabase
    const updatePayload = {
      transcript: finalTranscript,
      question_count: nextCount,
    };

    if (isLastQuestion) {
      updatePayload.status = 'completed';
      updatePayload.completed_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from('interviews')
      .update(updatePayload)
      .eq('id', id);

    if (updateError) {
      console.error('Failed to update interview transcript:', updateError);
    }

    return res.json({
      question: nextQuestion,
      questionCount: nextCount,
      shouldContinue: !isLastQuestion,
      isComplete: isLastQuestion,
      transcript: finalTranscript,
    });

  } catch (error) {
    console.error('handleMessage error:', error.message);
    return res.status(500).json({ error: error.message || 'Failed to process answer.' });
  }
}

// Complete Interview
export async function completeInterview(req, res) {
  try {
    const { id } = req.params;

    // Fetch the interview
    const { data: interview, error: fetchError } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !interview) {
      return res.status(404).json({ error: 'Interview not found.' });
    }

    // If feedback already generated, return it directly
    if (interview.feedback) {
      return res.json({
        success: true,
        feedback: interview.feedback,
        overallScore: interview.overall_score,
      });
    }

    // Mark as completed
    const completedAt = interview.completed_at || new Date().toISOString();
    await supabase
      .from('interviews')
      .update({
        status: 'completed',
        completed_at: completedAt,
      })
      .eq('id', id);

    // Generate feedback using AI
    let feedbackData = null;
    let overallScore = null;

    try {
      const feedbackPrompt = buildFeedbackPrompt(interview);
      const rawFeedback = await generateContent(feedbackPrompt);
      feedbackData = parseAndValidate(rawFeedback, ['overallScore', 'summary']);
      overallScore = feedbackData.overallScore || null;

      // Save feedback in Supabase
      await supabase
        .from('interviews')
        .update({
          feedback: feedbackData,
          overall_score: overallScore,
        })
        .eq('id', id);
    } catch (aiErr) {
      console.error('Failed to generate AI feedback:', aiErr.message);
    }

    return res.json({
      success: true,
      message: 'Interview completed successfully.',
      feedback: feedbackData,
      overallScore,
    });
  } catch (error) {
    console.error('completeInterview error:', error.message);
    return res.status(500).json({ error: error.message || 'Failed to complete interview.' });
  }
}

// Get Feedback
export async function getFeedback(req, res) {
  try {
    const { id } = req.params;

    const { data: interview, error: fetchError } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !interview) {
      return res.status(404).json({ error: 'Interview not found.' });
    }

    // If feedback already exists, return it
    if (interview.feedback) {
      return res.json({
        interview,
        feedback: interview.feedback,
      });
    }

    // If feedback doesn't exist yet, generate it now
    const feedbackPrompt = buildFeedbackPrompt(interview);
    const rawFeedback = await generateContent(feedbackPrompt);
    const feedbackData = parseAndValidate(rawFeedback, ['overallScore', 'summary']);

    await supabase
      .from('interviews')
      .update({
        feedback: feedbackData,
        overall_score: feedbackData.overallScore || null,
        status: 'completed',
        completed_at: interview.completed_at || new Date().toISOString(),
      })
      .eq('id', id);

    return res.json({
      interview: {
        ...interview,
        feedback: feedbackData,
        overall_score: feedbackData.overallScore,
      },
      feedback: feedbackData,
    });
  } catch (error) {
    console.error('getFeedback error:', error.message);
    return res.status(500).json({ error: error.message || 'Failed to retrieve feedback report.' });
  }
}
