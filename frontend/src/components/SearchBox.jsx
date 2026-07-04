import { useForm } from 'react-hook-form';

export default function SearchBox({ onSearch, isLoading, defaultQuery = '' }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { query: defaultQuery },
  });

  const onSubmit = ({ query }) => {
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor="epic-search" className="sr-only">
            Search by EPIC number
          </label>
          <input
            id="epic-search"
            type="text"
            autoComplete="off"
            placeholder="Enter full or partial EPIC number…"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-11 text-base text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-primary-400"
            {...register('query', {
              required: 'EPIC number is required',
              minLength: { value: 2, message: 'Enter at least 2 characters' },
              maxLength: { value: 30, message: 'Maximum 30 characters' },
              pattern: {
                value: /^[A-Za-z0-9/\-]+$/,
                message: 'Only letters, numbers, / and - allowed',
              },
            })}
          />
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
          </svg>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          {isLoading ? 'Searching…' : 'Search'}
        </button>
      </div>

      {errors.query && (
        <p className="mt-2 text-left text-sm text-red-500" role="alert">
          {errors.query.message}
        </p>
      )}
    </form>
  );
}
