import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { PDFDocument } from 'pdf-lib';
import { logger } from '../utils/logger.js';

/**
 * PDF extraction service — loads voterlist.pdf once, extracts single pages on demand.
 * Never modifies or transmits the full PDF.
 */
class PdfService {
  #sourceBytes = null;
  #sourceDoc = null;
  #pageCount = 0;
  #loaded = false;

  async load(filePath) {
    const absolutePath = resolve(filePath);

    if (!existsSync(absolutePath)) {
      throw new Error(`PDF not found: ${absolutePath}`);
    }

    this.#sourceBytes = readFileSync(absolutePath);
    this.#sourceDoc = await PDFDocument.load(this.#sourceBytes, {
      ignoreEncryption: true,
    });
    this.#pageCount = this.#sourceDoc.getPageCount();
    this.#loaded = true;

    logger.info('PDF loaded into memory', {
      path: absolutePath,
      pages: this.#pageCount,
      bytes: this.#sourceBytes.length,
    });

    return this.#pageCount;
  }

  isLoaded() {
    return this.#loaded;
  }

  get pageCount() {
    return this.#pageCount;
  }

  /**
   * Extract a single page (1-indexed) into a new one-page PDF buffer.
   * The returned buffer always contains exactly ONE page — never the full document.
   */
  async extractPage(pageNumber) {
    if (!this.#loaded || !this.#sourceDoc) {
      throw new Error('PDF service not initialized');
    }

    const pageIndex = pageNumber - 1;
    if (pageIndex < 0 || pageIndex >= this.#pageCount) {
      throw new Error(`Page ${pageNumber} is out of range (1-${this.#pageCount})`);
    }

    const newDoc = await PDFDocument.create();
    const [copiedPage] = await newDoc.copyPages(this.#sourceDoc, [pageIndex]);
    newDoc.addPage(copiedPage);

    if (newDoc.getPageCount() !== 1) {
      throw new Error('Single-page extraction failed — refusing to send multi-page PDF');
    }

    const pdfBytes = await newDoc.save();
    const buffer = Buffer.from(pdfBytes);

    logger.debug('Single page extracted', {
      sourcePage: pageNumber,
      outputBytes: buffer.length,
      sourceBytes: this.#sourceBytes.length,
    });

    return buffer;
  }
}

export const pdfService = new PdfService();
