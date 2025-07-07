'use client';

import { useState, useEffect } from 'react';

export default function MaintenanceIndicator() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMaintenanceStatus = async () => {
      try {
        const response = await fetch('/api/maintenance/status');
        if (response.ok) {
          const { maintenanceMode } = await response.json();
          setMaintenanceMode(maintenanceMode);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du mode maintenance:', error);
      } finally {
        setLoading(false);
      }
    };

    checkMaintenanceStatus();

    // Vérifier le statut toutes les 30 secondes
    const interval = setInterval(checkMaintenanceStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return null;
  }

  if (!maintenanceMode) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <span className="font-semibold text-sm">Mode Maintenance Actif</span>
      </div>
    </div>
  );
}
