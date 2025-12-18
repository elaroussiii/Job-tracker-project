# Job Internship Tracker

 Description

Job Internship Tracker  est une application web permettant de suivre et gérer ses candidatures de stages et d’emplois.
Elle offre un tableau de bord interactif pour organiser les candidatures, visualiser leur statut et rechercher des offres directement via l’API **Adzuna**.

Le projet repose sur une architecture **Frontend / Backend** avec une base de données **MySQL**, et s’inscrit dans un cadre pédagogique et de montée en compétences full-stack.

---

## 🛠️ Technologies utilisées

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla JS)

### Backend

* Node.js
* Express.js

### Base de données

* MySQL (via XAMPP)
* MockAPI (utilisée temporairement, en cours de migration vers MySQL)

### API externe

* Adzuna Job Search API

---

## 🗂️ Architecture du projet

### 📁 Frontend (dossier racine)

* **index.html**
  Tableau de bord principal :

  * Liste des candidatures
  * Statistiques
  * Formulaire d’ajout/édition dans un modal
  * Barre de recherche d’offres (Adzuna)

* **auth.html**
  Page d’authentification :

  * Login / Sign Up
  * Bascule dynamique entre les formulaires

* **script.js**

  * CRUD des candidatures via API backend / MockAPI
  * Appels à l’API backend Adzuna (`/api/jobs/search`)
  * Filtrage par statut
  * Statistiques automatiques
  * Gestion de la déconnexion

* **auth.js**

  * Logique de connexion et d’inscription
  * Gestion de l’état utilisateur

* **style.css**
  Styles globaux (navbar, cartes, stats, modals, grid…)

* **auth.css**
  Styles spécifiques à la page d’authentification

* **pictures/**
  Logo et assets visuels

---

### 📁 Backend (`backend/`)

* **.env**
  Variables d’environnement :

  * Port du serveur
  * Clés API Adzuna

* **server.js**
  Serveur Express principal avec :

  * `GET /api/health` → test de santé du backend
  * `GET /api/jobs/search` → proxy vers l’API Adzuna
  * *(À venir)* routes `/api/users` et `/api/applications` connectées à MySQL

---

## ⚙️ Fonctionnalités

 Authentification (Front-end)

* Login et Sign Up avec bascule dynamique
* Validation basique des champs
* Sauvegarde de la session dans `localStorage`
* Protection des pages (redirection si non connecté)

---

### 📊 Tableau de bord des candidatures

* Ajout, modification et suppression de candidatures
* Champs gérés :

  * Entreprise
  * Poste
  * Type de contrat
  * Statut (sent / interview / rejected / accepted)
  * Dates
  * Lien vers l’offre
  * Notes personnelles
* Filtrage par statut
* Statistiques automatiques par catégorie

---

### 🔎 Recherche d’offres (Adzuna)

* Recherche par :

  * Mot-clé
  * Localisation
  * Type de contrat
* Affichage des offres sous forme de cartes
* Bouton **“Import to Tracker”** :

  * Pré-remplit automatiquement le formulaire de candidature à partir d’une offre Adzuna

---

## 🚀 Installation et lancement du projet

### 1️⃣ Cloner le projet

```bash
git clone <url-du-repo>
cd job-internship-tracker
```

### 2️⃣ Lancer le backend

```bash
cd backend
npm install
node server.js
```

### 3️⃣ Configurer l’environnement

Créer un fichier `.env` dans le dossier `backend` :

```
PORT=3000
ADZUNA_APP_ID=your_app_id
ADZUNA_APP_KEY=your_app_key
```

### 4️⃣ Base de données

* Lancer **XAMPP**
* Activer **Apache** et **MySQL**
* (Migration MockAPI → MySQL en cours)

### 5️⃣ Lancer le frontend

* Ouvrir `auth.html` ou `index.html` dans le navigateur
  *(ou via Live Server)*




## 📄 Licence

Projet à usage pédagogique.
