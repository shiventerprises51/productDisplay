const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const pool = require("../config/db");

const JWT_SECRET = "your-jwt-secret-key";

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch admin credentials from the database
    const result = await pool`SELECT * FROM admin WHERE username = ${username}`;

    const admin = result[0]; // Get the admin record
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Directly compare the provided password with the stored password
    if (password !== admin.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token if login is successful
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send JWT token as response
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
