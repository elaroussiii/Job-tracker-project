const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("✅ Connected to MySQL!");

  const sql = "CREATE DATABASE IF NOT EXISTS job_tracker";

  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("✅ Database 'job_tracker' created or already exists.");
    con.end();
  });
});
