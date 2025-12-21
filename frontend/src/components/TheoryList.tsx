import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_THEORIES_QUERY } from '../graphql/operations';
import { Theory, TheoryStatus } from '../types';
import TheoryCard from './TheoryCard';

interface TheoryListProps {
  onSelectTheory: (theory: Theory) => void;
  onCreateTheory: () => void;
}

const TheoryList: React.FC<TheoryListProps> = ({ onSelectTheory, onCreateTheory }) => {
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<TheoryStatus | undefined>(undefined);
  const [keyword, setKeyword] = useState('');
  const [hot, setHot] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const { loading, error, data, refetch } = useQuery(GET_THEORIES_QUERY, {
    variables: {
      page,
      size: 10,
      status,
      keyword,
      hot,
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(searchInput);
    setPage(0);
  };

  const handleStatusFilter = (newStatus: TheoryStatus | undefined) => {
    setStatus(newStatus);
    setPage(0);
  };

  const handleHotToggle = () => {
    setHot(!hot);
    setPage(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-conspiracy-green text-xl animate-pulse">
          [LOADING CLASSIFIED DATA...]
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-conspiracy-red text-xl">
          ⚠️ ERROR: {error.message}
        </div>
      </div>
    );
  }

  const theories = data?.theories?.content || [];
  const totalPages = data?.theories?.totalPages || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-conspiracy-green">
            📁 CONSPIRACY FILES
          </h2>
          <button
            onClick={onCreateTheory}
            className="px-6 py-3 bg-conspiracy-green text-conspiracy-darker font-bold hover:bg-conspiracy-amber transition-colors"
          >
            [+ NEW THEORY]
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search theories..."
              className="flex-1 bg-conspiracy-darker border border-conspiracy-green text-conspiracy-green px-4 py-2 focus:outline-none focus:border-conspiracy-amber font-mono"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-conspiracy-green text-conspiracy-darker font-bold hover:bg-conspiracy-amber transition-colors"
            >
              [SEARCH]
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusFilter(undefined)}
              className={`px-4 py-2 font-mono text-sm border transition-colors ${
                status === undefined
                  ? 'bg-conspiracy-green text-conspiracy-darker border-conspiracy-green'
                  : 'bg-conspiracy-darker text-conspiracy-green border-conspiracy-green hover:bg-conspiracy-green/20'
              }`}
            >
              [ALL]
            </button>
            <button
              onClick={() => handleStatusFilter(TheoryStatus.UNVERIFIED)}
              className={`px-4 py-2 font-mono text-sm border transition-colors ${
                status === TheoryStatus.UNVERIFIED
                  ? 'bg-conspiracy-amber text-conspiracy-darker border-conspiracy-amber'
                  : 'bg-conspiracy-darker text-conspiracy-amber border-conspiracy-amber hover:bg-conspiracy-amber/20'
              }`}
            >
              [UNVERIFIED]
            </button>
            <button
              onClick={() => handleStatusFilter(TheoryStatus.CONFIRMED)}
              className={`px-4 py-2 font-mono text-sm border transition-colors ${
                status === TheoryStatus.CONFIRMED
                  ? 'bg-conspiracy-green text-conspiracy-darker border-conspiracy-green'
                  : 'bg-conspiracy-darker text-conspiracy-green border-conspiracy-green hover:bg-conspiracy-green/20'
              }`}
            >
              [CONFIRMED]
            </button>
            <button
              onClick={() => handleStatusFilter(TheoryStatus.DEBUNKED)}
              className={`px-4 py-2 font-mono text-sm border transition-colors ${
                status === TheoryStatus.DEBUNKED
                  ? 'bg-conspiracy-red text-white border-conspiracy-red'
                  : 'bg-conspiracy-darker text-conspiracy-red border-conspiracy-red hover:bg-conspiracy-red/20'
              }`}
            >
              [DEBUNKED]
            </button>
            <button
              onClick={handleHotToggle}
              className={`px-4 py-2 font-mono text-sm border transition-colors ${
                hot
                  ? 'bg-conspiracy-amber text-conspiracy-darker border-conspiracy-amber animate-pulse'
                  : 'bg-conspiracy-darker text-conspiracy-amber border-conspiracy-amber hover:bg-conspiracy-amber/20'
              }`}
            >
              🔥 [HOT]
            </button>
          </div>
        </div>
      </div>

      {/* Theories Grid */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        {theories.length === 0 ? (
          <div className="text-center text-conspiracy-green/70 py-12 border-2 border-conspiracy-green/30 border-dashed">
            <p className="text-xl mb-2">📂 NO DATA FOUND</p>
            <p className="text-sm">[THE FILES ARE EMPTY]</p>
          </div>
        ) : (
          theories.map((theory: Theory) => (
            <TheoryCard
              key={theory.id}
              theory={theory}
              onClick={() => onSelectTheory(theory)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-4 py-2 bg-conspiracy-darker text-conspiracy-green border border-conspiracy-green hover:bg-conspiracy-green/20 disabled:opacity-30 disabled:cursor-not-allowed font-mono"
          >
            [PREV]
          </button>
          <span className="px-4 py-2 bg-conspiracy-darker text-conspiracy-green border border-conspiracy-green font-mono">
            PAGE {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 bg-conspiracy-darker text-conspiracy-green border border-conspiracy-green hover:bg-conspiracy-green/20 disabled:opacity-30 disabled:cursor-not-allowed font-mono"
          >
            [NEXT]
          </button>
        </div>
      )}
    </div>
  );
};

export default TheoryList;
