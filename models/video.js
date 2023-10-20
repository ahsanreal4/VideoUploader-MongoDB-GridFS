const { Schema, model } = require("mongoose");

const videoSchema = new Schema({
  file_id: String,
  title: String,
});

module.exports = model("Video", videoSchema);
