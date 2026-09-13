export function parseAndValidate(rawText, requiredFields = []) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('AI returned an empty response');
  }

  let jsonText = rawText.trim();

  // Strip markdown code fences if present: ```json ... ``` or ``` ... ```
  const codeFenceMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeFenceMatch) {
    jsonText = codeFenceMatch[1].trim();
  }

  // If no code fence, try to find the first { or [ and extract from there
  if (!jsonText.startsWith('{') && !jsonText.startsWith('[')) {
    const firstBrace = jsonText.indexOf('{');
    const firstBracket = jsonText.indexOf('[');

    let start = -1;
    if (firstBrace !== -1 && firstBracket !== -1) {
      start = Math.min(firstBrace, firstBracket);
    } else {
      start = Math.max(firstBrace, firstBracket);
    }

    if (start === -1) {
      throw new Error('AI response does not contain valid JSON');
    }
    jsonText = jsonText.slice(start);
  }

  // Attempt to parse
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error(`AI returned malformed JSON: ${jsonText.slice(0, 200)}...`);
  }

  // Validate required fields
  for (const field of requiredFields) {
    if (!(field in parsed)) {
      throw new Error(`AI response is missing required field: "${field}"`);
    }
  }

  return parsed;
}
