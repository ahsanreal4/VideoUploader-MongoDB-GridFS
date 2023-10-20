const express = require("express");
const mongo = require("./config/db");
const app = express();
const port = 3000;
const video = require("./routes/video");

app.use(express.json());

app.use("/video", video);

mongo.connectDB();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
