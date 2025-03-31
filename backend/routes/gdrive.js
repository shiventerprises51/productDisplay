const express = require("express");
const fs = require("fs");
const { google } = require("googleapis");
const multer = require("multer");
const path = require("path");
const stream = require("stream");

const storage = multer.memoryStorage();
const upload = multer({ storage });

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
    if (!req.file || !req.file.buffer) {
      throw new Error("No file buffer available");
    }

    const fileName = req.file.originalname;
    // const folderId = "1aaLCO1JxGhgTNwjvHwOcsIJ7EaW8eW6D"; // Replace with your Drive folder ID
    const folderId = "1b75V5BG5ruuDQAj73s-_Q-Gov_GoYPR2";
    const authClient = await authorize();

    // ✅ Ensure file buffer is correctly passed
    const fileResponse = await uploadFile(
      authClient,
      req.file.buffer,
      fileName,
      folderId
    );

    console.log("Uploaded File ID:", fileResponse.data.id);
    res.status(200).json({
      message: "File uploaded successfully",
      fileId: fileResponse.data.id,
    });
  } catch (error) {
    console.error("Error uploading file:", error.message);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

async function uploadFile(authClient, fileBuffer, fileName, folderId) {
  const drive = google.drive({ version: "v3", auth: authClient });

  // ✅ Double-check buffer validity
  if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
    throw new Error("Invalid file buffer");
  }

  // ✅ Convert buffer into a readable stream
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileBuffer);

  return drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
      mimeType: "application/pdf",
    },
    media: {
      mimeType: "application/pdf",
      body: bufferStream,
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
