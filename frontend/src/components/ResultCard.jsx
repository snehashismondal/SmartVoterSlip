import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { fetchVoterSlipPdf } from '../api/voters';
import { getErrorMessage } from '../api/client';
import { printPdfBlob } from '../utils/printPdf';

export default function ResultCard({ voter, index }) {
  const [printing, setPrinting] = useState(false);

  const handlePrint = async () => {
    setPrinting(true);
    try {
      const { blob, pageCount, sourcePage } = await fetchVoterSlipPdf(voter.epic_no);

      if (pageCount !== 1) {
        throw new Error('Only single-page slips can be printed');
      }

      await printPdfBlob(blob, { sourcePage });
      toast.success(`Printing page ${sourcePage} for ${voter.epic_no}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setPrinting(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-primary-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-800 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0 flex-1 text-left">
        <h3 className="truncate text-lg font-semibold text-slate-900 dark:text-white">{voter.name}</h3>
        <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500 dark:text-slate-400">EPIC No</dt>
            <dd className="font-mono font-medium text-slate-800 dark:text-slate-100">{voter.epic_no}</dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">Serial No</dt>
            <dd className="font-medium text-slate-800 dark:text-slate-100">{voter.serial_no}</dd>
          </div>
        </dl>
      </div>

      <button
        type="button"
        onClick={handlePrint}
        disabled={printing}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-primary-500 dark:hover:bg-primary-600"
      >
        {printing ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Preparing…
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </>
        )}
      </button>
    </motion.article>
  );
}
