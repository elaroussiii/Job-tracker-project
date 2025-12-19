const mysql = require("mysql2");
const config = require("./config"); // idem que ton tableCreateUsers.js

const con = mysql.createConnection({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  port: config.db.port || 3306,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("✅ Connected to DB '" + config.db.database + "'");

  const sql = `
  CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    contract_type VARCHAR(100),
    status VARCHAR(100),
    apply_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `;

  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("✅ Table 'applications' created or already exists.");
    con.end();
  });
});
