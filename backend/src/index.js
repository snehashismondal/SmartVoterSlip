import 'dotenv/config';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { watchFile } from 'node:fs';
import { createApp } from './app.js';
import { voterStore } from './database/voterStore.js';
import { pdfService } from './pdf/pdfService.js';
import { logger } from './utils/logger.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const backendRoot = resolve(__dirname, '..');

const PORT = Number(process.env.PORT) || 5000;
const votersPath = resolve(backendRoot, process.env.VOTERS_JSON_PATH || './database/voters.json');
const pdfPath = resolve(backendRoot, process.env.VOTERLIST_PDF_PATH || './pdf/voterlist.pdf');

async function bootstrap() {
  try {
    const voterCount = voterStore.load(votersPath);
    const pageCount = await pdfService.load(pdfPath);

    if (process.env.NODE_ENV !== 'production') {
      watchFile(votersPath, { interval: 1000 }, async (curr, prev) => {
        if (curr.mtimeMs === prev.mtimeMs) return;

        try {
          const reloadedCount = voterStore.load(votersPath);
          logger.info('Voter database reloaded after change', { voters: reloadedCount });
        } catch (reloadError) {
          logger.error('Failed to reload voter database', { message: reloadError.message });
        }
      });
    }

    const app = createApp();

    app.listen(PORT, () => {
      logger.info('Server started', {
        port: PORT,
        env: process.env.NODE_ENV || 'development',
        voters: voterCount,
        pdfPages: pageCount,
      });
    });
  } catch (error) {
    logger.error('Failed to start server', { message: error.message });
    process.exit(1);
  }
}

bootstrap();
