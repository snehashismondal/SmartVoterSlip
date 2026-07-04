const EPIC_PATTERN = /^[A-Za-z0-9/\-]{3,20}$/;

export function normalizeEpic(epic) {
  return String(epic ?? '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '');
}

export function validateSearchQuery(query, minLength) {
  const q = String(query ?? '').trim();
  if (!q) {
    return { valid: false, error: 'Search query is required' };
  }
  if (q.length < minLength) {
    return {
      valid: false,
      error: `Search query must be at least ${minLength} characters`,
    };
  }
  if (q.length > 30) {
    return { valid: false, error: 'Search query is too long' };
  }
  if (!/^[A-Za-z0-9/\-]+$/.test(q)) {
    return { valid: false, error: 'Search query contains invalid characters' };
  }
  return { valid: true, normalized: q.toUpperCase() };
}

export function validateEpicNo(epicNo) {
  const normalized = normalizeEpic(epicNo);
  if (!normalized) {
    return { valid: false, error: 'EPIC number is required' };
  }
  if (!EPIC_PATTERN.test(normalized)) {
    return { valid: false, error: 'Invalid EPIC number format' };
  }
  return { valid: true, normalized };
}
