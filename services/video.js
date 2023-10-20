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

const uploadVideo = async (payload) => {
  const { binaryData, title } = payload;

  const bucket = mongo.getFileBucket();

  const nowDate = Date.now().toString();

  const customId = nowDate.substring(nowDate.length / 2, nowDate.length);

  const readStream = require("stream").Readable.from(binaryData);

  const writeStream = bucket.openUploadStream(title, { id: customId });

  readStream.pipe(writeStream);

  return new Promise((res, rej) => {
    writeStream.on("finish", async () => {
      // Save video object if file is saved successfully
      const video = new Video({
        file_id: customId,
        title: title,
      });
      await video.save();
      res();
    });

    writeStream.on("error", (err) => {
      rej({ message: err.message });
    });
  });
};

module.exports = { getVideos, uploadVideo };
