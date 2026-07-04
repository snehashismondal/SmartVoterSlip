import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">Customize your experience.</p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Choose light or dark mode.</p>

        <div className="mt-4 flex gap-3">
          {['light', 'dark'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setTheme(mode)}
              className={`rounded-xl border px-5 py-2.5 text-sm font-medium capitalize transition ${
                theme === mode
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-950 dark:text-primary-300'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
