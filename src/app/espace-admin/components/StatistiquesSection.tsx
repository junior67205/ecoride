'use client';

import { useState, useEffect } from 'react';

interface Statistiques {
  covoituragesParJour: Array<{ date: string; nombre: number }>;
  creditsParJour: Array<{ date: string; credits_gagnes: number }>;
  totalCredits: number;
}

// Fonctions utilitaires pour la gestion des semaines
function getWeekString(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

  let year = d.getUTCFullYear();
  if (weekNo >= 52 && date.getMonth() === 0) {
    year--;
  }
  if (weekNo === 1 && date.getMonth() === 11) {
    year++;
  }

  return `${year}-W${String(weekNo).padStart(2, '0')}`;
}

function getDatesFromWeek(weekString: string) {
  const [year, weekNum] = weekString.split('-W').map(Number);
  const d = new Date(Date.UTC(year, 0, 1 + (weekNum - 1) * 7));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 1 - day); // Lundi
  const startDate = new Date(d);
  const endDate = new Date(startDate);
  endDate.setUTCDate(startDate.getUTCDate() + 6); // Dimanche
  return { startDate, endDate };
}

const formatDate = (date: Date) => date.toISOString().split('T')[0];

type ChartData = {
  date: string;
  nombre?: number;
  credits_gagnes?: number;
};

const Chart = ({ data, color, unit }: { data: ChartData[]; color: string; unit: string }) => {
  const maxValue = Math.max(...data.map(item => item.nombre || item.credits_gagnes || 0), 1);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{unit} par jour</h3>
      <div className="flex justify-around items-end h-64 pt-6 space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center w-12 text-center h-full">
            <div className="relative w-full flex-grow flex items-end justify-center">
              <div
                className={`w-8 ${color} rounded-t-md transition-all duration-500`}
                style={{
                  height: `${((item.nombre || item.credits_gagnes || 0) / maxValue) * 100}%`,
                }}
              ></div>
              <span className="absolute -top-5 text-xs font-semibold text-gray-700">
                {item.nombre || item.credits_gagnes || 0}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {new Date(item.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function StatistiquesSection() {
  const [statistiques, setStatistiques] = useState<Statistiques | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(() => getWeekString(new Date()));

  const fetchStatistiques = async (week: string) => {
    setLoading(true);
    setError(null);
    try {
      const { startDate, endDate } = getDatesFromWeek(week);
      const params = new URLSearchParams({
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      });

      const response = await fetch(`/api/espace-admin/statistiques?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques');
      }
      const data = await response.json();
      setStatistiques(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistiques(selectedWeek);
  }, [selectedWeek]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Statistiques</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="week-picker" className="text-sm font-medium">
            Semaine
          </label>
          <input
            type="week"
            id="week-picker"
            value={selectedWeek}
            onChange={e => setSelectedWeek(e.target.value)}
            className="p-2 border rounded-md shadow-sm"
          />
        </div>
      </div>

      {loading && <p className="text-center py-10">Chargement des données...</p>}
      {error && <p className="text-red-500 text-center py-10">{error}</p>}

      {!loading && !error && statistiques && (
        <>
          <div className="bg-primary-light border border-primary rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-primary mb-2">
              Total des crédits de la plateforme
            </h3>
            <p className="text-3xl font-bold text-primary">
              {Number(statistiques.totalCredits).toFixed(2)} crédits
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Chart
              data={statistiques.covoituragesParJour}
              color="bg-green-500"
              unit="Covoiturages"
            />
            <Chart data={statistiques.creditsParJour} color="bg-blue-500" unit="Crédits gagnés" />
          </div>
        </>
      )}
    </div>
  );
}
