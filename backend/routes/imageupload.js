const express = require("express");
const axios = require("axios");
const stream = require("stream");
const { google } = require("googleapis");

const router = express.Router();

const apiKeys = {
  client_email: process.env.CLIENT_EMAIL,
  private_key: process.env.PRIVATE_KEY, // Fix for newlines in env variable
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

router.get("/upload", async (req, res) => {
  res.send("Listening");
});

// ✅ Upload image from ImgBB to Google Drive
// router.post("/", async (req, res) => {
//   try {
//     const { imgUrl, fileName } = req.body; // Receive ImgBB URL & file name
//     const folderId = "1lTyp6iGrytPrAn0gRh0xPVUK0_NKJiHg"; // Replace with your Google Drive folder ID

//     if (!imgUrl || !fileName) {
//       return res.status(400).json({ error: "Image URL and filename required" });
//     }

//     const authClient = await authorize();

//     // Download image from ImgBB
//     const response = await axios({
//       url: imgUrl,
//       responseType: "arraybuffer",
//     });

//     // Convert buffer to a stream
//     const bufferStream = new stream.PassThrough();
//     bufferStream.end(Buffer.from(response.data));

//     // Upload to Google Drive
//     const drive = google.drive({ version: "v3", auth: authClient });
//     const fileResponse = await drive.files.create({
//       requestBody: {
//         name: fileName,
//         parents: [folderId],
//         mimeType: "image/jpeg",
//       },
//       media: {
//         mimeType: "image/jpeg",
//         body: bufferStream,
//       },
//       fields: "id",
//     });

//     console.log("Uploaded File ID:", fileResponse.data.id);
//     res.status(200).json({
//       message: "Image uploaded successfully",
//       fileId: fileResponse.data.id,
//       // driveUrl: `https://drive.google.com/uc?export=view&id=${fileResponse.data.id}`,
//     });
//   } catch (error) {
//     console.error("Error uploading image:", error.message);
//     res.status(500).json({ error: "Failed to upload image" });
//   }
// });

router.post("/", async (req, res) => {
  try {
    const { imgUrl, fileName } = req.body; // Receive ImgBB URL & file name
    const folderId = "1lTyp6iGrytPrAn0gRh0xPVUK0_NKJiHg"; // Replace with your Google Drive folder ID

    if (!imgUrl || !fileName) {
      return res.status(400).json({ error: "Image URL and filename required" });
    }

    const authClient = await authorize();

    // Download image from ImgBB
    const response = await axios({
      url: imgUrl,
      responseType: "arraybuffer",
    });

    // Convert buffer to a stream
    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(response.data));

    // Upload to Google Drive
    const drive = google.drive({ version: "v3", auth: authClient });
    const fileResponse = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
        mimeType: "image/jpeg",
      },
      media: {
        mimeType: "image/jpeg",
        body: bufferStream,
      },
      fields: "id",
    });

    console.log("Uploaded File ID:", fileResponse.data.id);

    // Set the file to be publicly accessible
    await drive.permissions.create({
      fileId: fileResponse.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    console.log("File permissions updated to public.");

    res.status(200).json({
      message: "Image uploaded successfully",
      fileId: fileResponse.data.id,
    });
  } catch (error) {
    console.error("Error uploading image:", error.message);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

module.exports = router;
