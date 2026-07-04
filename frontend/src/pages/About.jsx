import { motion } from 'framer-motion';

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="prose prose-slate mx-auto max-w-3xl dark:prose-invert"
    >
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">About</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        <strong>Smart Voter Slip Printing System</strong> helps polling booth operators quickly locate
        voters and print individual voter slips without downloading the entire voter list PDF.
      </p>
    </motion.div>
  );
}
