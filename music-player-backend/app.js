import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";

import authRoutes from "./middleware/auth.js";
import streamRoutes from "./middleware/stream.js";
import searchRoutes from "./middleware/search.js";
import activityRoutes from "./middleware/activity.js";
import historyRoutes from "./middleware/history.js";
import likedRoutes from "./middleware/likedTracks.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", streamRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/library", activityRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/liked", likedRoutes);
app.get("/", (req, res) => res.send("Inside the server"));

// Connect to MongoDB, then start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(port, () => {
      console.log(`🚀 Listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
