# ShopFlow

**ShopFlow** est une application e-commerce Full-Stack construite avec React, Vite, Node.js, Express et MongoDB. Le dépôt est organisé en monorepo avec un frontend et une API backend.

## Fonctionnalités

- Catalogue de produits et consultation des fiches produit.
- Panier et processus de commande.
- Gestion des comptes et des sessions.
- Gestion des produits et des commandes côté administration.
- Gestion des images produits avec Cloudinary.
- API REST avec validation des données et protections de sécurité.
- Gestion du stock et des commandes avec transactions MongoDB.

> Les fonctionnalités exactes disponibles dépendent de l'état du code sur la branche principale.

## Stack technique

| Partie | Technologies |
|---|---|
| Frontend | React, React Router, Vite |
| Backend | Node.js, Express |
| Base de données | MongoDB, Mongoose |
| Validation | Zod |
| Sécurité | Helmet, express-rate-limit, Argon2 |
| Médias | Cloudinary |
| Qualité | ESLint, Node.js Test Runner |

## Structure du dépôt

```text
ShopFlow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/
│   │   └── utils/
│   ├── test/
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env.example
│   └── vite.config.js
├── .env.example
├── package.json
└── package-lock.json
```

## Prérequis

- Node.js 20.19+ ou 22.12+ (version compatible avec Vite 8).
- npm.
- Une instance MongoDB configurée en replica set pour les opérations transactionnelles. MongoDB Atlas est une option adaptée.
- Un compte Cloudinary pour le stockage des images produits.

## Installation

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/lux-26/ShopFlow.git
   cd ShopFlow
   ```

2. Installez les dépendances du projet et du backend :

   ```bash
   npm install
   cd backend
   npm install
   cd ..
   ```

3. Configurez les variables d'environnement du backend :

   ```bash
   cp .env.example .env
   ```

   Renseignez au minimum `MONGODB_URI` et une valeur forte et unique pour `JWT_SECRET`. Complétez les identifiants Cloudinary pour activer l'envoi des images. Ne publiez jamais le fichier `.env`.

4. Configurez le frontend :

   ```bash
   cp frontend/.env.example frontend/.env.local
   ```

   En développement local, conservez `VITE_API_URL=/api` : le proxy Vite transmet les requêtes à l'API locale.

## Lancement en développement

Ouvrez deux terminaux depuis la racine du dépôt.

**Terminal 1 — API backend :**

```bash
npm run server
```

**Terminal 2 — frontend React :**

```bash
npm run dev
```

Le frontend est disponible sur http://localhost:5173 et l'API sur http://localhost:5000.

## Scripts disponibles

Depuis la racine :

| Commande | Description |
|---|---|
| `npm run dev` | Démarre Vite |
| `npm run server` | Démarre l'API en mode watch |
| `npm start` | Démarre l'API |
| `npm run build` | Génère le build frontend |
| `npm run preview` | Prévisualise le build |
| `npm run lint` | Lance ESLint |
| `npm test` | Lance les tests backend |
| `npm run seed:admin` | Crée un compte administrateur initial |

Pour créer le compte administrateur, renseignez `ADMIN_NAME`, `ADMIN_EMAIL` et `ADMIN_PASSWORD` dans le fichier d'environnement, puis exécutez la commande une seule fois.

## Configuration de production

- Déployez le frontend et l'API selon votre architecture d'hébergement.
- Définissez `VITE_API_URL` avec l'URL publique de l'API avant le build frontend.
- Définissez `CLIENT_URL` côté backend avec l'origine exacte du frontend.
- Configurez MongoDB en replica set pour permettre les transactions.
- Configurez les secrets dans le gestionnaire de variables d'environnement de l'hébergeur, jamais dans Git.
- Activez les sauvegardes MongoDB, la surveillance des erreurs et la rotation des journaux.
- Vérifiez les domaines autorisés pour CORS et les cookies de session en HTTPS.

## Tests et qualité

Les commandes suivantes sont définies dans le projet :

```bash
npm test
npm run lint
npm run build
```

L'existence des scripts ne garantit pas à elle seule que tous les tests passent. Exécutez-les dans un environnement configuré avant chaque mise en production.

## Sécurité

- Ne commitez jamais `.env`, les identifiants Cloudinary, les clés API ou les mots de passe.
- Utilisez une valeur `JWT_SECRET` longue, aléatoire et propre à chaque environnement.
- N'utilisez pas les identifiants de démonstration en production.
- Limitez les permissions des comptes et services externes au strict nécessaire.

## Auteur

Développé par **Ablaye Tamba** — [GitHub @lux-26](https://github.com/lux-26).
