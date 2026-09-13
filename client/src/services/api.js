import supabase from './supabase';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('No active session. Please sign in again.');
  }

  return {
    'Authorization': `Bearer ${session.access_token}`,
  };
}

async function handleResponse(res) {
  let data;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      res.status
        ? `Server returned an invalid response (HTTP ${res.status}). The server may have restarted.`
        : 'Network connection lost. Please check if the backend server is running and try again.'
    );
  }

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

// Resume
// POST /api/resume/extract
export async function extractResume(file) {
  const authHeaders = await getAuthHeaders();

  const formData = new FormData();
  formData.append('resume', file);

  const res = await fetch(`${API_BASE}/api/resume/extract`, {
    method: 'POST',
    headers: authHeaders,
    body: formData,
  });

  return handleResponse(res);
}

// Interviews 

// POST /api/interviews
export async function createInterview({ targetRole, targetCompany, mode, resumeProfile }) {
  const authHeaders = await getAuthHeaders();

  const res = await fetch(`${API_BASE}/api/interviews`, {
    method: 'POST',
    headers: { ...authHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetRole, targetCompany, mode, resumeProfile }),
  });

  return handleResponse(res);
}

// GET /api/interviews
export async function getInterviews() {
  const authHeaders = await getAuthHeaders();

  const res = await fetch(`${API_BASE}/api/interviews`, {
    headers: authHeaders,
  });

  return handleResponse(res);
}

// GET /api/interviews/:id
export async function getInterview(id) {
  const authHeaders = await getAuthHeaders();

  const res = await fetch(`${API_BASE}/api/interviews/${id}`, {
    headers: authHeaders,
  });

  return handleResponse(res);
}

// POST /api/interviews/:id/message
export async function sendMessage(id, answer) {
  const authHeaders = await getAuthHeaders();

  const res = await fetch(`${API_BASE}/api/interviews/${id}/message`, {
    method: 'POST',
    headers: { ...authHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ answer }),
  });

  return handleResponse(res);
}

// POST /api/interviews/:id/complete
export async function completeInterview(id) {
  const authHeaders = await getAuthHeaders();

  const res = await fetch(`${API_BASE}/api/interviews/${id}/complete`, {
    method: 'POST',
    headers: authHeaders,
  });

  return handleResponse(res);
}

// GET /api/interviews/:id/feedback
export async function getFeedback(id) {
  const authHeaders = await getAuthHeaders();

  const res = await fetch(`${API_BASE}/api/interviews/${id}/feedback`, {
    headers: authHeaders,
  });

  return handleResponse(res);
}