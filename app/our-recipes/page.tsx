import Image from 'next/image';
import Link from 'next/link';
import { Suspense, use } from 'react';
import RecipeSearchForm from '@/components/RecipeSearchForm';

// ... (keep constants and interfaces as is)
const RECIPES_PER_PAGE = 10;

interface Recipe {
  id: number;
  name: string;
  image: string;
  ingredients: string[];
  instructions: string[];
  cuisine: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  caloriesPerServing: number;
}

interface RecipeResponse {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}

async function fetchRecipes(query: string, page: number): Promise<RecipeResponse> {
  const skip = (page - 1) * RECIPES_PER_PAGE;

  let url: string;
  if (query) {
    url = `https://dummyjson.com/recipes/search?q=${encodeURIComponent(query)}&limit=100&skip=0`;
  } else {
    url = `https://dummyjson.com/recipes?limit=${RECIPES_PER_PAGE}&skip=${skip}`;
  }

  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error('Failed to fetch recipes');
  const data: RecipeResponse = await response.json();

  if (query) {
    const allRecipes = data.recipes;
    const paginated = allRecipes.slice(skip, skip + RECIPES_PER_PAGE);
    return {
      recipes: paginated,
      total: allRecipes.length,
      skip,
      limit: RECIPES_PER_PAGE,
    };
  }

  return data;
}

function RecipeSkeleton() {
  return (
    <div className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
  );
}

function RecipesLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(RECIPES_PER_PAGE)].map((_, i) => (
        <RecipeSkeleton key={i} />
      ))}
    </div>
  );
}

function RecipeList({
  promise,
  query,
  page,
}: {
  promise: Promise<RecipeResponse>;
  query: string;
  page: number;
}) {
  // Utilisation stricte du hook use() tel que demandé dans le TP
  const data = use(promise);
  const totalPages = Math.ceil(data.total / RECIPES_PER_PAGE);

  if (data.recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-6xl mb-4">🔍</p>
        <p className="text-gray-600 text-xl font-semibold">No recipes found for "{query}"</p>
        <p className="text-gray-500 mt-2">Try a different keyword!</p>
        <Link
          href="/our-recipes"
          className="inline-block mt-6 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          See All Recipes
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Résultat count */}
      <p className="text-gray-500 text-sm mb-6 text-center">
        {query
          ? `${data.total} result${data.total !== 1 ? 's' : ''} for "${query}" — page ${page} of ${totalPages}`
          : `${data.total} recipes — page ${page} of ${totalPages}`}
      </p>

      {/* Grille de recettes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {data.recipes.map((recipe) => (
          <article
            key={recipe.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden border border-gray-100 group"
          >
            <div className="relative h-56 w-full bg-gray-100 flex-shrink-0 overflow-hidden">
              <Image
                src={recipe.image}
                alt={recipe.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute top-3 left-3 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-black px-3 py-1.5 rounded-md uppercase tracking-widest shadow-md">
                {recipe.cuisine}
              </span>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold mb-4 line-clamp-2 text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">
                {recipe.name}
              </h2>

              <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
                <p className="flex items-center gap-1"><span className="text-lg">⏱️</span> {recipe.prepTimeMinutes}m</p>
                <p className="flex items-center gap-1"><span className="text-lg">🔥</span> {recipe.cookTimeMinutes}m</p>
                <p className="flex items-center gap-1"><span className="text-lg">👥</span> {recipe.servings} p</p>
                <p className="flex items-center gap-1"><span className="text-lg">📊</span> <span className="capitalize font-semibold">{recipe.difficulty}</span></p>
              </div>

              {recipe.caloriesPerServing && (
                <p className="text-sm font-medium text-gray-500 mb-4 bg-gray-50 inline-block px-3 py-1 rounded-md">
                  🥗 {recipe.caloriesPerServing} kcal/serving
                </p>
              )}

              <details className="mt-auto group/details">
                <summary className="cursor-pointer font-bold text-gray-800 hover:text-orange-600 text-sm list-none flex items-center justify-between border-t border-gray-100 pt-4">
                  Ingredients ({recipe.ingredients.length})
                  <span className="transition group-open/details:rotate-180">▼</span>
                </summary>
                <ul className="list-disc list-inside mt-3 text-sm text-gray-600 space-y-1.5 bg-gray-50 p-3 rounded-lg">
                  {recipe.ingredients.slice(0, 5).map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                  {recipe.ingredients.length > 5 && (
                    <li className="text-orange-600 font-semibold list-none pl-1">+{recipe.ingredients.length - 5} more</li>
                  )}
                </ul>
              </details>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Recipe pagination" className="flex justify-center items-center gap-2 flex-wrap">
          {page > 1 ? (
            <Link
              href={`/our-recipes?${new URLSearchParams({ ...(query ? { q: query } : {}), page: String(page - 1) }).toString()}`}
              className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:border-orange-500 hover:text-orange-600 text-gray-700 font-bold transition-colors shadow-sm"
              aria-label="Previous page"
            >
              ← Prev
            </Link>
          ) : (
            <span className="px-5 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 font-bold cursor-not-allowed">
              ← Prev
            </span>
          )}

          <div className="flex gap-1 mx-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const isActive = p === page;
              const params = new URLSearchParams({ ...(query ? { q: query } : {}), page: String(p) });
              return (
                <Link
                  key={p}
                  href={`/our-recipes?${params.toString()}`}
                  aria-label={`Page ${p}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-11 h-11 flex items-center justify-center rounded-xl font-bold transition-all ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 -translate-y-0.5'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  {p}
                </Link>
              );
            })}
          </div>

          {page < totalPages ? (
            <Link
              href={`/our-recipes?${new URLSearchParams({ ...(query ? { q: query } : {}), page: String(page + 1) }).toString()}`}
              className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:border-orange-500 hover:text-orange-600 text-gray-700 font-bold transition-colors shadow-sm"
              aria-label="Next page"
            >
              Next →
            </Link>
          ) : (
            <span className="px-5 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 font-bold cursor-not-allowed">
              Next →
            </span>
          )}
        </nav>
      )}
    </>
  );
}

type SearchParams = Promise<{ q?: string; page?: string }>;

export default async function OurRecipesPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const query = searchParams.q ?? '';
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1);

  // La promesse est créée ici (côté serveur) et transmise au composant
  const recipesPromise = fetchRecipes(query, page);

  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <h1 className="text-5xl md:text-6xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight">Our Recipes</h1>
      <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto text-lg">
        Discover delicious recipes from around the world. Search for your favorite dishes and get inspired!
      </p>

      {/* Search form — Client Component */}
      <Suspense>
        <RecipeSearchForm initialQuery={query} />
      </Suspense>

      {/* Recipe list — rendered server-side with Suspense and use() */}
      <Suspense fallback={<RecipesLoading />}>
        <RecipeList promise={recipesPromise} query={query} page={page} />
      </Suspense>
    </div>
  );
}