'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function ImageModal({ src, alt, onClose }: ImageModalProps) {
  const [mounted, setMounted] = useState(false);

  // Fermer avec Escape
  useEffect(() => {
    setMounted(true);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    // Bloquer le scroll du body
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      id="image-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`Full size image: ${alt}`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête avec Légende et Bouton fermer */}
        <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-100/80">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight pr-8">{alt}</h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-12 h-12 flex items-center justify-center bg-slate-100 hover:bg-orange-100 hover:text-orange-600 text-slate-500 rounded-full text-2xl transition-colors shadow-sm"
          >
            ×
          </button>
        </div>

        {/* Image agrandie */}
        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 80vw"
            priority
          />
        </div>

      </div>
    </div>,
    document.body
  );
}
