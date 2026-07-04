/**
 * Sends exactly one PDF page to the browser print driver.
 * Expects a single-page blob from the backend (never the full voter list PDF).
 */
export function printPdfBlob(blob, { sourcePage } = {}) {
  return new Promise((resolve, reject) => {
    const pdfBlob =
      blob instanceof Blob && blob.type === 'application/pdf'
        ? blob
        : new Blob([blob], { type: 'application/pdf' });

    const url = URL.createObjectURL(pdfBlob);
    const iframe = document.createElement('iframe');
    iframe.title = sourcePage ? `Voter slip page ${sourcePage}` : 'Voter slip';
    iframe.setAttribute(
      'style',
      'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden',
    );

    let finished = false;

    const cleanup = () => {
      URL.revokeObjectURL(url);
      iframe.remove();
    };

    const finish = (err) => {
      if (finished) return;
      finished = true;
      cleanup();
      if (err) reject(err);
      else resolve();
    };

    iframe.onload = () => {
      const win = iframe.contentWindow;
      if (!win) {
        finish(new Error('Print window unavailable'));
        return;
      }

      // Allow the built-in PDF viewer to render the single page before printing
      requestAnimationFrame(() => {
        setTimeout(() => {
          try {
            win.addEventListener('afterprint', () => finish(), { once: true });
            win.focus();
            win.print();
          } catch (err) {
            finish(err);
            return;
          }

          // Some browsers never fire afterprint for PDF iframes
          setTimeout(() => finish(), 120000);
        }, 400);
      });
    };

    iframe.onerror = () => finish(new Error('Failed to load PDF for printing'));

    iframe.src = url;
    document.body.appendChild(iframe);
  });
}
