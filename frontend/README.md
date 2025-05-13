# Frontend Mentorat - Application React avec React Router

## Aperçu

Ce projet frontend est conçu pour s'intégrer avec notre backend d'authentification robuste. Il utilise React avec React Router pour créer une expérience utilisateur fluide et réactive.

## Technologies utilisées

- ⚛️ **React** - Bibliothèque JavaScript pour construire des interfaces utilisateur
- 🚦 **React Router** - Navigation et routage côté client
- ⚡ **Vite** - Outil de build ultra-rapide pour le développement moderne
- 🎨 **TailwindCSS** - Framework CSS utilitaire pour un design personnalisé
- 🔄 **Axios** - Client HTTP pour les requêtes API
- 🔒 **JWT** - Gestion des tokens pour l'authentification

## Fonctionnalités

- 🔐 Système d'authentification complet (inscription, connexion, déconnexion)
- ✉️ Vérification d'email
- 👤 Gestion de profil utilisateur
- 🔄 Rafraîchissement automatique des tokens
- 🛡️ Protection des routes privées
- 📱 Design responsive pour tous les appareils

## Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

## Installation

1. Clonez le dépôt :

```bash
git clone <url-du-repo>
cd mentorat/frontend
```

2. Installez les dépendances :

```bash
npm install
```

## Configuration

Créez un fichier `.env` à la racine du projet frontend avec les variables suivantes :

```
VITE_API_URL=http://localhost:5000/api/v1
```

## Développement

Lancez le serveur de développement :

```bash
npm run dev
```

L'application sera disponible à l'adresse `http://localhost:5173`.

## Structure du projet

```
frontend/
├── public/              # Ressources statiques
├── src/
│   ├── assets/          # Images, polices, etc.
│   ├── components/      # Composants réutilisables
│   │   ├── auth/        # Composants d'authentification
│   │   ├── common/      # Composants communs (boutons, inputs, etc.)
│   │   └── layout/      # Composants de mise en page
│   ├── hooks/           # Hooks personnalisés
│   ├── pages/           # Pages de l'application
│   ├── services/        # Services (API, auth, etc.)
│   ├── store/           # Gestion d'état global
│   ├── utils/           # Fonctions utilitaires
│   ├── App.jsx          # Composant racine
│   ├── main.jsx         # Point d'entrée
│   └── routes.jsx       # Configuration des routes
└── index.html           # Template HTML
```

## Construction pour la production

Pour créer une version optimisée pour la production :

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`.

## Déploiement

### Avec Docker

```bash
docker build -t mentorat-frontend .
docker run -p 80:80 mentorat-frontend
```

### Déploiement manuel

Vous pouvez déployer le contenu du dossier `dist/` sur n'importe quel service d'hébergement statique comme Netlify, Vercel, ou GitHub Pages.

## Intégration avec le backend

Cette application frontend est conçue pour fonctionner avec notre API backend. Assurez-vous que le backend est en cours d'exécution et accessible à l'URL spécifiée dans votre fichier `.env`.

## Fonctionnalités de cache

L'application utilise des stratégies de mise en cache côté client pour optimiser les performances :

- Mise en cache des données utilisateur
- Stockage sécurisé des tokens d'authentification
- Gestion intelligente des requêtes API

## Contribution

1. Créez une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
2. Committez vos changements (`git commit -m 'Ajout d'une fonctionnalité incroyable'`)
3. Poussez vers la branche (`git push origin feature/amazing-feature`)
4. Ouvrez une Pull Request

## Licence

Ce projet est sous licence [MIT](LICENSE).

---

Développé avec ❤️ pour le projet Mentorat.

