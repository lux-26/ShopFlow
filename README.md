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

## Déploiement

La configuration du dépôt prévoit un frontend statique sur **Vercel** et une API Express sur **Render**.

### Frontend — Vercel

Le fichier `vercel.json` configure déjà la commande de build et le dossier de sortie.

- Framework : Vite.
- Build command : `npm run build`.
- Output directory : `frontend/dist`.
- Root directory : racine du dépôt.
- Variable d'environnement à définir avant le build : `VITE_API_URL=https://shopflow-0agy.onrender.com/api`.

Le projet utilise cette variable au moment de la compilation du frontend. Après toute modification, un nouveau build et un redéploiement sont nécessaires.

### Backend — Render

Le serveur Express démarre avec `npm start` depuis la racine du dépôt.

- Build command : `npm ci && npm ci --prefix backend && npm run build`.
- Start command : `npm start`.
- Health check path : `/api/health`.
- Root directory : racine du dépôt.

Variables à configurer dans le tableau de bord Render :

| Variable | Valeur |
|---|---|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | URI MongoDB Atlas avec replica set |
| `JWT_SECRET` | Secret long, aléatoire et unique |
| `CLIENT_URL` | URL exacte du frontend Vercel, sans chemin final |
| `CLOUDINARY_CLOUD_NAME` | Identifiant du compte Cloudinary |
| `CLOUDINARY_API_KEY` | Clé API Cloudinary |
| `CLOUDINARY_API_SECRET` | Secret API Cloudinary |

Render fournit normalement la variable `PORT) automatiquement. Ne publiez jamais les valeurs secrètes dans le dépôt.

### Vérifications avant mise en production

1. Vérifier que `https://shopflow-0agy.onrender.com/api/health` renvoie un statut HTTP 200 et un JSON avec `status: "ok"`.
2. Vérifier que `CLIENT_URL` correspond exactement au domaine Vercel réellement utilisé. Le backend autorise aussi les domaines de prévisualisation correspondant au motif `shop-flow-*.vercel.app`.
3. Vérifier la connexion MongoDB et le fonctionnement des transactions avec une instance configurée en replica set.
4. Tester l'inscription, la connexion, la déconnexion et la persistance des cookies en HTTPS.
5. Tester l'ajout d'images via Cloudinary et la création d'une commande.
6. Activer les sauvegardes MongoDB et surveiller les journaux et erreurs du service.

Le dépôt contient le fichier Vercel, mais aucun fichier de déploiement Render. Les paramètres Render ci-dessus sont donc à renseigner ou à confirmer dans le tableau de bord du service existant.

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
