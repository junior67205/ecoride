export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-center py-4 mt-8 border-t">
      <p>
        Contact :{' '}
        <a href="mailto:contact@ecoride.fr" className="underline">
          contact@ecoride.fr
        </a>
      </p>
      <p>
        <a href="/mentions-legales" className="text-blue-600 underline">
          Mentions légales
        </a>
      </p>
      <p className="text-sm text-gray-600 mt-2">© {currentYear} EcoRide - Tous droits réservés</p>
    </footer>
  );
}
