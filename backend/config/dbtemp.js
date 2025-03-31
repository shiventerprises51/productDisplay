const { Pool } = require("pg");

// Create a new pool for PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;

// user: "postgres", // Replace with your PostgreSQL username
//   host: "localhost",
//   database: "product_management", // The database you created
//   password: "yourpassword", // Replace with your PostgreSQL password
//   port: 5432,
