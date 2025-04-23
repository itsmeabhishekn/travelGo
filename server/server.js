const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app"); // Import the Express app

dotenv.config();

const PORT = process.env.PORT || 5000;
const DB = process.env.MONGODB_URI;

mongoose
  .connect(DB)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      // Now `app` is correctly imported
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
