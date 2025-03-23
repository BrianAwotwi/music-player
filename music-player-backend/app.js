import mongoose from "mongoose";
// import dotenv from "dotenv";

import User from "./models/User.js";
// import Post from "./models/Post.js";
import { users } from "./data/index.js";

const MongoURL = "mongodb://127.0.0.1:27017/MusicAppDb";

async function seedDatabase() {
  try {
    await mongoose.connect(MongoURL);

    if (mongoose.connection.readyState !== 1) {
      throw new Error("Cannot connect to DB");
    }

    console.log("✅ Connected to DB");

    await User.deleteMany();
    console.log("🗑️ Users collection cleared");

    await User.insertMany(users);
    console.log("✅ Users added successfully");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seedDatabase();
