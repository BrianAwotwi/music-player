import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./middleware/auth.js";
import streamRoutes from "./middleware/stream.js";
import session from "express-session";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

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

app.get("/", (req, res) => {
  res.send("Inside the server");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
