'use client';

import { useState, useEffect } from 'react';
import CheckoutModal from '@/components/CheckoutModal';

interface Ingredient {
  id: string;
  name: string;
  price: number;
}

interface IngredientCategory {
  veggies: Ingredient[];
  proteins: Ingredient[];
  sauces: Ingredient[];
  extras: Ingredient[];
}

const BASE_PRICE = 5.99;
const MIN_REQUIRED_CATEGORIES = 3; // veggies, proteins, sauces obligatoires

// Labels et icônes pour chaque catégorie
const CATEGORY_META: Record<keyof IngredientCategory, { label: string; icon: string; required: boolean; hint: string }> = {
  veggies: { label: 'Base / Veggies', icon: '🥗', required: true, hint: 'Choose your base (required)' },
  proteins: { label: 'Proteins', icon: '💪', required: true, hint: 'Choose a protein (required)' },
  sauces: { label: 'Sauces & Dressings', icon: '🍶', required: true, hint: 'Choose a sauce (required)' },
  extras: { label: 'Extras', icon: '✨', required: false, hint: 'Optional add-ons' },
};

export default function MakeYourOwnSaladPage() {
  const [ingredients, setIngredients] = useState<IngredientCategory | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch ingredients depuis l'API Next.js
  useEffect(() => {
    fetch('/api/ingredients')
      .then((res) => res.json())
      .then((data) => {
        setIngredients(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleIngredient = (ingredient: Ingredient) => {
    const isSelected = selectedIngredients.some((ing) => ing.id === ingredient.id);
    if (isSelected) {
      setSelectedIngredients(selectedIngredients.filter((ing) => ing.id !== ingredient.id));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const isSelected = (id: string) => selectedIngredients.some((ing) => ing.id === id);

  // Vérifier que les 3 catégories obligatoires ont au moins 1 sélection
  const hasVeggie = selectedIngredients.some((ing) => ing.id.startsWith('v'));
  const hasProtein = selectedIngredients.some((ing) => ing.id.startsWith('p'));
  const hasSauce = selectedIngredients.some((ing) => ing.id.startsWith('s'));
  const canOrder = hasVeggie && hasProtein && hasSauce;

  const totalPrice = BASE_PRICE + selectedIngredients.reduce((sum, ing) => sum + ing.price, 0);

  // Fermer la modale et reset si confirmation
  const handleModalClose = () => {
    setIsModalOpen(false);
    // Si on était à l'étape de confirmation, on reset la sélection
    setSelectedIngredients([]);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-16 px-4 text-center">
        <div className="animate-spin text-5xl mb-4">⟳</div>
        <p className="text-gray-600 text-lg">Loading ingredients...</p>
      </div>
    );
  }

  if (!ingredients) {
    return (
      <div className="max-w-5xl mx-auto py-16 px-4 text-center">
        <p className="text-red-600 text-lg">Failed to load ingredients. Please try again.</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto py-12 px-4 pb-40">
        {/* En-tête */}
        <h1 className="text-5xl font-bold mb-2 text-center text-orange-600">Build Your Salad</h1>
        <p className="text-center text-gray-500 mb-10">
          Choose your base, protein, and sauce — then add extras if you like!
        </p>

        {/* Checklist des catégories obligatoires */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {[
            { label: 'Veggie base', done: hasVeggie },
            { label: 'Protein', done: hasProtein },
            { label: 'Sauce', done: hasSauce },
          ].map((req) => (
            <div
              key={req.label}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition ${
                req.done
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'bg-gray-100 border-gray-300 text-gray-500'
              }`}
            >
              <span>{req.done ? '✓' : '○'}</span>
              {req.label}
            </div>
          ))}
        </div>

        {/* Grille des ingrédients */}
        <div className="space-y-10">
          {(Object.keys(CATEGORY_META) as (keyof IngredientCategory)[]).map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <section key={cat} aria-labelledby={`section-${cat}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{meta.icon}</span>
                  <div>
                    <h2 id={`section-${cat}`} className="text-2xl font-bold text-gray-800">
                      {meta.label}
                      {meta.required && <span className="text-orange-500 ml-1 text-base">*</span>}
                    </h2>
                    <p className="text-sm text-gray-500">{meta.hint}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {ingredients[cat].map((ingredient) => {
                    const selected = isSelected(ingredient.id);
                    return (
                      <button
                        key={ingredient.id}
                        onClick={() => toggleIngredient(ingredient)}
                        aria-pressed={selected}
                        aria-label={`${ingredient.name}, $${ingredient.price.toFixed(2)}`}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 font-semibold text-sm text-left ${
                          selected
                            ? 'border-orange-500 bg-orange-50 text-orange-900 shadow-md scale-105'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-orange-400 hover:bg-orange-50 hover:scale-102'
                        }`}
                      >
                        {selected && (
                          <span className="absolute top-2 right-2 w-5 h-5 bg-orange-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                            ✓
                          </span>
                        )}
                        <div className="font-bold">{ingredient.name}</div>
                        <div className="text-orange-600 font-bold mt-1">+${ingredient.price.toFixed(2)}</div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Barre sticky en bas — récapitulatif + bouton Commander */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          {/* Sélections */}
          <div className="flex-1 min-w-0">
            {selectedIngredients.length === 0 ? (
              <p className="text-gray-400 text-sm">No ingredients selected yet</p>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-16 overflow-hidden">
                {selectedIngredients.map((ing) => (
                  <span
                    key={ing.id}
                    className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1"
                  >
                    {ing.name}
                    <button
                      onClick={() => toggleIngredient(ing)}
                      aria-label={`Remove ${ing.name}`}
                      className="text-orange-400 hover:text-orange-700 font-bold leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Prix + bouton */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-2xl font-bold text-orange-600">${totalPrice.toFixed(2)}</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!canOrder}
              id="order-button"
              className={`px-6 py-3 rounded-xl font-bold text-white text-base transition-all duration-200 ${
                canOrder
                  ? 'bg-orange-600 hover:bg-orange-700 hover:scale-105 shadow-lg cursor-pointer'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {canOrder ? '🛒 Order Now' : `Select required items`}
            </button>
          </div>
        </div>

        {/* Hint si pas encore prêt */}
        {!canOrder && (
          <div className="bg-orange-50 px-4 py-2 text-center">
            <p className="text-xs text-orange-600 font-medium">
              {!hasVeggie && '🥗 Choose a veggie base · '}
              {!hasProtein && '💪 Choose a protein · '}
              {!hasSauce && '🍶 Choose a sauce'}
            </p>
          </div>
        )}
      </div>

      {/* Modale de commande (multi-step) */}
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        selectedIngredients={selectedIngredients}
        totalPrice={totalPrice}
      />
    </>
  );
}
