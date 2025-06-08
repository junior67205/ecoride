import CovoiturageCard, { Covoiturage } from './CovoiturageCard';

interface CovoiturageResultsProps {
  results: Covoiturage[];
}

export default function CovoiturageResults({ results }: CovoiturageResultsProps) {
  if (!results.length) return null;
  return (
    <div className="flex flex-col gap-6">
      {results.map((covoit, idx) => (
        <CovoiturageCard key={idx} covoiturage={covoit} />
      ))}
    </div>
  );
}
