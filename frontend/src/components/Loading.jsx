import { motion } from 'framer-motion';

export default function Loading({ message = 'Searching voters…' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-4 py-16"
      role="status"
      aria-live="polite"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 dark:border-slate-700 dark:border-t-primary-400" />
      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </motion.div>
  );
}
