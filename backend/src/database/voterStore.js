import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { normalizeEpic } from '../utils/validate.js';
import { logger } from '../utils/logger.js';

/**
 * In-memory voter store loaded once at startup.
 *
 * Indexes:
 * - epicIndex: Map<normalizedEpic, VoterRecord> — O(1) exact lookup for print
 * - epicRecords: compact array for partial search scans
 *
 * Future SQL migration: replace this module with a repository that exposes
 * the same searchVoters() and findByEpic() interface. Frontend unchanged.
 */
class VoterStore {
  #epicIndex = new Map();
  #records = [];
  #loaded = false;

  load(filePath) {
    const absolutePath = resolve(filePath);
    const raw = readFileSync(absolutePath, 'utf-8');
    const data = JSON.parse(raw);

    if (!Array.isArray(data)) {
      throw new Error('voters.json must contain an array');
    }

    this.#epicIndex.clear();
    this.#records = [];

    for (const item of data) {
      const record = this.#normalizeRecord(item);
      if (!record) continue;

      const existing = this.#epicIndex.get(record.epicNorm);
      if (existing) {
        logger.warn('Duplicate EPIC skipped', { epic_no: record.epic_no });
        continue;
      }

      this.#epicIndex.set(record.epicNorm, record);
      this.#records.push(record);
    }

    this.#loaded = true;
    logger.info('Voter database loaded', {
      path: absolutePath,
      count: this.#records.length,
    });

    return this.#records.length;
  }

  #normalizeRecord(item) {
    if (!item || typeof item !== 'object') return null;

    const epic_no = String(item.epic_no ?? '').trim();
    const name = String(item.name ?? '').trim();
    const serial_no = Number(item.serial_no);
    const page_no = Number(item.page_no);

    if (!epic_no || !name || !Number.isFinite(serial_no) || !Number.isFinite(page_no)) {
      return null;
    }

    return {
      serial_no,
      epic_no,
      name,
      page_no,
      epicNorm: normalizeEpic(epic_no),
    };
  }

  isLoaded() {
    return this.#loaded;
  }

  get count() {
    return this.#records.length;
  }

  /** Exact lookup for print API */
  findByEpic(epicNo) {
    const norm = normalizeEpic(epicNo);
    const record = this.#epicIndex.get(norm);
    if (!record) return null;
    return this.#toPublic(record);
  }

  /**
   * Case-insensitive partial EPIC search.
   * Scans indexed records; suitable for 100k+ with debounced frontend queries.
   */
  search(query, limit = 50) {
    const norm = normalizeEpic(query);
    const results = [];

    for (let i = 0; i < this.#records.length; i++) {
      const record = this.#records[i];
      if (record.epicNorm.includes(norm)) {
        results.push(this.#toPublic(record));
        if (results.length >= limit) break;
      }
    }

    return results;
  }

  #toPublic(record) {
    return {
      serial_no: record.serial_no,
      epic_no: record.epic_no,
      name: record.name,
      page_no: record.page_no,
    };
  }
}

export const voterStore = new VoterStore();
