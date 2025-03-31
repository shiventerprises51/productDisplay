const express = require("express");
const multer = require("multer"); // For handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();
// const storage = multer.memoryStorage();
// Endpoint to upload image to Imgbb
router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const imageFile = req.file; // Get the uploaded file (in memory)
    const imageUrl = await uploadToImgbb(imageFile); // Upload it to Imgbb

    res.json({ imageUrl }); // Send back the image URL from Imgbb
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Error uploading image" });
  }
});

// Helper function to upload image to Imgbb
const uploadToImgbb = async (imageFile) => {
  const formData = new FormData();

  // Convert Buffer to Blob (as FormData expects a Blob or File)
  const blob = new Blob([imageFile.buffer], { type: imageFile.mimetype });

  formData.append("image", blob, imageFile.originalname);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (result.success) {
    return result.data.url; // Return the image URL from Imgbb
  } else {
    throw new Error("Failed to upload image to Imgbb");
  }
};

module.exports = router;
