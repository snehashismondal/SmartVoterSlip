import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import SearchBox from '../components/SearchBox';
import ResultCard from '../components/ResultCard';
import Loading from '../components/Loading';
import NoResult from '../components/NoResult';
import { useDebounce } from '../hooks/useDebounce';
import { searchVoters } from '../api/voters';
import { getErrorMessage } from '../api/client';

export default function Home() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const debouncedQuery = useDebounce(submittedQuery, 400);

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: ({ signal }) => searchVoters(debouncedQuery, signal),
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    if (isError) {
      toast.error(getErrorMessage(error), { toastId: 'search-error' });
    }
  }, [isError, error]);

  const handleSearch = (value) => {
    setQuery(value);
    setSubmittedQuery(value);
  };

  const results = data?.results ?? [];
  const showResults = debouncedQuery.length >= 2 && !isFetching;
  const showNoResult = showResults && results.length === 0;

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Voter Slip Search
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
          Search by full or partial EPIC number.
        </p>
      </motion.section>

      <SearchBox onSearch={handleSearch} isLoading={isFetching} defaultQuery={query} />

      {isFetching && debouncedQuery.length >= 2 && <Loading />}

      {showNoResult && <NoResult query={debouncedQuery} />}

      {showResults && results.length > 0 && (
        <section className="space-y-4" aria-label="Search results">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {results.length} result{results.length !== 1 ? 's' : ''} for{' '}
            <span className="font-mono font-medium text-slate-700 dark:text-slate-200">{debouncedQuery}</span>
          </p>
          <div className="grid gap-4">
            {results.map((voter, index) => (
              <ResultCard key={voter.epic_no} voter={voter} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
