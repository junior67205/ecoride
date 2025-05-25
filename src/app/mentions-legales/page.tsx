import Footer from '@/components/Footer';

export default function MentionsLegales() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="max-w-3xl mx-auto py-16 px-4 flex-grow">
        <h1 className="text-3xl font-bold text-primary mb-8">Mentions légales</h1>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Éditeur du site</h2>
          <p>
            <strong>EcoRide</strong>
            <br />
            123 rue de la Mobilité Verte
            <br />
            75000 Paris, France
            <br />
            Email :{' '}
            <a href="mailto:contact@ecoride.fr" className="text-primary underline">
              contact@ecoride.fr
            </a>
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Hébergement</h2>
          <p>
            Hébergeur : O2switch
            <br />
            222 Boulevard Gustave Flaubert
            <br />
            63000 Clermont-Ferrand, France
            <br />
            Site web :{' '}
            <a
              href="https://www.o2switch.fr"
              className="text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              o2switch.fr
            </a>
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus (textes, images, logos, etc.) présents sur le site EcoRide
            sont protégés par le droit d&apos;auteur. Toute reproduction, représentation,
            modification ou adaptation, totale ou partielle, est interdite sans l&apos;accord écrit
            préalable d&apos;EcoRide.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Données personnelles</h2>
          <p>
            Les informations recueillies via le site EcoRide font l&apos;objet d&apos;un traitement
            informatique destiné à la gestion des utilisateurs et des trajets. Conformément à la loi
            « Informatique et Libertés », vous disposez d&apos;un droit d&apos;accès, de
            rectification et de suppression des données vous concernant. Pour exercer ce droit,
            contactez-nous à l&apos;adresse{' '}
            <a href="mailto:contact@ecoride.fr" className="text-primary underline">
              contact@ecoride.fr
            </a>
            .
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Responsabilité</h2>
          <p>
            EcoRide ne saurait être tenu responsable des dommages directs ou indirects résultant de
            l&apos;accès ou de l&apos;utilisation du site, y compris l&apos;inaccessibilité, les
            pertes de données, et/ou la présence de virus sur le site.
          </p>
        </section>
      </div>
      <Footer />
    </main>
  );
}
