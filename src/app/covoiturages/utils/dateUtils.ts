export function formatDateFr(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.toLocaleDateString('fr-FR');
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d2] = dateStr.split('-');
    return `${d2}/${m}/${y}`;
  }
  return dateStr;
}

export function formatHeure(heure: string) {
  if (!heure) return '';
  if (heure.length > 5 && heure.includes('T')) {
    const d = new Date(heure);
    if (!isNaN(d.getTime()))
      return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
  return heure.slice(0, 5);
}

export function normalizeDate(dateStr: string | null): string {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  if (dateStr.includes('T')) return dateStr.slice(0, 10);
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [d, m, y] = dateStr.split('/');
    return `${y}-${m}-${d}`;
  }
  return dateStr;
}

export function getDureeHeuresSimple(covoit: { heure_depart: string; heure_arrivee: string }) {
  function toMinutes(heure: string) {
    if (!heure) return NaN;
    const [h, m] = heure.split(':');
    return parseInt(h, 10) * 60 + parseInt(m, 10);
  }
  if (!covoit.heure_depart || !covoit.heure_arrivee) return null;
  const dep = toMinutes(covoit.heure_depart);
  const arr = toMinutes(covoit.heure_arrivee);
  if (isNaN(dep) || isNaN(arr) || arr < dep) return null;
  const diff = arr - dep;
  return { h: Math.floor(diff / 60), m: diff % 60 };
}
