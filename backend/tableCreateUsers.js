const mysql = require("mysql2");
const config = require("./config");

const con = mysql.createConnection({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("✅ Connected to DB 'job_tracker'");

  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )
  `;

  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("✅ Table 'users' created or already exists.");
    con.end();
  });
});
