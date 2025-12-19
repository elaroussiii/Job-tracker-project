const config = {
  db: {
    host: "127.0.0.1",
    user: "root",
    password: "", // <-- si tu as un mot de passe, écris-le ici
    database: "job_tracker",
    port: 3307,
  },
  listPerPage: 10,
};

module.exports = config;
