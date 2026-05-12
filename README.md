# 📚 BiblioApp - Version Web (React.js)

Une mini bibliothèque en ligne pour découvrir des livres et gérer ses favoris, développée avec **React.js** et **Vite**.

## 📖 Description

BiblioApp est une application web qui permet de :
- Parcourir un catalogue de livres
- Ajouter ses livres préférés aux favoris
- Créer un compte et se connecter
- Consulter son profil personnel

## 🛠️ Prérequis

- **Node.js** version 18 ou plus (https://nodejs.org)
- **npm** (installé avec Node.js)

## 🚀 Installation

1. Cloner le dépôt (ou dézipper le projet) :
```bash
git clone <url-de-votre-depot>
cd biblio-web
```

2. Installer les dépendances :
```bash
npm install
```

## ▶️ Lancement

Pour démarrer l'application en mode développement :
```bash
npm run dev
```

L'application s'ouvre sur **http://localhost:5173**

Pour construire la version de production :
```bash
npm run build
```

## ✨ Fonctionnalités

- 🏠 **Accueil** : page d'accueil avec présentation de l'application
- 📖 **Catalogue** : liste de 8 livres avec barre de recherche par titre/auteur
- ⭐ **Favoris** : gestion des livres favoris (ajout/suppression)
- 🔐 **Connexion** : authentification avec validation des champs et focus automatique
- ✍️ **Inscription** : création de compte avec validation complète (email, mot de passe fort)
- 👤 **Profil** : affichage des infos utilisateur et statistiques

## 🎣 Hooks React utilisés

| Hook | Utilisation |
|------|-------------|
| `useState` | Gestion des états locaux (formulaires, recherche, chargement) dans toutes les pages |
| `useEffect` | Chargement initial du catalogue, focus automatique, redirection si non connecté |
| `useContext` | Partage de l'utilisateur connecté et des favoris via `AuthContext` |
| `useRef` | Focus automatique sur les champs de formulaire dans `Connexion.jsx` et `Inscription.jsx` |

## 🗺️ Navigation (React Router DOM v6)

L'application utilise **React Router DOM** pour la navigation :
- `<BrowserRouter>` enveloppe l'application
- `<Routes>` et `<Route>` définissent les routes
- `<Link>` pour les liens de navigation
- `useNavigate()` pour les redirections programmatiques
- `useLocation()` pour le lien actif dans la navbar

## 📂 Structure du projet

```
biblio-web/
├── package.json
├── vite.config.js
├── index.html
├── README.md
└── src/
    ├── main.jsx              # Point d'entrée
    ├── App.jsx               # Routeur principal
    ├── App.css
    ├── index.css
    ├── context/
    │   └── AuthContext.jsx   # Contexte global (utilisateur + favoris)
    ├── components/
    │   ├── Navbar.jsx        # Barre de navigation
    │   └── LivreCard.jsx     # Carte d'un livre
    ├── data/
    │   └── livres.js         # Données des livres (8 livres)
    └── pages/
        ├── Accueil.jsx
        ├── Catalogue.jsx
        ├── Favoris.jsx
        ├── Connexion.jsx
        ├── Inscription.jsx
        └── Profil.jsx
```

## 🎨 Thème

- Couleur principale : **violet** (#7c3aed)
- Couleur d'accent : **doré** (#fbbf24)

## 🧪 Test de l'application

1. Aller sur **Inscription** et créer un compte (ex : `test@test.com` / `Test123!`)
2. Aller sur **Connexion** et se connecter avec ces identifiants
3. Aller sur **Catalogue** et ajouter quelques livres aux favoris
4. Vérifier dans **Favoris** que les livres apparaissent
5. Aller sur **Profil** pour voir vos infos

---

Projet réalisé dans le cadre d'un devoir scolaire (Module React).
