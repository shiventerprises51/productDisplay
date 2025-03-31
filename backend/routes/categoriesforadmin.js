const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// Fetch all categories
router.get("/", async (req, res) => {
  try {
    const categories = await pool`SELECT * FROM categories`;
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Error fetching categories" });
  }
});

// Add a category
router.post("/", async (req, res) => {
  const { name, show = true } = req.body; // Default `show` to true if not provided

  try {
    const result = await pool`
      INSERT INTO categories (name, show) 
      VALUES (${name}, ${show}) 
      RETURNING *;
    `;
    res.json(result[0]);
  } catch (err) {
    console.error("Error adding category:", err);
    res.status(500).json({ error: "Error adding category" });
  }
});

// Delete a category
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool`
      DELETE FROM categories WHERE id = ${id} RETURNING *;
    `;
    if (result.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(result[0]);
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ error: "Error deleting category" });
  }
});

// Update a category
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, show } = req.body;

  if (!name && show === undefined) {
    return res.status(400).json({ error: "Name or show status is required" });
  }

  try {
    const result = await pool`
      UPDATE categories 
      SET 
        name = COALESCE(${name}, name), 
        show = COALESCE(${show}, show) 
      WHERE id = ${id} 
      RETURNING *;
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(result[0]);
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ error: "Error updating category" });
  }
});

// Toggle show status of a category
router.patch("/:id/toggle-show", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the current show status
    const category = await pool`
      SELECT show FROM categories WHERE id = ${id};
    `;

    if (category.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    const currentShowStatus = category[0].show;

    // Toggle the show status
    const result = await pool`
      UPDATE categories 
      SET show = ${!currentShowStatus} 
      WHERE id = ${id} 
      RETURNING *;
    `;

    res.json(result[0]);
  } catch (err) {
    console.error("Error toggling show status:", err);
    res.status(500).json({ error: "Error toggling show status" });
  }
});

module.exports = router;
