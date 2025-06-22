import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Génère un numéro de dossier unique pour les problèmes signalés
 * Format: DOS-YYYYMMDD-XXXX (ex: DOS-20241222-0001)
 */
export function generateNumeroDossier(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const datePart = `${year}${month}${day}`;

  // Générer un numéro séquentiel basé sur le timestamp
  const timestamp = Date.now();
  const sequence = String(timestamp % 10000).padStart(4, '0');

  return `DOS-${datePart}-${sequence}`;
}
