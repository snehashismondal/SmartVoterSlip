export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:px-6 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} Smart Voter Slip Printing System</p>
        <p className="text-xs"><strong>Disclaimer: </strong>Result as per 28/02/2026 updated data only</p>
      </div>
    </footer>
  );
}
