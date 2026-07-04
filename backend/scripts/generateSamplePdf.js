/**
 * Generates a sample multi-page PDF for development/testing.
 * Replace pdf/voterlist.pdf with your actual voter list PDF in production.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const outputPath = resolve(__dirname, '../pdf/voterlist.pdf');

async function generate() {
  mkdirSync(dirname(outputPath), { recursive: true });

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = [
    { num: 1, title: 'Voter List - Page 1', voters: ['Shibnath Sardar (SIP2294544)', 'Rama Devi (SIP2294545)'] },
    { num: 2, title: 'Voter List - Page 2', voters: ['Amit Kumar (WB/12/345/678901)'] },
    { num: 3, title: 'Voter List - Page 3', voters: ['Priya Sharma (ABC1234567)', 'John Doe (XYZ9876543)'] },
  ];

  for (const pageData of pages) {
    const page = doc.addPage([595, 842]);
    const { height } = page.getSize();

    page.drawText(pageData.title, {
      x: 50,
      y: height - 60,
      size: 18,
      font,
      color: rgb(0.1, 0.1, 0.4),
    });

    page.drawText('Smart Voter Slip — Sample PDF', {
      x: 50,
      y: height - 90,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });

    pageData.voters.forEach((voter, i) => {
      page.drawText(`${i + 1}. ${voter}`, {
        x: 50,
        y: height - 140 - i * 30,
        size: 12,
        font,
      });
    });
  }

  const bytes = await doc.save();
  writeFileSync(outputPath, bytes);
  console.log(`Sample PDF written to ${outputPath} (${pages.length} pages)`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
