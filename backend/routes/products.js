const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/productcount", async (req, res) => {
  const { subCategoryId, minPrice, maxPrice } = req.query;

  try {
    const result = await pool`
              SELECT COUNT(*) AS product_count
              FROM products
              WHERE subcategory_id = ${subCategoryId}
              AND price BETWEEN ${minPrice} AND ${maxPrice}`;
    res.json(result);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Error fetching products" });
  }
});

router.get("/productfilter", async (req, res) => {
  const { subCategoryId, minPrice, maxPrice, imgFlag } = req.query;
  // console.log(imgFlag);
  if (imgFlag !== "false") {
    // console.log("Failed");
    try {
      const result = await pool`
              SELECT name, price, details, image_url
        FROM products
        WHERE subcategory_id = ${subCategoryId}
        AND price BETWEEN ${minPrice} AND ${maxPrice}
        ORDER BY price ASC, name ASC`;
      res.json(result);
    } catch (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ error: "Error fetching products" });
    }
  } else {
    try {
      // const result = await pool`
      //         SELECT name, price, details, image_url
      //   FROM products
      //   WHERE subcategory_id = ${subCategoryId}
      //   AND price BETWEEN ${minPrice} AND ${maxPrice}
      //   ORDER BY price ASC, name ASC`;
      // console.log("Passed");
      const result = await pool`
    SELECT name, price, details, image_url
    FROM products
    WHERE subcategory_id = ${subCategoryId}
    AND price BETWEEN ${minPrice} AND ${maxPrice}
    AND image_url != 'https://i.ibb.co/p0nQhDT/image.png'
    ORDER BY price ASC, name ASC`;
      // console.log(result);
      res.json(result);
    } catch (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ error: "Error fetching products" });
    }
  }
});

router.get("/frontpage", async (req, res) => {
  try {
    const result =
      await pool`SELECT * FROM products WHERE image_url != 'https://i.ibb.co/p0nQhDT/image.png' ORDER BY subcategory_id ASC, price ASC, name ASC`;
    res.json(result);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// Fetch all products
router.get("/", async (req, res) => {
  try {
    const result =
      await pool`SELECT * FROM products ORDER BY price ASC, name ASC`;
    res.json(result);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// Fetch a single product by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // Validate the ID
  if (!id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    // Fetch the product from the database
    const result = await pool`SELECT * FROM products WHERE id = ${id}`;

    // Check if the product exists
    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Return the product
    res.status(200).json({ product: result[0] });
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new product
router.post("/", async (req, res) => {
  const { name, price, details, image_url, category_id, subcategory_id } =
    req.body;

  try {
    const result = await pool`
      INSERT INTO products (name, price, details, image_url, category_id, subcategory_id)
      VALUES (${name}, ${price}, ${details}, ${image_url}, ${category_id}, ${subcategory_id})
      RETURNING *;
    `;

    res.json(result[0]);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a product

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, details, image_url, category_id, subcategory_id } =
    req.body;

  // Check if the ID is provided and valid
  if (!id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  // Validate at least one field to update is provided
  if (
    !name &&
    !price &&
    !details &&
    !image_url &&
    !category_id &&
    !subcategory_id
  ) {
    return res
      .status(400)
      .json({ error: "At least one field must be provided to update" });
  }

  try {
    // Initialize an array for the updates and a list of values
    const updates = [];
    let counter = 1;
    const values = [];

    // Dynamically add fields to be updated
    if (name) {
      updates.push(`name = $${counter++}`);
      values.push(name);
    }
    if (price) {
      updates.push(`price = $${counter++}`);
      values.push(price);
    }
    if (details) {
      updates.push(`details = $${counter++}`);
      values.push(details);
    }
    if (image_url) {
      updates.push(`image_url = $${counter++}`);
      values.push(image_url);
    }
    if (category_id) {
      updates.push(`category_id = $${counter++}`);
      values.push(category_id);
    }
    if (subcategory_id) {
      updates.push(`subcategory_id = $${counter++}`);
      values.push(subcategory_id);
    }

    // Join the update clauses into a comma-separated string
    const updateClause = updates.join(", ");

    // Construct the query with placeholders
    const query = `
      UPDATE products
      SET ${updateClause}
      WHERE id = $${counter}
      RETURNING *
    `;

    // Add the product ID to the values array at the end
    values.push(id);

    // Use tagged template literal to execute the query
    const result = await pool(query, values); // This is where we use Neon properly

    // Check if the product exists
    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Send the successful response
    res.status(200).json({
      message: "Product updated successfully",
      product: result[0],
    });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool`
      DELETE FROM products WHERE id = ${id} RETURNING *;
    `;
    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result[0]);
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Error deleting product" });
  }
});

router.put("/update-img/:id", async (req, res) => {
  const { id } = req.params;
  const { img_file_id } = req.body;

  if (!img_file_id) {
    return res.status(400).json({ error: "img_file_id is required" });
  }

  try {
    const result = await pool`
      UPDATE products 
      SET img_file_id = ${img_file_id} 
      WHERE id = ${id} 
      RETURNING *;
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "img_file_id updated successfully",
      product: result[0],
    });
  } catch (err) {
    console.error("Error updating img_file_id:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//For STICKER Print
// Fetch all products
router.get("/name", async (req, res) => {
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
