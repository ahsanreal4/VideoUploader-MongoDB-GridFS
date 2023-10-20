const mongoose = require("mongoose");
const { DB_URL, BUCKET_NAME } = require("../data/db");

class Db {
  async connectDB() {
    mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = mongoose.connection;

    db.on("error", (error) => {
      console.error("Database error:", error);
    });

    db.on("open", () => {
      console.log("Database connected!");
    });
  }

  getFileBucket() {
    return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: BUCKET_NAME,
    });
  }
}
module.exports = new Db();
