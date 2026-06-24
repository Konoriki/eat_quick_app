import Image from 'next/image';
import Link from 'next/link';
import Markdown from 'react-markdown';
import { getMenuItemBySlug } from '@/lib/markdown';
import QuantitySelector from '@/components/QuantitySelector';

type Params = Promise<{ slug: string; category: string }>;

export default async function MenuItemPage(props: { params: Params }) {
  const params = await props.params;
  
  // On récupère l'item correspondant au slug
  const item = getMenuItemBySlug(params.slug);

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-6 text-orange-600">Item not found</h1>
        <Link href="/menus" className="text-orange-600 hover:underline text-lg">
          ← Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Back Button */}
      <Link href="/menus" className="text-orange-600 hover:underline mb-6 inline-block font-semibold">
        ← Back to Menu
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Image */}
        <div className="relative h-96 w-full bg-gray-100 rounded-xl overflow-hidden">
          <Image
            src={`/img/${item.image}`}
            alt={item.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Info */}
        <div>
          <span className="uppercase text-xs font-bold text-orange-600 tracking-wider">
            {item.category}
          </span>
          <h1 className="text-4xl font-bold mt-2 mb-4">{item.title}</h1>
          
          {item.calories && (
            <p className="text-gray-600 mb-4">
              <strong>Calories:</strong> {item.calories} kcal
            </p>
          )}

          {item.price && (
            <p className="text-3xl font-bold text-orange-600 mb-6">${item.price}</p>
          )}

          {item.ingredients && item.ingredients.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">Ingredients:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {item.ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity Selector */}
          <QuantitySelector price={item.price || 0} />
        </div>
      </div>

      {/* Description */}
      {item.content && (
        <div className="prose prose-sm max-w-none bg-gray-50 p-6 rounded-lg">
          <Markdown>{item.content}</Markdown>
        </div>
      )}
    </div>
  );
}
