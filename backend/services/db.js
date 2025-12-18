const mysql = require("mysql2/promise");
const config = require("../config");

// Fonction générique pour exécuter une requête SQL
async function query(sql, params) {
  const connection = await mysql.createConnection(config.db);
  const [results] = await connection.execute(sql, params);
  await connection.end();
  return results;
}

module.exports = {
  query,
};
