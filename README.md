# 🕹️ Retro Games Library

Une application moderne de gestion de bibliothèque de jeux retro avec un look **Synthwave / Cyberpunk**.

## 🚀 Stack Technique

- **Backend** : Django 6.0, Django REST Framework
- **Frontend** : React, Vite, Tailwind CSS, Framer Motion
- **Auth** : JWT (Simple JWT)
- **Design** : Custom Retro-Synthwave CSS, Lucide Icons

## 📂 Structure du Projet

- `game_library/` : Configuration globale du projet Django.
- `library/` : Application Django principale (Modèles, Views, API).
- `frontend/` : Application React (Interface utilisateur).

---

## 🛠️ Installation & Configuration

### 1. Backend (Django)

1. **Créer un environnement virtuel** :

   ```bash
   python -m venv env
   source env/bin/activate  # Sur Windows: env\Scripts\activate
   ```

2. **Installer les dépendances** :

   ```bash
   pip install -r requirements.txt
   ```

   _Note : weasyprint peut nécessiter des dépendances système supplémentaires (GTK)._

3. **Migrations et Superuser** :

   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

4. **Lancer le serveur** :
   ```bash
   python manage.py runserver
   ```

### 2. Frontend (React)

1. **Aller dans le dossier frontend** :

   ```bash
   cd frontend
   ```

2. **Installer les dépendances** :

   ```bash
   npm install
   ```

3. **Lancer en mode développement** :
   ```bash
   npm run dev
   ```

---

## 🔑 Fonctionnalités

- **Authentification JWT** : Connexion et inscription sécurisées.
- **Tableau de Bord** : Statistiques en temps réel sur la collection.
- **Gestion des Jeux** : Liste, ajout et gestion des genres.
- **Export PDF** : Génération de fiches de jeux.
- **Design Immersif** : Grille 3D animée, effets CRT, et animations fluides.

---

## 🎮 Instructions pour le prochain développeur

- **Style Global** : Les styles de base se trouvent dans `frontend/src/index.css`. Utilisez les variables CSS pour maintenir la cohérence des couleurs néon.
- **API** : Le frontend utilise une instance Axios configurée dans `frontend/src/api.js` qui injecte automatiquement le token JWT.
- **Récupération des données** : Les vues Django sont principalement des `APIView` ou des fonctions décorées avec `@api_view`.

---

## 📜 Licence

Projet créé pour la gestion ultime de jeux retro. Profitez bien ! 👾
