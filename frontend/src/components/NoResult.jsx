import { motion } from 'framer-motion';

export default function NoResult({ query }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">No voters found</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        No results for <span className="font-mono font-medium text-slate-700 dark:text-slate-200">{query}</span>.
        Try a partial EPIC number.
      </p>
    </motion.div>
  );
}
