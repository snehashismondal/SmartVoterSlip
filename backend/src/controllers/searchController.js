import { searchVoters, buildSearchEtag } from '../services/voterService.js';
import { validateSearchQuery } from '../utils/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const MIN_LENGTH = Number(process.env.MIN_SEARCH_LENGTH) || 2;
const MAX_RESULTS = Number(process.env.MAX_SEARCH_RESULTS) || 50;

export const searchVotersHandler = asyncHandler(async (req, res) => {
  const validation = validateSearchQuery(req.query.q, MIN_LENGTH);
  if (!validation.valid) {
    return res.status(400).json({ success: false, error: validation.error });
  }

  const payload = searchVoters(validation.normalized, MAX_RESULTS);
  const etag = buildSearchEtag(validation.normalized, payload.count);

  res.set('ETag', etag);
  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end();
  }

  res.json({
    success: true,
    query: payload.query,
    count: payload.count,
    results: payload.results,
    cached: payload.cached,
  });
});
