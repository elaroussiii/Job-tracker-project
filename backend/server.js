// backend/server.js
// Charge les variables d'environnement à partir du fichier .env
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // Pour Node < 18 : apporte la fonction fetch côté serveur

// Importation des routes
const usersRouter = require("./routes/users");
const applicationsRouter = require("./routes/applications");

const app = express();
const port = process.env.PORT || 3001;

// Identifiants de l'API Adzuna récupérés depuis les variables d'environnement
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

// Middlewares globaux : CORS et parsing JSON
app.use(cors());
app.use(express.json());

// Routes API
app.use("/api/users", usersRouter);
app.use("/api/applications", applicationsRouter);

// Route pour rechercher des offres d'emploi via l'API Adzuna
app.get("/api/jobs/search", async (req, res) => {
  try {
    const { what = "developer", where = "Paris", contract = "" } = req.query;
    const baseUrl = `https://api.adzuna.com/v1/api/jobs/fr/search/1`;
    const url =
      `${baseUrl}?app_id=${ADZUNA_APP_ID}` +
      `&app_key=${ADZUNA_APP_KEY}` +
      `&what=${encodeURIComponent(what)}` +
      `&where=${encodeURIComponent(where)}` +
      `&results_per_page=20` +
      `&content-type=application/json` +
      (contract ? `&contract=${encodeURIComponent(contract)}` : "");

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Adzuna error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching jobs from Adzuna:", err.message || err);
    res.status(500).json({ error: "Error fetching jobs from Adzuna" });
  }
});

// Gestion d'erreurs globale
app.use((err, req, res, next) => {
  console.error(err && err.message ? err.message : err);
  res.status(500).json({ error: "Internal server error" });
});

// Démarrage du serveur Express
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
