require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // si tu as Node < 18, sinon tu peux enlever et utiliser global fetch

const app = express();
const port = process.env.PORT || 3001;

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

app.use(cors());
app.use(express.json());

// 🔍 Route de recherche d'offres via Adzuna
app.get("/api/jobs/search", async (req, res) => {
  try {
    const { what = "developer", where = "Paris", contract = "" } = req.query;

    // Pays "fr" pour France, tu peux changer ensuite
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

    // On renvoie directement ce que donne Adzuna pour le moment
    res.json(data);
  } catch (err) {
    console.error("Error fetching jobs from Adzuna:", err.message);
    res.status(500).json({ error: "Error fetching jobs from Adzuna" });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
