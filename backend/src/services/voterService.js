import { createHash } from 'node:crypto';
import { voterStore } from '../database/voterStore.js';
import { pdfService } from '../pdf/pdfService.js';
import { logger } from '../utils/logger.js';

class SearchCache {
  constructor(maxSize, ttlMs) {
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
    this.cache = new Map();
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.ts > this.ttlMs) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  set(key, data) {
    if (this.cache.size >= this.maxSize) {
      const oldest = this.cache.keys().next().value;
      this.cache.delete(oldest);
    }
    this.cache.set(key, { data, ts: Date.now() });
  }

  clear() {
    this.cache.clear();
  }
}

const searchCache = new SearchCache(
  Number(process.env.SEARCH_CACHE_MAX) || 500,
  Number(process.env.SEARCH_CACHE_TTL_MS) || 300_000,
);

export function searchVoters(query, limit) {
  const cacheKey = `${query}:${limit}`;
  const cached = searchCache.get(cacheKey);
  if (cached) {
    return { ...cached, cached: true };
  }

  const results = voterStore.search(query, limit);
  const payload = {
    query,
    count: results.length,
    results,
    cached: false,
  };

  searchCache.set(cacheKey, payload);
  return payload;
}

export async function printVoterSlip(epicNo) {
  const voter = voterStore.findByEpic(epicNo);
  if (!voter) {
    const err = new Error('Voter not found');
    err.statusCode = 404;
    throw err;
  }

  const pdfBuffer = await pdfService.extractPage(voter.page_no);

  logger.info('Voter slip extracted', {
    epic_no: voter.epic_no,
    page_no: voter.page_no,
    bytes: pdfBuffer.length,
  });

  return {
    buffer: pdfBuffer,
    filename: `voter-slip-${voter.epic_no}.pdf`,
    page_no: voter.page_no,
    epic_no: voter.epic_no,
  };
}

export function clearSearchCache() {
  searchCache.clear();
}

export function buildSearchEtag(query, count) {
  return `"${createHash('md5').update(`${query}:${count}`).digest('hex')}"`;
}

export function buildPdfEtag(epicNo, pageNo) {
  return `"${createHash('md5').update(`${epicNo}:${pageNo}`).digest('hex')}"`;
}
