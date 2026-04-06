const express = require("express");
const fs = require("fs");
const { google } = require("googleapis");
const multer = require("multer");
const path = require("path");
const stream = require("stream");

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

const router = express.Router();
// const apiKeys = require("../gdriveapikey.json");

const apiKeys = {
  client_email: process.env.CLIENT_EMAIL,
  private_key: process.env.PRIVATE_KEY,
};

const SCOPE = ["https://www.googleapis.com/auth/drive"];

async function authorize() {
  const jwtClient = new google.auth.JWT(
    apiKeys.client_email,
    null,
    apiKeys.private_key,
    SCOPE
  );

  await jwtClient.authorize();
  return jwtClient;
}

router.post("/", upload.single("catalogs"), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      throw new Error("No file uploaded");
    }

    const fileName = req.file.originalname;
    const filePath = req.file.path;
    const folderId = "1cpQww-7r8OUeOS1846KcJRApZ9SEFh6e";
    const authClient = await authorize();

    // Create a read stream from the temp file on disk
    const fileStream = fs.createReadStream(filePath);

    const fileResponse = await uploadFile(
      authClient,
      fileStream,
      fileName,
      folderId,
      req.file.mimetype
    );

    console.log("Uploaded File ID:", fileResponse.data.id);

    // Clean up: delete the temp file from disk
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });

    res.status(200).json({
      message: "File uploaded successfully",
      fileId: fileResponse.data.id,
    });
  } catch (error) {
    console.error("Error uploading file:", error.message);

    // Ensure cleanup happens even on error
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting temp file on failure:", err);
      });
    }

    res.status(500).json({ error: "Failed to upload file" });
  }
});

async function uploadFile(authClient, fileStream, fileName, folderId, mimeType) {
  const drive = google.drive({ version: "v3", auth: authClient });

  return drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
      mimeType: mimeType || "application/pdf",
    },
    media: {
      mimeType: mimeType || "application/pdf",
      body: fileStream,
    },
  });
}

async function deleteFile(auth, fileId) {
  const drive = google.drive({ version: "v3", auth });

  try {
    await drive.files.delete({ fileId });
    console.log(`File with ID ${fileId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting file:", error.message);
    throw new Error("Failed to delete file");
  }
}
// Export the function

router.delete("/:fileId", async (req, res) => {
  const { fileId } = req.params;
  const authClient = await authorize();

  try {
    await deleteFile(authClient, fileId);
    console.log("Deleted file:", fileId);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error.message);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

router.get("/download/:fileId", async (req, res) => {
  const fileId = req.params.fileId;

  try {
    const authClient = await authorize();
    const drive = google.drive({ version: "v3", auth: authClient });

    // Get the file content directly using fileId
    const fileStream = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    if (!fileStream || !fileStream.data) {
      return res.status(500).json({ error: "File stream is undefined" });
    }

    const fileMetadata = await drive.files.get({
      fileId,
      fields: "name",
    });

    const originalName = fileMetadata.data.name;
    console.log(originalName);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename = "${originalName}.pdf"`
    );
    res.setHeader("Content-Type", "application/pdf");

    fileStream.data.pipe(res);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ error: "Failed to download file" });
  }
});

module.exports = router;
