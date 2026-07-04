import { motion } from 'framer-motion';

const steps = [
  {
    title: 'Search',
    description: 'Enter at least 2 characters of the EPIC number. Partial matches are supported.',
  },
  {
    title: 'Select voter',
    description: 'Review Name, EPIC No, and Serial No in the result card.',
  },
  {
    title: 'Print',
    description: 'Click Print.',
  },
];

export default function Help() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Help</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        Quick guide for booth operators using the Smart Voter Slip system.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-950 dark:text-primary-300">
              {i + 1}
            </span>
            <h2 className="mt-3 font-semibold text-slate-900 dark:text-white">{step.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/40">
        <h2 className="font-semibold text-amber-900 dark:text-amber-200">Troubleshooting</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-800 dark:text-amber-300">
          <li>If print does not open, allow pop-ups and try again.</li>
          <li>Ensure EPIC is typed correctly — search is case-insensitive.</li>
          <li>On slow networks, wait for &quot;Preparing…&quot; to finish before retrying.</li>
        </ul>
      </div>
    </motion.div>
  );
}
