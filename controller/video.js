const mongo = require("../config/db");
const videoService = require("../services/video");

const getVideos = async () => {
  const bucket = mongo.getFileBucket();

  const cursor = bucket.find({});
  for await (const doc of cursor) {
    console.log(doc);
  }
  return { message: "yo2" };
};

const uploadVideo = async (req, res) => {
  if (
    !req.headers["content-type"] ||
    !req.headers["content-type"].includes("multipart/form-data")
  ) {
    res
      .status(400)
      .send("Bad Request: Content-Type must be multipart/form-data");
    return;
  }

  const binaryData = req.file?.buffer;
  const title = req.body?.title;

  if (!binaryData) {
    res.status(400).send("Invalid file");
    return;
  }
  if (!title || typeof title != "string" || title.length == 0) {
    res.status(400).send("File title not provided");
    return;
  }

  const payload = { binaryData, title };

  try {
    await videoService.uploadVideo(payload);
    res.status(200).json({ message: "File uploaded successfully" });
  } catch (err) {
    console.error("Error while uploading file: " + err.message);
    res.status(500).send("Internal server error");
  }
};

module.exports = { getVideos, uploadVideo };
