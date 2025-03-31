const express = require("express");
const pool = require("../config/db");

const router = express.Router();
//For STICKER Print
// Fetch all products
router.get("/", async (req, res) => {
  try {
    const result = await pool`SELECT * FROM sticker`;
    res.json(result);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// Add a new product
router.post("/sticker", async (req, res) => {
  const { name, category_id, quantity } = req.body;

  if (!name || !category_id || !quantity) {
    return res
      .status(400)
      .json({ error: "Name, category_id, and quantity are required" });
  }

  try {
    const result = await pool`
      INSERT INTO sticker (name, category_id, quantity)
      VALUES (${name}, ${category_id}, ${quantity})
      RETURNING *
    `;
    res.status(201).json(result[0]); // Return the newly added product
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "Error adding product" });
  }
});

// Update a Product
router.put("/sticker/:id", async (req, res) => {
  const { id } = req.params;
  const { name, category_id, quantity } = req.body;

  if (!id || !name || !category_id || !quantity) {
    return res
      .status(400)
      .json({ error: "ID, name, category_id, and quantity are required" });
  }

  try {
    const result = await pool`
      UPDATE sticker
      SET name = ${name}, category_id = ${category_id}, quantity = ${quantity}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(result[0]); // Return the updated product
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Error updating product" });
  }
});

// Delete a product by ID
router.delete("/sticker/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    const result = await pool`
      DELETE FROM sticker
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "Product deleted successfully",
      deletedProduct: result[0],
    });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Error deleting product" });
  }
});

module.exports = router;
