const multer = require("multer");

// Set up multer to handle file uploads
const storage = multer.memoryStorage(); // You can change this to disk storage if needed
const upload = multer({ storage: storage });

module.exports = { upload };
