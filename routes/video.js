const { Router } = require("express");
const video = require("../controller/video");
const { upload } = require("../config/multer");
const asyncJsonController = require("../utils/asyncJsonController");

const router = Router();

router.get(
  "/get",
  asyncJsonController((req) => video.getVideos(req))
);

router.post("/upload-video", upload.single("video"), (req, res) =>
  video.uploadVideo(req, res)
);

module.exports = router;
