import { printVoterSlip, buildPdfEtag } from '../services/voterService.js';
import { validateEpicNo } from '../utils/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const printVoterSlipHandler = asyncHandler(async (req, res) => {
  const epicInput = req.body?.epic_no ?? req.body?.epicNo;
  const validation = validateEpicNo(epicInput);

  if (!validation.valid) {
    return res.status(400).json({ success: false, error: validation.error });
  }

  const { buffer, filename, page_no, epic_no } = await printVoterSlip(validation.normalized);
  const etag = buildPdfEtag(epic_no, page_no);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `inline; filename="${filename}"`,
    'Content-Length': buffer.length,
    'X-PDF-Page-Count': '1',
    'X-Source-Page-No': String(page_no),
    'X-EPIC-No': epic_no,
    ETag: etag,
    'Cache-Control': 'private, max-age=3600',
  });

  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end();
  }

  res.send(buffer);
});
