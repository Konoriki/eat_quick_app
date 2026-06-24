'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Chargement lazy du composant ImageModal — il n'est inclus dans le bundle
// que lorsque l'utilisateur clique sur l'icône loupe.
const ImageModal = dynamic(() => import('./ImageModal'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="text-white text-center">
        <div className="animate-spin text-4xl mb-3">⟳</div>
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    </div>
  ),
});

interface ImageModalTriggerProps {
  src: string;
  alt: string;
}

export default function ImageModalTrigger({ src, alt }: ImageModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bouton + — positionné en bas à droite de l'image parente */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label={`View larger image of ${alt}`}
        title="View larger image"
        className="absolute bottom-3 right-3 z-10 w-10 h-10 flex items-center justify-center
                   bg-white/80 hover:bg-orange-600 backdrop-blur-sm text-gray-900 hover:text-white rounded-full text-2xl font-light
                   transition-all duration-300 hover:scale-110 shadow-[0_4px_12px_rgba(0,0,0,0.15)] group-hover:opacity-100 opacity-90"
      >
        +
      </button>

      {/* Modal chargée à la demande */}
      {isOpen && (
        <ImageModal
          src={src}
          alt={alt}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
