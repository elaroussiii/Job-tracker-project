// Charge les variables d'environnement à partir du fichier .env
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // Pour Node < 18 : apporte la fonction fetch côté serveur
//  Importation des routes utilisateurs
const usersRouter = require("./routes/users");
const app = express();
const port = process.env.PORT || 3001;

// Identifiants de l'API Adzuna récupérés depuis les variables d'environnement
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

// Middlewares globaux : CORS pour accepter les requêtes cross-origin,
// et parsing automatique du JSON reçu dans le body des requêtes.
app.use(cors());
app.use(express.json());
app.use("/api/users", usersRouter);

// Route pour rechercher des offres d'emploi via l'API Adzuna
app.get("/api/jobs/search", async (req, res) => {
  try {
    // Récupération des paramètres de recherche envoyés par le frontend, avec valeurs par défaut
    const { what = "developer", where = "Paris", contract = "" } = req.query;

    // Base de l'URL Adzuna (ici pour la France : 'fr')
    const baseUrl = `https://api.adzuna.com/v1/api/jobs/fr/search/1`;

    // Construction de l'URL complète avec les paramètres obligatoires + filtres
    const url =
      `${baseUrl}?app_id=${ADZUNA_APP_ID}` +
      `&app_key=${ADZUNA_APP_KEY}` +
      `&what=${encodeURIComponent(what)}` +
      `&where=${encodeURIComponent(where)}` +
      `&results_per_page=20` +
      `&content-type=application/json` +
      (contract ? `&contract=${encodeURIComponent(contract)}` : "");

    // Appel HTTP vers l'API Adzuna
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Adzuna error: ${response.status} ${response.statusText}`
      );
    }

    // Réponse JSON d'Adzuna (liste d'offres d'emploi et métadonnées)
    const data = await response.json();

    // Renvoi tel quel au frontend pour affichage
    res.json(data);
  } catch (err) {
    console.error("Error fetching jobs from Adzuna:", err.message);
    res.status(500).json({ error: "Error fetching jobs from Adzuna" });
  }
});

// Gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: "Internal server error" });
});

// Démarrage du serveur Express sur le port configuré
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
