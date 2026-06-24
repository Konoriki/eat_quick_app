'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function RecipeSearchForm({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    params.set('page', '1');
    router.push(`/our-recipes?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery('');
    router.push('/our-recipes');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto mb-12" role="search">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            id="recipe-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes (e.g., Margherita, Pasta)..."
            aria-label="Search recipes"
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              ×
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          Search
        </button>
      </div>
    </form>
  );
}
