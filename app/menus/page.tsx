import Link from 'next/link';
import Image from 'next/image';
import { getAllMenuItems } from '../../lib/markdown';
import ImageModalTrigger from '@/components/ImageModalTrigger';

export default function AllMenusPage() {
  // On récupère toutes les données de nos fichiers Markdown !
  const items = getAllMenuItems();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-5xl font-bold mb-8 text-center text-orange-600">Our Full Menu</h1>
      
      {/* Menu de navigation des catégories */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        <Link href="/menus" className="bg-orange-600 text-white px-6 py-2 rounded-full font-semibold">
          All Items
        </Link>
        <Link href="/menus/salads" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-full font-semibold transition">
          Salads
        </Link>
        <Link href="/menus/hot-meal" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-full font-semibold transition">
          Hot Meals
        </Link>
      </div>

      {/* Grille des plats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item.slug} className="group bg-white rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 overflow-hidden border border-slate-100 transition-all duration-500 flex flex-col">
            {/* Image avec bouton loupe (lazy-loaded modal) */}
            <div className="relative h-64 w-full bg-slate-50 overflow-hidden">
              <Image 
                src={`/img/${item.image}`} 
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onError={undefined}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-white/90 backdrop-blur-md text-orange-600 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                  {item.category}
                </span>
                {item.calories && (
                  <span className="bg-slate-900/70 backdrop-blur-md text-white font-medium text-xs px-3 py-1.5 rounded-full shadow-sm">
                    {item.calories} cal
                  </span>
                )}
              </div>

              {/* Bouton + — charge ImageModal dynamiquement au clic */}
              <ImageModalTrigger
                src={`/img/${item.image}`}
                alt={item.title}
              />
            </div>
            <div className="p-8 flex flex-col flex-grow">
              <h2 className="text-2xl font-black mb-3 text-slate-800 leading-tight group-hover:text-orange-600 transition-colors">{item.title}</h2>
              
              <div className="mt-auto pt-6 flex items-center justify-between">
                {item.price && <p className="text-3xl font-black text-slate-900">${item.price}</p>}
                <Link 
                  href={`/menus/${item.category}/${item.slug}`}
                  className="inline-flex items-center justify-center bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white px-6 py-3 rounded-full transition-all duration-300 font-bold text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}