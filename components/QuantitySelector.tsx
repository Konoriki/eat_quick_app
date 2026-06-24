'use client';

import { useState } from 'react';

export default function QuantitySelector({ price }: { price: number }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <label className="font-semibold">Quantity:</label>
        <div className="flex items-center border border-gray-300 rounded">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 hover:bg-gray-100"
          >
            −
          </button>
          <span className="px-4 py-2 font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition">
        Add to Cart (${(price * quantity).toFixed(2)})
      </button>
    </div>
  );
}
