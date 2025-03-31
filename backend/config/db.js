const { neon } = require("@neondatabase/serverless");
require("dotenv").config();

const pool = neon(process.env.DATABASE_URL);

module.exports = pool;
