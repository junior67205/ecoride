'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface GalerieImage {
  galerie_id: number;
  nom_fichier: string;
  titre?: string | null;
  description?: string | null;
}

export default function GalerieGrid() {
  const [images, setImages] = useState<GalerieImage[]>([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch('/api/galerie')
      .then(res => res.json())
      .then(data => setImages(data));
  }, []);

  if (!images.length) return null;

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto w-full">
      <h2 className="text-3xl font-extrabold text-primary text-center mb-10">Galerie</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((img, i) => (
          <button
            key={img.galerie_id}
            className="group relative overflow-hidden rounded-xl shadow-lg bg-white border border-primary-light focus:outline-none"
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            aria-label={img.titre || 'Image galerie'}
          >
            <Image
              src={`/uploads/${img.nom_fichier}`}
              alt={img.titre || ''}
              width={600}
              height={400}
              className="object-cover w-full h-56 transition-transform duration-300 group-hover:scale-105"
            />
            {img.titre && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm px-3 py-2">
                {img.titre}
              </div>
            )}
          </button>
        ))}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map(img => ({
          src: `/uploads/${img.nom_fichier}`,
          alt: img.titre || '',
        }))}
        render={{
          slide: () => {
            const img = images[index];
            return (
              <div className="flex flex-col items-center justify-center h-full">
                <Image
                  src={`/uploads/${img.nom_fichier}`}
                  alt={img.titre || ''}
                  width={800}
                  height={600}
                  className="max-h-[70vh] max-w-full rounded-lg"
                />
                {img.titre ? (
                  <div className="mt-4 text-lg font-bold text-white">{img.titre}</div>
                ) : null}
                {img.description ? (
                  <div className="mt-2 text-base text-white">{img.description}</div>
                ) : null}
              </div>
            );
          },
        }}
      />
    </section>
  );
}
