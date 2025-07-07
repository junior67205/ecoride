'use client';

import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
import Footer from '../components/Footer';
import GalerieGrid from './components/GalerieGrid';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [showGalerie, setShowGalerie] = useState(false);

  useEffect(() => {
    fetch('/api/config/galerie')
      .then(res => res.json())
      .then(data => setShowGalerie(data.afficher));
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-background">
      {/* Hero section avec image de fond */}
      <section className="relative w-full h-[380px] flex flex-col items-center justify-center text-white">
        <Image
          src="/hero-bg.jpg"
          alt="Fond volant voiture"
          fill
          className="object-cover object-center absolute inset-0 z-0 opacity-70"
          priority
        />
        <div className="relative z-10 flex flex-col items-center w-full px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-center drop-shadow-lg">
            TROUVEZ
            <br />
            <span className="text-primary">UN COVOITURAGE</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-center drop-shadow">
            La solution accessible et durable pour tous
          </p>
          <div className="w-full max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Section conducteur */}
      <section className="bg-primary text-white py-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Vous avez une voiture&nbsp;?</h2>
        <p className="mb-6">
          Faites des économies sur vos déplacements, publiez une annonce de covoiturage&nbsp;!
        </p>
        <button className="bg-white text-primary font-semibold px-6 py-3 rounded shadow transition hover:bg-primary-light hover:text-primary">
          Proposer des places
        </button>
      </section>

      {/* Comment ça marche - version intégrée */}
      <section className="py-16 px-4 w-full bg-primary-light">
        <h2 className="text-2xl font-bold text-center mb-10 text-primary">
          Comment ça marche&nbsp;?
        </h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-4xl mx-auto">
          {/* Étape 1 */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center flex-1 min-h-[200px]">
            <span className="text-4xl mb-2">🔍</span>
            <h3 className="font-semibold text-primary mb-1">1. Recherchez un trajet</h3>
            <p className="text-text-secondary text-center text-sm">
              Trouvez rapidement un trajet adapté à vos besoins.
            </p>
          </div>
          {/* Étape 2 */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center flex-1 min-h-[200px]">
            <span className="text-4xl mb-2">📝</span>
            <h3 className="font-semibold text-primary mb-1">2. Réservez votre place</h3>
            <p className="text-text-secondary text-center text-sm">
              Réservez en quelques clics et contactez le conducteur.
            </p>
          </div>
          {/* Étape 3 */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center flex-1 min-h-[200px]">
            <span className="text-4xl mb-2">🚗</span>
            <h3 className="font-semibold text-primary mb-1">3. Partagez la route</h3>
            <p className="text-text-secondary text-center text-sm">
              Voyagez ensemble et partagez les frais du trajet.
            </p>
          </div>
          {/* Étape 4 */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center flex-1 min-h-[200px]">
            <span className="text-4xl mb-2">🌱</span>
            <h3 className="font-semibold text-primary mb-1">
              4. Économisez et agissez pour la planète
            </h3>
            <p className="text-text-secondary text-center text-sm">
              Réduisez votre impact environnemental à chaque trajet.
            </p>
          </div>
        </div>
      </section>

      {/* Nos engagements - style cartes modernes */}
      <section className="w-full bg-[#f9fefa] py-16 px-4">
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-3xl font-extrabold text-primary text-center mb-10">
            Nos engagements
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Carte 1 */}
            <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-start border border-primary-light hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-primary mb-4 leading-tight">
                Réduire l&apos;impact environnemental
              </h3>
              <p className="text-text text-base">
                EcoRide s&apos;engage à diminuer la pollution liée aux déplacements en encourageant
                le covoiturage exclusivement en voiture. Chaque trajet partagé contribue à préserver
                notre planète.
              </p>
            </div>
            {/* Carte 2 */}
            <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-start border border-primary-light hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-primary mb-4 leading-tight">
                Approche écologique
              </h3>
              <p className="text-text text-base">
                Nous prônons une mobilité plus verte et responsable, pour un avenir durable et
                respectueux de l&apos;environnement. EcoRide place l&apos;écologie au cœur de sa
                mission.
              </p>
            </div>
            {/* Carte 3 */}
            <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-start border border-primary-light hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-primary mb-4 leading-tight">
                Covoiturage accessible
              </h3>
              <p className="text-text text-base">
                Notre ambition est de devenir la plateforme de référence pour tous les voyageurs
                soucieux de l&apos;environnement et de leur budget, en rendant le covoiturage
                simple, économique et sécurisé.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie d'images pilotée par l'admin */}
      {showGalerie && <GalerieGrid />}

      <Footer />
    </main>
  );
}
