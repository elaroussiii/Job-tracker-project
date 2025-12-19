# Job Internship Tracker

## Description

**Job Internship Tracker** est une application web full-stack conçue pour faciliter la gestion et le suivi des candidatures de stages et d’emplois.  
Elle propose un tableau de bord interactif permettant d’organiser les candidatures, de visualiser leur statut, et de rechercher des offres d’emploi via l’API **Adzuna**.

Ce projet s’inscrit dans un cadre pédagogique, visant à développer des compétences full-stack avec une architecture claire Frontend / Backend et une base de données MySQL.

## Technologies utilisées

### Frontend

- HTML5, CSS3, JavaScript (Vanilla JS)
- Gestion dynamique des formulaires et affichage interactif

### Backend

- Node.js avec Express.js
- API RESTful pour la gestion des utilisateurs et candidatures

### Base de données

- MySQL (via XAMPP, port 3307)
- Migration progressive de MockAPI vers MySQL

### API externe

- Adzuna Job Search API pour la recherche d’offres d’emploi

---

## Structure du projet

job-internship-tracker/
├── backend/
│ ├── routes/
│ │ ├── users.js
│ │ └── applications.js
│ ├── services/
│ │ └── db.js
│ ├── config.js
│ ├── server.js
│ ├── tableCreateUsers.js
│ └── tableCreateApplications.js
├── frontend/
│ ├── index.html
│ ├── auth.html
│ ├── script.js
│ ├── auth.js
│ ├── style.css
│ ├── auth.css
│ └── pictures/
└── README.md

RouteLLM
Routing to GPT-4.1 Mini
Parfait, tu as déjà une bonne base ! Je vais te proposer une version plus professionnelle, claire, bien structurée et avec une mise en forme soignée, tout en gardant le contenu que tu as fourni.

README Professionnel pour Job Internship Tracker
markdown
Copy

# 🚀 Job Internship Tracker

![License](https://img.shields.io/badge/license-Pedagogical-blue) ![Node.js](https://img.shields.io/badge/Node.js-v18-green) ![MySQL](https://img.shields.io/badge/MySQL-v8.0-blue)

---

## 📖 Description

**Job Internship Tracker** est une application web full-stack conçue pour faciliter la gestion et le suivi des candidatures de stages et d’emplois.  
Elle propose un tableau de bord interactif permettant d’organiser les candidatures, de visualiser leur statut, et de rechercher des offres d’emploi via l’API **Adzuna**.

Ce projet s’inscrit dans un cadre pédagogique, visant à développer des compétences full-stack avec une architecture claire Frontend / Backend et une base de données MySQL.

---

## 🛠️ Technologies utilisées

### Frontend

- HTML5, CSS3, JavaScript (Vanilla JS)
- Gestion dynamique des formulaires et affichage interactif

### Backend

- Node.js avec Express.js
- API RESTful pour la gestion des utilisateurs et candidatures

### Base de données

- MySQL (via XAMPP, port 3307)
- Migration progressive de MockAPI vers MySQL

### API externe

- Adzuna Job Search API pour la recherche d’offres d’emploi

---

## 📁 Structure du projet

job-internship-tracker/
├── backend/
│ ├── routes/
│ │ ├── users.js
│ │ └── applications.js
│ ├── services/
│ │ └── db.js
│ ├── config.js
│ ├── server.js
│ ├── tableCreateUsers.js
│ └── tableCreateApplications.js
├── frontend/
│ ├── index.html
│ ├── auth.html
│ ├── script.js
│ ├── auth.js
│ ├── style.css
│ ├── auth.css
│ └── pictures/
└── README.md

## Fonctionnalités principales

### Authentification

- Inscription et connexion avec validation des champs
- Gestion de session via `localStorage`
- Protection des pages accessibles uniquement aux utilisateurs connectés

### Tableau de bord des candidatures

- Ajout, modification et suppression des candidatures
- Gestion des champs : entreprise, poste, type de contrat, statut, dates, lien vers l’offre, notes personnelles
- Filtrage par statut
- Statistiques automatiques par catégorie

### Recherche d’offres d’emploi

- Recherche par mot-clé, localisation et type de contrat
- Affichage des résultats sous forme de cartes
- Import automatique des offres dans le tracker via un bouton dédié
