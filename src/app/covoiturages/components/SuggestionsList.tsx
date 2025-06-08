import CovoiturageCard, { Covoiturage } from './CovoiturageCard';

interface SuggestionsListProps {
  suggestions: Covoiturage[];
}

export default function SuggestionsList({ suggestions }: SuggestionsListProps) {
  if (!suggestions.length) return null;
  return (
    <div className="mt-8">
      <div className="text-center text-gray-600 mb-4">
        <p>Aucun covoiturage trouvé à cette date.</p>
        <p className="mt-2 text-primary font-semibold">
          Mais voici d&apos;autres dates où un trajet similaire est disponible :
        </p>
      </div>
      <div className="flex flex-col gap-6">
        {suggestions.map((sugg, idx) => (
          <CovoiturageCard key={idx} covoiturage={sugg} />
        ))}
      </div>
    </div>
  );
}
