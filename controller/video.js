const mongo = require("../config/db");
const Video = require("../models/video");

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

  const bucket = mongo.getFileBucket();

  const nowDate = Date.now().toString();

  const customId = nowDate.substring(nowDate.length / 2, nowDate.length);

  try {
    const readStream = require("stream").Readable.from(binaryData);

    const writeStream = bucket.openUploadStream(title, { id: customId });

    readStream.pipe(writeStream);

    writeStream.on("finish", async () => {
      // Save video object if file is saved successfully
      const video = new Video({
        file_id: customId,
        title: title,
      });
      await video.save();

      res.status(200).send("File uploaded successfully!");
    });

    writeStream.on("error", (err) => {
      console.error("Error uploading file to GridFS: ", err);
      res.status(500).send("Internal Server Error");
    });
  } catch (err) {
    console.error("Error uploading file to GridFS: ", err);
    res.status(500).send("Internal server error");
  }
};

module.exports = { getVideos, uploadVideo };
