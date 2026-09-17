# ShopFlow

Application e-commerce MERN organisée en monorepo :

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    scripts/
    utils/
  uploads/
frontend/
  public/
  src/
```

## Développement

Installez les dépendances puis configurez le fichier `.env` à la racine.

```bash
npm install
npm run dev       # Frontend Vite
npm run server    # API Express avec watch
```

Autres commandes disponibles :

```bash
npm run build
npm run preview
npm run lint
npm run seed:admin
```

Le frontend est servi sur `http://localhost:5173` et l'API sur
`http://localhost:5000`. Le proxy Vite transmet `/api` et `/uploads` à l'API
pendant le développement.

La base URL de l'API est configurée par `VITE_API_URL`. Copiez
`frontend/.env.example` vers `frontend/.env.local` pour un réglage local. Pour
une mise en production avec un backend séparé, définissez par exemple :

```env
VITE_API_URL=https://api.exemple.com/api
```

Cette variable est injectée au moment du build frontend ; après toute
modification, relancez `npm run build` ou redémarrez Vite.

Lorsque le frontend et le backend sont déployés sur deux domaines HTTPS
différents, définissez aussi `CLIENT_URL` sur l'URL du frontend côté backend.
Le serveur active alors automatiquement un cookie de session compatible
cross-site (`SameSite=None; Secure`).

## Exploitation et production

La création d'une commande utilise une transaction MongoDB pour réserver le
stock, créer la commande, débiter les points fidélité et créer la notification
de façon atomique. MongoDB doit donc être exécuté en replica set ; MongoDB
Atlas convient par défaut.

Avant la mise en ligne :

- activer les sauvegardes automatiques et les sauvegardes ponctuelles MongoDB
  (avec une rétention adaptée) ;
- surveiller `/api/health`, les erreurs HTTP 5xx, les redémarrages du processus
  et la saturation de la base ;
- centraliser les logs côté hébergeur sans journaliser de mots de passe, tokens
  ou données d'authentification ;
- tester régulièrement la restauration d'une sauvegarde.

Les tests backend se lancent avec :

```bash
npm test
```
