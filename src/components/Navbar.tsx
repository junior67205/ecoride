'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  const isEmploye = session?.user?.type === 'employe' || session?.user?.type === 'admin';

  return (
    <nav className="bg-white/95 border-b border-primary-light shadow-sm sticky top-0 z-50 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">
        {/* Logo / Nom du site */}
        <Link href="/" className="text-2xl font-extrabold text-primary flex items-center gap-2">
          EcoRide
        </Link>
        {/* Menu desktop */}
        <div className="hidden md:flex gap-8 items-center">
          <Link
            href="/"
            className="text-text hover:text-primary font-medium text-base transition-all duration-150"
          >
            Accueil
          </Link>
          <Link
            href="/covoiturages"
            className="text-text hover:text-primary font-medium text-base transition-all duration-150"
          >
            Covoiturages
          </Link>
          <Link
            href="/contact"
            className="text-text hover:text-primary font-medium text-base transition-all duration-150"
          >
            Contact
          </Link>
          {session ? (
            <>
              <Link
                href={isEmploye ? '/espace-employe' : '/mon-espace'}
                className="text-text hover:text-primary font-medium text-base transition-all duration-150"
              >
                Mon espace
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-text hover:text-primary font-medium text-base transition-all duration-150 bg-transparent border-none cursor-pointer"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/connexion"
                className="text-text hover:text-primary font-medium text-base transition-all duration-150"
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="text-text hover:text-primary font-medium text-base transition-all duration-150"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
        {/* Menu mobile burger */}
        <button
          className="md:hidden flex items-center text-primary focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Ouvrir le menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>
      {/* Menu mobile déroulant */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 border-t border-primary-light shadow px-4 pb-4 flex flex-col gap-3 animate-fade-in">
          <Link
            href="/"
            className="text-text hover:text-primary font-medium text-base transition-all duration-150"
            onClick={() => setMenuOpen(false)}
          >
            Accueil
          </Link>
          <Link
            href="/covoiturages"
            className="text-text hover:text-primary font-medium text-base transition-all duration-150"
            onClick={() => setMenuOpen(false)}
          >
            Covoiturages
          </Link>
          <Link
            href="/contact"
            className="text-text hover:text-primary font-medium text-base transition-all duration-150"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
          {session ? (
            <>
              <Link
                href={isEmploye ? '/espace-employe' : '/mon-espace'}
                className="text-text hover:text-primary font-medium text-base transition-all duration-150"
                onClick={() => setMenuOpen(false)}
              >
                Mon espace
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="text-text hover:text-primary font-medium text-base transition-all duration-150 bg-transparent border-none cursor-pointer text-left w-full py-2"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/connexion"
                className="text-text hover:text-primary font-medium text-base transition-all duration-150"
                onClick={() => setMenuOpen(false)}
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="text-text hover:text-primary font-medium text-base transition-all duration-150"
                onClick={() => setMenuOpen(false)}
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
