import { apiClient } from './client';

export async function searchVoters(query, signal) {
  const { data } = await apiClient.get('/search', {
    params: { q: query },
    signal,
  });
  return data;
}

/**
 * Fetches a single-page voter slip PDF from the backend.
 * The server extracts only the voter's page — never the full voterlist.pdf.
 */
export async function fetchVoterSlipPdf(epicNo, signal) {
  try {
    const response = await apiClient.post(
      '/print',
      { epic_no: epicNo },
      {
        responseType: 'blob',
        signal,
        headers: { 'Content-Type': 'application/json' },
      },
    );

    const pageCount = Number(response.headers['x-pdf-page-count'] || 1);
    const sourcePage = Number(response.headers['x-source-page-no'] || 0);

    if (pageCount !== 1) {
      throw new Error('Server returned an invalid PDF (expected exactly 1 page)');
    }

    const raw = response.data;
    const blob =
      raw instanceof Blob && raw.type === 'application/pdf'
        ? raw
        : new Blob([raw], { type: 'application/pdf' });

    return { blob, pageCount, sourcePage };
  } catch (error) {
    if (error.response?.data instanceof Blob) {
      const text = await error.response.data.text();
      try {
        error.response.data = JSON.parse(text);
      } catch {
        /* keep blob */
      }
    }
    throw error;
  }
}
