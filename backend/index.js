require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Routes
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const subcategoryRoutes = require("./routes/subcategories");
const uploadRoutes = require("./routes/upload");
const loginRoutes = require("./routes/login");
const printcatalog = require("./routes/printCatalog");
// const publiccatalog = require("./routes/publiccatalog");
const gdrive = require("./routes/gdrive");
const categoriesforadmin = require("./routes/categoriesforadmin");
const imageupload = require("./routes/imageupload");
const sticker = require("./routes/sticker");

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/upload-image", uploadRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/print-catalog", printcatalog);
// app.use("/api/publiccatalog", publiccatalog);
app.use("/api/gdrive", gdrive);
app.use("/api/categoriesforadmin", categoriesforadmin);
app.use("/api/imageupload", imageupload);
app.use("/api/sticker", sticker);

// Server setup
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
