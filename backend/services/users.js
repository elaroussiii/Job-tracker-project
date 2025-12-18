const db = require("./db");

// Récupérer un utilisateur par email + mot de passe (pour login)
async function getByEmailAndPassword(email, password) {
  const rows = await db.query(
    "SELECT id, email FROM users WHERE email = ? AND password = ?",
    [email, password]
  );
  return rows[0] || null;
}

// Récupérer un utilisateur par email (pour vérifier s'il existe déjà)
async function getByEmail(email) {
  const rows = await db.query("SELECT id, email FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0] || null;
}

// Créer un utilisateur (pour signup)
async function createUser(email, password) {
  const result = await db.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, password]
  );
  return { id: result.insertId, email };
}

module.exports = {
  getByEmailAndPassword,
  getByEmail,
  createUser,
};
