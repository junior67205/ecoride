# EcoRide

**Plateforme de covoiturage écologique – Projet de titre professionnel Développeur Web & Web Mobile**

---

## Présentation

EcoRide est une application web de covoiturage dédiée à la réduction de l'impact environnemental des déplacements en voiture.  
Ce projet a été réalisé dans le cadre du titre professionnel Développeur Web et Web Mobile.

---

## Prérequis

- Node.js (version 18 ou supérieure)
- npm (version 9 ou supérieure)
- MySQL (pour la base de données relationnelle)
- (Optionnel) MongoDB (pour la partie NoSQL)
- Git

---

## Installation

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/votre-utilisateur/ecoride.git
   cd ecoride
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**

   - Copier le fichier `.env.example` en `.env` et renseigner vos informations (base de données, etc.)

4. **Créer la base de données**

   - Importer le fichier `sql/create_db.sql` dans votre MySQL :
     ```bash
     mysql -u root -p < sql/create_db.sql
     ```
   - (Optionnel) Ajouter des données de test :
     ```bash
     mysql -u root -p < sql/seed_db.sql
     ```

5. **Lancer les migrations Prisma**

   ```bash
   npx prisma migrate dev
   ```

6. **Démarrer l'application**
   ```bash
   npm run dev
   ```
   L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

---

## Lancer les tests

```bash
npm test
```

---

## Scripts utiles

- `npm run dev` : Lancer le serveur de développement
- `npm run build` : Générer la version de production
- `npm run lint` : Vérifier la qualité du code
- `npm run format` : Formater le code avec Prettier

---

## Déploiement

Pour déployer l'application sur un serveur ou une plateforme cloud (Vercel, Netlify, etc.), suivre la documentation technique dans `/docs/documentation-technique.pdf`.

---

## Aide

Pour toute question, contactez l'équipe EcoRide ou consultez la documentation dans le dossier `/docs`.

---
